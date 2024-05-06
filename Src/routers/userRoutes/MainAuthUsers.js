const express = require('express');
const MainAuthRoute = express.Router(); // Use express.Router() directly
const validateReqBody = require('../../middlewares/validateReqBody');
const { createUserAccount, userLogin } = require('../../controllers/userWithMainAuth'); // Use camelCase for function names

// Middleware to validate request body
MainAuthRoute.use(validateReqBody);

// Route to create a user account
MainAuthRoute.post('/register', createUserAccount); // Use 'sign_up' instead of 'sin_up', and use camelCase for function name

// Route to log in a user
MainAuthRoute.post('/login', userLogin); // Use 'log_in' instead of 'loging', and use camelCase for function name

// Export the route to handle user account creation and logging in
module.exports = MainAuthRoute;
