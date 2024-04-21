// Middleware function to validate User info when creating an account or logging
const validateReqBody = (req, res, next) => {
   let { name, username, email, password } = req.body;

   // Validate the name of a User
   if (name !== undefined && !name.split(' ').length < 0) {
      res.status(400);
      throw new Error('Please provide both first and last name');
   }

   // Validate the username of a User
   if (!username || !username.startsWith('@')) {
      res.status(400);
      throw new Error("Please provide a username starting with '@'");
   }

   // Validate the email of a User
   if (!email || !email.endsWith('@gmail.com')) {
      res.status(400);
      throw new Error('Please provide a valid Gmail address');
   }

   // Validate the password of a User
   if (!password || password.length < 4) {
      res.status(400);
      throw new Error('Please provide a password with at least 4 characters');
   }

   // Assign valid user info to req.validBody
   req.validBody = { name, email, username, password };

   next(); // Call next middleware if validation is successful
};

// Finally export the validateReqBody so it can be used
module.exports = validateReqBody;
