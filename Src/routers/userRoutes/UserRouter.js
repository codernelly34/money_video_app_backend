const UserRouter = require('express').Router();
const AuthGoogleRoute = require('./GoogleAuthUsers');
const MainAuthRoute = require('./MainAuthUsers');

UserRouter.use('/', AuthGoogleRoute);
UserRouter.use('/', MainAuthRoute);

module.exports = UserRouter;
