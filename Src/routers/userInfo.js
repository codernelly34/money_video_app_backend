const UserInfo = require('express').Router();
const asyncHandler = require('express-async-handler');
const verifyAccess = require('../middlewares/verifyAccess');
const UserModel = require('../modules/userModel');

// Protect this route by verifying access to it from the verifyAccess middleware
UserInfo.use(verifyAccess);

UserInfo.route('/').get(
   asyncHandler(async (req, res) => {
      // Get the user from req.user set in verifyAccess if verification is successful
      const user = req.user.username;

      // Get user info from DB, if the verifyAccess is there will be a user no need checking for possible Errors
      const useInfo = await UserModel.findOne({ username: user });

      // Destructure User info from useInfo
      const { name, email, username, profilePic } = useInfo;

      // send a successful response with user info
      res.status(200).json({ name, email, username, profilePic });
   })
);

module.exports = UserInfo;
