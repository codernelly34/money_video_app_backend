const jwt = require('jsonwebtoken');
require('dotenv/config');

// Middleware function to verify if User have to protected route
const verifyAccess = (req, res, next) => {
   // Check if accessToken is present
   if (!req.signedCookies.accessToken) {
      res.status(401);
      throw new Error('Access token is missing');
   }

   // Verify accessToken
   const accessToken = req.signedCookies.accessToken;
   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
         res.status(401);
         throw new Error('Invalid access token');
      }

      // Set req.user to equal decoded which is the payload from the token if verification is successful
      req.user = decoded;
      next(); // Call the next middleware function after token verification is successful
   });
};

module.exports = verifyAccess;
