const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');
const generateToken = require('../modules/generateToken');
const { setCookie, clearCookie } = require('../modules/setCookie');
const myLogger = require('../modules/logger');

const errorMsg =
   'Invalid refresh token. This is an attempt to hack this account. You will be logged out. Please re-login to protect your account.';

const refreshAccessToken = asyncHandler(async (req, res) => {
   if (!req.signedCookies?.refreshToken) {
      res.status(401);
      throw new Error('Refresh token is missing');
   }

   const oldRefreshToken = req.signedCookies.refreshToken;
   clearCookie.refresh(res);

   const user = await userModel.findOne({ tokens: oldRefreshToken }).exec();
   console.log(user);

   if (!user) {
      jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            res.sendStatus(401);
         }
         const hackedUser = await userModel.findOneAndUpdate({ UserID: decoded.UserID }, { tokens: [] }).exec();
      });
      res.status(403);
      throw new Error(errorMsg);
   }

   const newTokenArray = user.tokens.filter((token) => token !== oldRefreshToken);
   console.log(newTokenArray);

   jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
         user.tokens = newTokenArray;
         await user.save();
         res.sendStatus(401);
      }

      const { refreshToken, accessToken } = generateToken(decoded.UserID);

      user.tokens = [...newTokenArray, refreshToken];
      await user.save();

      setCookie(res, refreshToken, accessToken);
      res.sendStatus(200);
   });
});

module.exports = refreshAccessToken;
