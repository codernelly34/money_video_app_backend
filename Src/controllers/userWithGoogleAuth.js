const asyncHandler = require('express-async-handler');
const GoogleOAuthClient = require('../utils/setGoogleOAuthClient');
const { nanoid } = require('nanoid/non-secure');
const userModel = require('../modules/userModel');
const generateToken = require('../utils/generateToken');
const setCookie = require('../utils/setCookie');

// Route handler function for initiating the OAuth flow
// HTTP method (POST)
// Development uri (http://localhost:4040/api/v1/account/google/start_oauth_flow)
// Production uri ()
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

// Route handler function for handling OAuth redirect after user grants consent
// HTTP method (GET)
// Development uri (http://localhost:4040/api/v1/account/google/oauth_redirect)
// Production uri ()
const handleOAuthRedirect = asyncHandler(async (req, res) => {
   const code = req.query.code;

   // Exchange code for tokens
   const tokenResponse = await GoogleOAuthClient.getToken(code);

   // Set credentials on the OAuth2 client
   await GoogleOAuthClient.setCredentials(tokenResponse.tokens);

   // Fetch user data from Google API
   const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${GoogleOAuthClient.credentials.access_token}`
   );
   const userData = await response.json();
   console.log(userData);

   // Extract user data
   const { sub, name, given_name, family_name, picture } = userData;

   // Check if user exists in the database
   const existingUser = await userModel.findOne({ sub });

   if (existingUser) {
      // Generate tokens
      const accessToken = generateToken.accessToken(existingUser.UserID);
      const refreshToken = generateToken.refreshToken(existingUser.UserID);

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

   // Save new user to the database
   const savedUser = await userModel.create(newUser);

   // Generate tokens
   const accessToken = generateToken.accessToken(userID);
   const refreshToken = generateToken.refreshToken(userID);

   // Set cookies
   setCookie(res, refreshToken, accessToken);

   // Update user tokens
   savedUser.tokens.push(refreshToken);
   await savedUser.save();

   // Redirect to home page
   res.redirect(303, 'http://localhost:5173/');
});

module.exports = { startOAuthFlow, handleOAuthRedirect };
