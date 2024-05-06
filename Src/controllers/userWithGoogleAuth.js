const asyncHandler = require('express-async-handler');
const GoogleOAuthClient = require('../modules/setGoogleOAuthClient');
const { nanoid } = require('nanoid/non-secure');
const userModel = require('../modules/userModel');
const generateToken = require('../modules/generateToken');
const setCookie = require('../modules/setCookie');

// Route for initiating the OAuth flow
const startOAuthFlow = asyncHandler(async (req, res) => {
   // Set Referrer-Policy header
   res.header('Referrer-Policy', 'no-referrer-when-downgrade');

   // Generate the URL for the consent dialog
   const authUrl = GoogleOAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
      prompt: 'consent',
   });

   // Respond with the generated URL
   res.status(200).json({ authUrl });
});

// Route for handling OAuth redirect after user grants consent
const handleOAuthRedirect = asyncHandler(async (req, res) => {
   const code = req.query.code;

   try {
      // Exchange code for tokens
      const tokenResponse = await GoogleOAuthClient.getToken(code);

      // Set credentials on the OAuth2 client
      await GoogleOAuthClient.setCredentials(tokenResponse.tokens);

      // Fetch user data from Google API
      const response = await fetch(
         `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${GoogleOAuthClient.credentials.access_token}`
      );
      const userData = await response.json();

      // Extract user data
      const { sub, name, given_name, family_name, picture } = userData;

      // Check if user exists in the database
      const existingUser = await userModel.findOne({ sub });

      if (existingUser) {
         // Generate tokens
         const { refreshToken, accessToken } = generateToken(existingUser.UserID);

         // Set cookies
         setCookie(res, refreshToken, accessToken);

         // Update user tokens
         existingUser.tokens.push(refreshToken);
         await existingUser.save();

         // Redirect to home page
         res.redirect(303, 'http://localhost:5173/');
         return;
      }

      // Generate a UserID
      const userID = nanoid(6);

      // Create user object
      const newUser = {
         UserID: userID,
         sub,
         name,
         username: `@${given_name}${family_name}`.toLowerCase(),
         profilePic: picture,
      };

      // Save user to the database
      const savedUser = await userModel.create(newUser);

      // Generate tokens
      const { refreshToken, accessToken } = generateToken(userID);

      // Set cookies
      setCookie(res, refreshToken, accessToken);

      // Update user tokens
      savedUser.tokens.push(refreshToken);
      await savedUser.save();

      // Redirect to home page
      res.redirect(303, 'http://localhost:5173/');
   } catch (error) {
      console.error('Error logging in with OAuth2 user', error);
      // Handle error
      res.status(500).send('Error logging in with OAuth2 user');
   }
});

module.exports = { startOAuthFlow, handleOAuthRedirect };
