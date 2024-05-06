const asyncHandler = require('express-async-handler');
const userModel = require('../modules/userModel');

const getUserInfo = asyncHandler(async (req, res) => {
   try {
      const UserID = req.user;

      const userInfo = await userModel.findOne({ UserID });

      const { name, username, profilePic } = userInfo;

      res.status(200).json({ name, username, profilePic });
   } catch (error) {
      res.status(500);
      throw new Error('Server error please try again later');
   }
});

module.exports = getUserInfo;