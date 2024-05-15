const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const path = require('path');
const fsPromise = require('fs/promises');
const userModel = require('../modules/userModel');
const { nanoid } = require('nanoid/non-secure');
const { ServerError } = require('../middlewares/errorHandler');

// Route handler function for updating user info this is a privet route
// HTTP method (PATCH)
// Development uri (http://localhost:4040/api/v1/account/details/update_user_info)
// Production uri ()
const upDateUser = asyncHandler(async (req, res) => {
   const UserID = req.user;
   const updateFields = req.body;

   // Check if any field is present in the req.body
   if (Object.keys(updateFields).length === 0) {
      throw new ServerError({ errMassage: 'No fields to update', errStatusCode: 400, isOperational: false });
   }

   try {
      // Check for user in DB an update no need for checking if USerID is present because verify access middleware does that
      const updatedUser = await userModel.findOneAndUpdate(UserID, updateFields, { new: true });

      // Structure user info to be sent
      const { name, username, profilePic } = updatedUser;

      // Send success response with user info
      res.status(200).json({ name, username, profilePic });
   } catch (error) {
      throw new ServerError({
         errMassage: 'Server error unable to perform this action please try again later',
         errStatusCode: 500,
         isOperational: true,
         error: error,
      });
   }
});

// Route handler function for updating user profile photo this is a privet route
// HTTP method (PATCH)
// Development uri (http://localhost:4040/api/v1/account/details/update_user_info_pic)
// Production uri ()
const upDateUserProfilePic = asyncHandler(async (req, res) => {
   const UserID = req.user;
   const profilePic = req.files.profilePic;

   if (!profilePic) {
      throw new ServerError({
         errMassage: 'Profile photo to be updated not found provide one',
         errStatusCode: 400,
         isOperational: false,
      });
   }

   try {
      // Check for user in DB no need for checking if USerID is present because verify access middleware does that
      const user = await userModel.findOne({ UserID });

      if (user.profilePic.includes(`${process.env.DOMAIN_2}/api/v1/photo/get_profile_pic`)) {
         const oldUserProfilePic = user.profilePic.split('get_profile_pic/').pop();

         await fsPromise.unlink(path.join(__dirname, '../', 'medias', 'profilePhoto', oldUserProfilePic));
      }

      // Generate a unique profile picture name
      const profilePicName = `${nanoid(15)}.jpg`;

      await sharp(profilePic.tempFilePath)
         .resize({ width: 200, height: 200, fit: 'cover' })
         .jpeg({ quality: 90 })
         .toFile(path.join(__dirname, '../', 'medias', 'profilePhoto', profilePicName));

      // Construct the profile picture URL
      const profilePicUrl = `${process.env.DOMAIN_2}/api/v1/photo/get_profile_pic/${profilePicName}`;

      user.profilePic = profilePicUrl;
      const updatedUser = await user.save();

      // Structure user info to be sent
      const { name, username, profilePic } = updatedUser;

      // Send success response with user info
      res.status(200).json({ name, username, profilePic });
   } catch (error) {
      throw new ServerError({
         errMassage: 'Server error unable to perform this action please try again later',
         errStatusCode: 500,
         isOperational: true,
         error: error,
      });
   }
});

module.exports = { upDateUser, upDateUserProfilePic };
