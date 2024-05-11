const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const path = require('path');
const fsPromise = require('fs/promises');
const userModel = require('../modules/userModel');
const { nanoid } = require('nanoid/non-secure');

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

      // Structure user info to be sent
      const { name, username, profilePic } = updatedUser;

      // Send success response with user info
      res.status(200).json({ name, username, profilePic });
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
   const profilePic = req.files.profilePic;
   try {
      if (!profilePic) {
         res.status(400);
         throw new Error('Profile photo to be updated not found provide one');
      }

      const user = await userModel.findOne({ UserID });

      if (!user) {
         res.status(400);
         throw new Error('User not found');
      }

      if (user.profilePic.includes('http://localhost:4040/api/v1/profilePic')) {
         const oldUserProfilePic = user.profilePic.split('profilePic/').pop();

         await fsPromise.unlink(path.join(__dirname, '../', 'medias', 'profilePhoto', oldUserProfilePic));
      }

      // Generate a unique profile picture name
      const profilePicName = `${nanoid(15)}.jpg`;

      await sharp(profilePic.tempFilePath)
         .resize({ width: 200, height: 200, fit: 'cover' })
         .jpeg({ quality: 90 })
         .toFile(path.join(__dirname, '../', 'medias', 'profilePhoto', profilePicName));

      // Construct the profile picture URL
      const profilePicUrl = `http://localhost:4040/api/v1/profilePic/${profilePicName}`;

      user.profilePic = profilePicUrl;
      const updatedUser = await user.save();

      // Structure user info to be sent
      const { name, username, profilePic } = updatedUser;

      // Send success response with user info
      res.status(200).json({ name, username, profilePic });
   } catch (error) {
      res.status(500);
      throw new Error('Server error unable to perform this action please try again later');
   }
});

module.exports = { upDateUser, upDateUserProfilePic };
