const UserDetails = require('express').Router();
const upDateUser = require('../../controllers/upDateUser');
const getUserInfo = require('../../controllers/userInfo');
const verifyAccess = require('../../middlewares/verifyAccess');

UserDetails.use(verifyAccess);

UserDetails.route('/use_info').get(getUserInfo);

UserDetails.route('/update_user_info').patch(upDateUser);

module.exports = UserDetails;
