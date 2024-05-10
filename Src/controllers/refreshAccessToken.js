const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');
const generateToken = require('../modules/generateToken');
const setCookie = require('../modules/setCookie');

// Route handler function for refreshing user access token
// HTTP method (GET)
// Development uri (http://localhost:4040/api/v1/account/refresh_access)
// Production uri ()
const refreshAccessToken = asyncHandler(async (req, res) => {
   // Check if refreshToken is present in signed cookies
   if (!req.signedCookies.refreshToken) {
      res.status(401);
      throw new Error('Refresh token is missing');
   }

   try {
      // Set the refresh token
      const refreshToken = req.signedCookies.refreshToken;

      const errorMsg =
         'Invalid refresh token this is an attempt to hack this account you will be logout completely re-login to protect your account';

      // Check if refresh token is associated with a user in the database
      const user = await userModel.findOne({ tokens: refreshToken });
      if (!user) {
         res.clearCookie();
         res.status(403);
         throw new Error(errorMsg);
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            res.clearCookie('refreshToken');
            res.status(403);
            throw new Error(errorMsg);
         }

         res.clearCookie();

         // Generate a new tokens
         const { refreshToken, accessToken } = generateToken(user.UserID);

         // Set cookie with new tokens
         setCookie(res, refreshToken, accessToken);

         // Send success response
         res.sendStatus(200);
      });
   } catch (error) {
      res.status(500);
      throw new Error('Internal Server Error');
   }
});

module.exports = refreshAccessToken;
