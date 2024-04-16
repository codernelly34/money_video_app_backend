const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAccess = (req, res, next) => {
   if (!req.cookies || !req.cookies.accessToken) {
      res.status(401);
      throw new Error('Unauthorized');
   }

   const accessToken = req.cookies.accessToken;

   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
         res.status(401);
         throw new Error('Unauthorized');
      }
      req.user = decoded;
      next(); // Call the next middleware function after token verification and refresh
   });
};

module.exports = verifyAccess;
