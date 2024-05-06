const UserDetails = require('express').Router();
const getUserInfo = require('../../controllers/userInfo');
const verifyAccess = require('../../middlewares/verifyAccess');

UserDetails.use(verifyAccess);

UserDetails.route('/use_info').get(getUserInfo);

module.exports = UserDetails;
