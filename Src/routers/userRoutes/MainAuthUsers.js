const MainAuthRoute = require('express').Router();
const validateReqBody = require('../../middlewares/validateReqBody');
const { create_account, user_login } = require('../../controllers/userWithMainAuth');

MainAuthRoute.use(validateReqBody);

// Route to create user account
MainAuthRoute.route('/sin_up').post(create_account);

// Route to logging User
MainAuthRoute.route('/log_in').post(user_login);

// Finally export route to handle create/logging User account
module.exports = MainAuthRoute;
