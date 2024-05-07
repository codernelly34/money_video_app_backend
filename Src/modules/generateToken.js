const jwt = require('jsonwebtoken');
require('dotenv/config');

const generateToken = (UserID) => {
   const refreshToken = jwt.sign({ UserID }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '4d',
   });

   const accessToken = jwt.sign({ UserID }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '5h',
   });

   return { refreshToken, accessToken };
};

module.exports = generateToken;
