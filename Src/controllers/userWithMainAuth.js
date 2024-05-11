const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const userModel = require('../modules/userModel');
const { nanoid } = require('nanoid/non-secure');
const generateToken = require('../modules/generateToken');
const setCookie = require('../modules/setCookie');
const fsPromise = require('fs/promises');
const path = require('path');

// Route handler function for creating a user account
// HTTP method (POST)
// Development uri (http://localhost:4040/api/v1/account/main/register)
// Production uri ()
const createUserAccount = asyncHandler(async (req, res) => {
   try {
      // Extract user info from req.validBody which is set in validateReqBody after validation is complete
      const { name, email, username, password } = req.validBody;

      // Check if name is already in use
      const nameExists = await userModel.findOne({ name });
      if (nameExists) {
         res.status(400);
         throw new Error('Name already in use');
      }

      // Check if email is already in use
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
         res.status(400);
         throw new Error('Email already in use');
      }

      // Check if username is already in use
      const usernameExists = await userModel.findOne({ username });
      if (usernameExists) {
         res.status(400);
         throw new Error('Username already in use');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 11);

      // Generate a unique userID
      const userID = nanoid(6);

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
      const profilePicUrl = `http://localhost:4040/api/v1/profilePic/${profilePicName}`;

      // Create user account if the above validations are successful
      await userModel.create({ name, email, username, userID, profilePic: profilePicUrl, password: hashedPassword });

      // Send success response if user has been created
      res.sendStatus(201);
   } catch (error) {
      res.status(500);
      throw new Error('Server error unable to perform this action please try again later');
   }
});

// Route handler function for user login
// HTTP method (POST)
// Development uri (http://localhost:4040/api/v1/account/main/login)
// Production uri ()
const userLogin = asyncHandler(async (req, res) => {
   try {
      // Extract user info from req.validBody which is set in validateReqBody after validation is complete
      const { email, password } = req.validBody;

      // Check if user with the given email exists
      const user = await userModel.findOne({ email });
      if (!user) {
         res.status(401);
         throw new Error('Invalid Email');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         res.status(400);
         throw new Error('Invalid Password');
      }

      // Generate tokens
      const { refreshToken, accessToken } = generateToken(user.userID);

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
      res.status(500);
      throw new Error('Server error unable to perform this action please try again later');
   }
});

module.exports = { createUserAccount, userLogin };
