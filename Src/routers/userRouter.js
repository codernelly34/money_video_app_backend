const userRoute = require('express').Router();
const validateReqBody = require('../middlewares/validateReqBody');
const { create_account, user_login } = require('../controllers/userController');

userRoute.use(validateReqBody);

// Route to create user account
userRoute.route('/sin_up').post(create_account);

// Route to logging User
userRoute.route('/log_in').post(user_login);

// Finally export route to handle create/logging User account
module.exports = userRoute;
