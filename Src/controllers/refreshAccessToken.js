const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');
const generateToken = require('../modules/generateToken');
const setCookie = require('../modules/setCookie');

const refreshAccessToken = asyncHandler(async (req, res) => {
   // Check if refreshToken is present
   if (!req.signedCookies.refreshToken) {
      res.status(401);
      throw new Error('Refresh token is missing');
   }

   try {
      const refreshToken = req.signedCookies.refreshToken;
      const checkUserInDB = await userModel.findOne({ tokens: refreshAccessToken });
      if (!checkUserInDB) {
         res.clearCookie();
         res.status(403);
         throw new Error(
            'Forbidden this is an attempt to hack an account this account you have been logout login to authorized access'
         );
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            res.clearCookie();
            res.status(403);
            throw new Error('Invalid access token');
         }

         const getUserFromDB = await userModel.findOne({ UserID: decoded.UserID });

         const accessToken = jwt.sign({ UserID: getUserFromDB.UserID }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '2h',
         });
         res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: 'lax',
            secure: true,
            signed: true,
            domain: 'localhost',
         });

         res.sendStatus(200);
      });
   } catch (error) {
      res.status(500);
      throw new Error('Internal Server Error');
   }
});

module.exports = refreshAccessToken;
