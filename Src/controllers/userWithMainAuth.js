const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../modules/userModel');
const { nanoid } = require('nanoid/non-secure');

/// Route handler function For handling the creating of User account
const create_account = asyncHandler(async (req, res) => {
   try {
      // Destructuring of User info from req.validBody which is set in validateReqBody after validation is complete
      const { name, email, username, password } = req.validBody;

      // Check if name is already in use
      const checkNameInDB = await userModel.findOne({ name });
      if (checkNameInDB) {
         res.status(400);
         throw new Error('Name already in use');
      }

      // Check if email is already in use
      const checkEmailInDB = await userModel.findOne({ email });
      if (checkEmailInDB) {
         res.status(400);
         throw new Error('Email already in use');
      }

      // Check if username is already in use
      const checkUsernameInDB = await userModel.findOne({ username });
      if (checkUsernameInDB) {
         res.status(400);
         throw new Error('Username already in use');
      }

      // Hash password
      await bcrypt.hash(password, 11);

      const UserID = nanoid(6);

      // Create user account if the above validations are successful
      await userModel.create({ name, email, username, UserID, password: hashedPassword });

      // Send success response if user has being created
      res.sendStatus(201);
   } catch (error) {
      res.status(500);
      throw new Error('Unable to create user pleas try again later');
   }
});

// Route handler function For handling User Login logic
const user_login = asyncHandler(async (req, res) => {
   try {
      // Destructuring of User info from req.validBody which is set in validateReqBody after validation is complete
      const { email, username, password } = req.validBody;

      // Check if email exists
      const user = await userModel.findOne({ email });
      if (!user) {
         res.status(401);
         throw new Error('Invalid Email');
      }

      // Check if username exists
      const userByUsername = await userModel.findOne({ username });
      if (!userByUsername) {
         res.status(401);
         throw new Error('Invalid Username');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         res.status(400);
         throw new Error('Invalid Password');
      }

      // Generate tokens
      const refreshToken = jwt.sign(userByUsername.UserID, process.env.REFRESH_TOKEN_SECRET, {
         expiresIn: '5h',
      });

      const accessToken = jwt.sign(userByUsername.UserID, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: '2h',
      });

      // Set cookies
      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         maxAge: 5 * 60 * 60 * 1000,
         sameSite: 'lax',
         secure: true,
      });
      res.cookie('accessToken', accessToken, {
         httpOnly: true,
         maxAge: 2 * 60 * 60 * 1000,
         sameSite: 'lax',
         secure: true,
      });

      // Update user tokens
      userByUsername.tokens.push(refreshToken);
      const savedUser = await userByUsername.save();

      // Structure User info to be send
      const userInfo = {
         name: savedUser.name,
         username: savedUser.username,
         profilePic: savedUser.profilePic,
      };

      // Send success with User info
      res.status(200).json(userInfo);
   } catch (error) {
      res.status(500);
      throw new Error('Internal server error pleas try again later');
   }
});

module.exports = { create_account, user_login };
