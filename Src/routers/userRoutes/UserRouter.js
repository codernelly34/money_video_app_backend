const express = require('express');
const UserRouter = express.Router();
const MainAuthRoute = require('./MainAuthUsers');
const GoogleAuthRoute = require('./GoogleAuthUsers');
const UserDetailsRoute = require('./privetUserDetails');

// Routes for Google OAuth authentication
UserRouter.use('/google', GoogleAuthRoute);

// Routes for main authentication
UserRouter.use('/main', MainAuthRoute);

// Routes for accessing user details
UserRouter.use('/details', UserDetailsRoute);

module.exports = UserRouter;
