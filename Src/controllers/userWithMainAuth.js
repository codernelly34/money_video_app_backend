const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const userModel = require('../modules/userModel');
const { nanoid } = require('nanoid/non-secure');
const generateToken = require('../utils/generateToken');
const { setCookie } = require('../utils/setCookie');
const fsPromise = require('fs/promises');
const path = require('path');
const ServerError = require('../utils/customErrorClass');

// Route handler function for creating a user account
// HTTP method (POST)
// Development uri (http://localhost:4040/api/v1/account/main/register)
// Production uri ()
const createUserAccount = asyncHandler(async (req, res) => {
   // Extract user info from req.validBody which is set in validateReqBody after validation is complete
   const { name, email, username, password } = req.validBody;

   // Check if name is already in use
   const nameExists = await userModel.findOne({ name });
   if (nameExists) {
      throw new ServerError({ errMassage: 'Name already in use', errStatusCode: 400, isOperational: false });
   }

   // Check if email is already in use
   const emailExists = await userModel.findOne({ email });
   if (emailExists) {
      throw new ServerError({ errMassage: 'Email already in use', errStatusCode: 400, isOperational: false });
   }

   // Check if username is already in use
   const usernameExists = await userModel.findOne({ username });
   if (usernameExists) {
      throw new ServerError({ errMassage: 'Username already in use', errStatusCode: 400, isOperational: false });
   }

   try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 11);

      // Generate a unique userID
      const UserID = nanoid(6);

      // Create User profile photo with SVG using the first letter of the user's name
      const createProfilePic = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <rect width="200" height="200" fill="#AAAAAA"/>
          <text x="50%" y="50%" text-anchor="middle" alignment-baseline="central" font-family="Arial" font-size="40" fill="#FFFFFF">${name
             .charAt(0)
             .toUpperCase()}</text>
        </svg>
      `;

      // Generate a unique profile picture name
      const profilePicName = `${nanoid(15)}.svg`;

      // Define the file path to save the image
      const profilePicFilePath = path.join(__dirname, '../', 'medias', 'profilePhoto', profilePicName);

      // Save the User profile photo to define path 👆🏿
      await fsPromise.writeFile(profilePicFilePath, createProfilePic);

      // Construct the profile picture URL
      const profilePicUrl = `${process.env.DOMAIN_2}/api/v1/photo/get_profile_pic/${profilePicName}`;

      // Create user account if the above validations are successful
      await userModel.create({ name, email, username, UserID, profilePic: profilePicUrl, password: hashedPassword });

      // Send success response if user has been created
      res.sendStatus(201);
   } catch (error) {
      throw new ServerError({
         errMassage: 'Server error unable to perform this action please try again later',
         errStatusCode: 500,
         isOperational: true,
         error: error,
      });
   }
});

// Route handler function for user login
// HTTP method (POST)
// Development uri (http://localhost:4040/api/v1/account/main/login)
// Production uri ()
const userLogin = asyncHandler(async (req, res) => {
   // Extract user info from req.validBody which is set in validateReqBody after validation is complete
   const { email, password } = req.validBody;

   // Check if user with the given email exists
   const user = await userModel.findOne({ email });
   if (!user) {
      throw new ServerError({ errMassage: 'Invalid Email', errStatusCode: 400, isOperational: false });
   }

   // Compare password
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      throw new ServerError({ errMassage: 'Invalid Password', errStatusCode: 400, isOperational: false });
   }

   try {
      // Generate tokens
      const accessToken = generateToken.accessToken(user.UserID);
      const refreshToken = generateToken.refreshToken(user.UserID);

      // Set cookies
      setCookie(res, refreshToken, accessToken);

      // Update user tokens
      user.tokens.push(refreshToken);
      await user.save();

      // Structure user info to be sent
      const userInfo = {
         name: user.name,
         username: user.username,
         profilePic: user.profilePic,
      };

      // Send success response with user info
      res.status(200).json(userInfo);
   } catch (error) {
      throw new ServerError({
         errMassage: 'Server error unable to perform this action please try again later',
         errStatusCode: 500,
         isOperational: true,
         error: error,
      });
   }
});

module.exports = { createUserAccount, userLogin };
