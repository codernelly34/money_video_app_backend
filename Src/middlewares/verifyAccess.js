const jwt = require('jsonwebtoken');
const ServerError = require('../utils/customErrorClass');
require('dotenv/config');

// Middleware function to verify if User have to protected route
const verifyAccess = (req, _res, next) => {
   // Check if accessToken is present
   if (!req.signedCookies.accessToken) {
      throw new ServerError({ errMassage: 'Access token is missing', errStatusCode: 401, isOperational: false });
   }

   // Verify accessToken
   const accessToken = req.signedCookies.accessToken;
   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
         throw new ServerError({ errMassage: 'Invalid access token', errStatusCode: 401, isOperational: false });
      }

      // Set req.user to equal decoded which is the payload from the token if verification is successful
      req.user = decoded.UserID;
      next(); // Call the next middleware function after token verification is successful
   });
};

module.exports = verifyAccess;
