const jwt = require('jsonwebtoken');
require('dotenv/config');

const generateToken = {
   refreshToken: (UserID) => {
      return jwt.sign({ UserID }, process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '4d' });
   },

   accessToken: (UserID) => {
      return jwt.sign({ UserID }, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '2m' });
   },
};

module.exports = generateToken;
