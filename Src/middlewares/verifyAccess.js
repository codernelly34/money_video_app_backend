const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware function to verify if User have to protected route
const verifyAccess = (req, res, next) => {
   // Check if cookie needed for verification are present
   if (!req.cookies || !req.cookies.accessToken) {
      res.status(401);
      throw new Error('Unauthorized');
   }

   // Set access token to equal req.cookies.accessToken which has the token to be verified
   const accessToken = req.cookies.accessToken;

   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
         res.status(401);
         throw new Error('Unauthorized');
      }

      // Set req.user to equal decoded which is the payload from the token if verification is successful
      req.user = decoded;
      next(); // Call the next middleware function after token verification is successful
   });
};

module.exports = verifyAccess;
