const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');
const generateToken = require('../utils/generateToken');
const { setCookie, clearCookie } = require('../utils/setCookie');
const ServerError = require('../utils/customErrorClass');

const errorMsg =
   'Invalid refresh token. This is an attempt to hack this account. You will be logged out. Please re-login to protect your account.';

const refreshAccessToken = asyncHandler(async (req, res) => {
   // Check if the refresh token exists in the signed cookies of the request.
   if (!req.signedCookies?.refreshToken) {
      throw new ServerError({ errMassage: 'Refresh token is missing', errStatusCode: 401, isOperational: false });
      return;
   }

   // Retrieve the signed 'refreshToken' cookie from the incoming request.
   const oldRefreshToken = req.signedCookies.refreshToken;
   clearCookie.refresh(res);

   // Retrieve the user associated with the old refresh token from the database.
   const user = await userModel.findOne({ tokens: oldRefreshToken }).exec();
   console.log(user);

   if (!user) {
      // Verify the old refresh token using the secret key and handle the verification result.
      jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            res.sendStatus(401);
         }
         // Set the user's tokens array to an empty array if the old refresh token is invalid.
         const hackedUser = await userModel.findOneAndUpdate({ UserID: decoded.UserID }, { tokens: [] }).exec();
      });
      throw new ServerError({ errMassage: errorMsg, errStatusCode: 403, isOperational: false });
      return;
   }

   // Filter out the old refresh token from the user's tokens array.
   const newTokenArray = user.tokens.filter((token) => token !== oldRefreshToken);
   console.log(newTokenArray);

   jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      try {
         if (err) {
            // Set the user's tokens array to the new token array (without the old refresh token) if the old refresh token is invalid.
            user.tokens = newTokenArray;
            await user.save();
            res.sendStatus(401);
            return;
         }

         // Generate new access and refresh tokens.
         const accessToken = generateToken.accessToken(decoded.UserID);
         const refreshToken = generateToken.refreshToken(decoded.UserID);

         // Update the user's tokens array with the new token array (including the new refresh token).
         user.tokens = [...newTokenArray, refreshToken];
         await user.save();

         // Set the new refresh token in the response cookie.
         setCookie(res, refreshToken, accessToken);

         // Send a success status code.
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
