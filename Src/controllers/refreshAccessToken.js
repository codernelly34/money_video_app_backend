const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');
const generateToken = require('../utils/generateToken');
const { setCookie, clearCookie } = require('../utils/setCookie');
const { ServerError } = require('../middlewares/errorHandler');

const errorMsg =
   'Invalid refresh token. This is an attempt to hack this account. You will be logged out. Please re-login to protect your account.';

const refreshAccessToken = asyncHandler(async (req, res) => {
   if (!req.signedCookies?.refreshToken) {
      throw new ServerError({ errMassage: 'Refresh token is missing', errStatusCode: 401, isOperational: false });
      return;
   }

   const oldRefreshToken = req.signedCookies.refreshToken;
   clearCookie.refresh(res);
   clearCookie.access(res);

   const user = await userModel.findOne({ tokens: oldRefreshToken }).exec();
   console.log(user);

   if (!user) {
      jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            res.sendStatus(401);
         }
         const hackedUser = await userModel.findOneAndUpdate({ UserID: decoded.UserID }, { tokens: [] }).exec();
      });
      throw new ServerError({ errMassage: errorMsg, errStatusCode: 403, isOperational: false });
      return;
   }

   const newTokenArray = user.tokens.filter((token) => token !== oldRefreshToken);
   console.log(newTokenArray);

   jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      try {
         if (err) {
            user.tokens = newTokenArray;
            await user.save();
            res.sendStatus(401);
            return;
         }

         const { refreshToken, accessToken } = generateToken(decoded.UserID);

         user.tokens = [...newTokenArray, refreshToken];
         await user.save();

         setCookie(res, refreshToken, accessToken);
         res.sendStatus(200);
      } catch (error) {
         throw new ServerError({
            errMassage: 'Server error unable to perform this action please try again later',
            errStatusCode: 500,
            isOperational: true,
            error: error,
         });
      }
   });
});

module.exports = refreshAccessToken;
