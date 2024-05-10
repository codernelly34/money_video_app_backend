const UserDetails = require('express').Router();
const fileUpload = require('express-fileupload');
const { upDateUser, upDateUserProfilePic } = require('../../controllers/upDateUser');
const getUserInfo = require('../../controllers/userInfo');
const verifyAccess = require('../../middlewares/verifyAccess');

// Middleware for verifying if user have access to this privet route's
UserDetails.use(verifyAccess);

// Route for sending user info
UserDetails.route('/use_info').get(getUserInfo);

// Route for updating user info
UserDetails.route('/update_user_info').patch(upDateUser);

// Route for updating user profile photo
UserDetails.route('/update_user_info_pic').patch(fileUpload({ useTempFiles: true }), upDateUserProfilePic);

module.exports = UserDetails;
