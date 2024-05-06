const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');

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

         // Generate a new access token
         const accessToken = jwt.sign({ UserID: user.UserID }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '2h',
         });

         // Set the new access token as a signed cookie
         res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
            sameSite: 'lax',
            secure: true,
            signed: true,
            domain: 'localhost',
         });

         // Send success response
         res.sendStatus(200);
      });
   } catch (error) {
      console.error('Error refreshing access token:', error);
      res.status(500);
      throw new Error('Internal Server Error');
   }
});

module.exports = refreshAccessToken;
