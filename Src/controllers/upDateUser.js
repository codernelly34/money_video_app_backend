const asyncHandler = require('express-async-handler');
const userModel = require('../modules/userModel');

// Route handler function for updating user info this is a privet route
// HTTP method (PATCH)
// Development uri (http://localhost:4040/api/v1/account/details/update_user_info)
// Production uri ()
const upDateUser = asyncHandler(async (req, res) => {
   const UserID = req.user;
   const updateFields = req.body;
   try {
      // Check if any field is present in the req.body
      if (Object.keys(updateFields).length === 0) {
         res.status(400);
         throw new Error('No fields to update');
      }

      const updatedUser = await userModel.findOneAndUpdate(UserID, updateFields, { new: true });

      if (!updatedUser) {
         res.status(400);
         throw new Error('User not found');
      }
   } catch (error) {
      res.status(500);
      throw new Error('Server error unable to perform this action please try again later');
   }
});

// Route handler function for updating user profile photo this is a privet route
// HTTP method (PATCH)
// Development uri (http://localhost:4040/api/v1/account/details/update_user_info_pic)
// Production uri ()
const upDateUserProfilePic = asyncHandler(async (req, res) => {
   const UserID = req.user;
   try {
   } catch (error) {
      res.status(500);
      throw new Error('Server error unable to perform this action please try again later');
   }
});

module.exports = { upDateUser, upDateUserProfilePic };
