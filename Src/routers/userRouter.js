const userRoute = require('express').Router();
const userWithMainOauth = require('express').Router();
const userWithGoogleOauth = require('express').Router();
const validateReqBody = require('../middlewares/validateReqBody');
const { create_account, user_login } = require('../controllers/userWithMainOauth');

userWithMainOauth.use(validateReqBody);

// Route to create user account
userWithMainOauth.route('/sin_up').post(create_account);

// Route to logging User
userWithMainOauth.route('/log_in').post(user_login);

userWithGoogleOauth.route('/');

userRoute.use('/main_auth', userWithMainOauth);
userRoute.use('/google_auth', userWithGoogleOauth);

// Finally export route to handle create/logging User account
module.exports = userRoute;
