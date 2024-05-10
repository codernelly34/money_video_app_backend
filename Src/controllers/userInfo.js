const asyncHandler = require('express-async-handler');
const userModel = require('../modules/userModel');

// Route handler function for sending user info this is a privet route
// HTTP method (GET)
// Development uri (http://localhost:4040/api/v1/account/details/use_info)
// Production uri ()
const getUserInfo = asyncHandler(async (req, res) => {
   // Extract UserID from request dot user set in the verify access middleware
   const UserID = req.user;

   try {
      // Check for user in DB no need for checking if USerID is present because verify access middleware does that
      const userInfo = await userModel.findOne({ UserID });

      // Extract user info from userInfo
      const { name, username, profilePic } = userInfo;

      // Send back success response with user info if above validation successful
      res.status(200).json({ name, username, profilePic });
   } catch (error) {
      res.status(500);
      throw new Error('Server error unable to perform this action please try again later');
   }
});

module.exports = getUserInfo;
