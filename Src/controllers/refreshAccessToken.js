const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');
const generateToken = require('../modules/generateToken');
const setCookie = require('../modules/setCookie');

// Route handler function for refreshing user access
//                     Endpoints
// Development at PATCH http://localhost:4040/api/v1/refresh_access
// Production  at
const refreshAccessToken = asyncHandler(async (req, res) => {
   // Check if refreshToken is present in signed cookies
   if (!req.signedCookies.refreshToken) {
      res.status(401);
      throw new Error('Refresh token is missing');
   }

   try {
      const refreshToken = req.signedCookies.refreshToken;

      // Check if refresh token is associated with a user in the database
      const user = await userModel.findOne({ tokens: refreshToken });
      if (!user) {
         res.clearCookie('refreshToken');
         res.status(403);
         throw new Error('Invalid refresh token');
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            res.clearCookie('refreshToken');
            res.status(403);
            throw new Error('Invalid refresh token');
         }

         res.clearCookie();

         // Generate a new access token
         const { refreshToken, accessToken } = generateToken(user.UserID);

         // Set the new access token as a signed cookie
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
