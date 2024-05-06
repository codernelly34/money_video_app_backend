const express = require('express');
const MainAuthRoute = express.Router();
const validateReqBody = require('../../middlewares/validateReqBody');
const { createUserAccount, userLogin } = require('../../controllers/userWithMainAuth');

// Middleware to validate request body
MainAuthRoute.use(validateReqBody);

// Route to create a user account
MainAuthRoute.post('/register', createUserAccount);

// Route to log in a user
MainAuthRoute.post('/login', userLogin);

// Export the route to handle user account creation and logging in
module.exports = MainAuthRoute;
