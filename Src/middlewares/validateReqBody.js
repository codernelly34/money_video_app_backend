const { ServerError } = require('./errorHandler');

// Middleware function to validate User info when creating an account or logging
const validateReqBody = (req, res, next) => {
   let { name, username, email, password } = req.body;

   // Validate the name of a User
   if (name !== undefined && !name.split(' ').length < 0) {
      throw new ServerError({
         errMassage: 'Please provide both first and last name',
         errStatusCode: 400,
         isOperational: false,
      });
   }

   // Validate the username of a User
   if (!username || !username.startsWith('@')) {
      throw new ServerError({
         errMassage: "Please provide a username starting with '@'",
         errStatusCode: 400,
         isOperational: false,
      });
   }

   // Validate the email of a User
   if (!email || !email.endsWith('@gmail.com')) {
      throw new ServerError({
         errMassage: 'Please provide a valid Gmail address',
         errStatusCode: 400,
         isOperational: false,
      });
   }

   // Validate the password of a User
   if (!password || password.length < 4) {
      throw new ServerError({
         errMassage: 'Please provide a password with at least 4 characters',
         errStatusCode: 400,
         isOperational: false,
      });
   }

   // Assign valid user info to req.validBody
   req.validBody = { name, email, username, password };
   req.body = null;

   next(); // Call next middleware if validation is successful
};

// Finally export the validateReqBody so it can be used
module.exports = validateReqBody;
