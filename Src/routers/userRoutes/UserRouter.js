const UserRouter = require('express').Router();
const AuthGoogleRoute = require('./GoogleAuthUsers');
const MainAuthRoute = require('./MainAuthUsers');
const UserDetails = require('./privetUserDetails');

UserRouter.use('/', AuthGoogleRoute);
UserRouter.use('/', MainAuthRoute);
UserRouter.use('/', UserDetails);

module.exports = UserRouter;
