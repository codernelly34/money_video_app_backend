const asyncHandler = require('express-async-handler');
const GoogleOAuthClient = require('../modules/setGoogleOAuthClient');
const { nanoid } = require('nanoid/non-secure');
const { GoogleAuthUser } = require('../modules/userModel');

// Route for initiating the OAuth flow
const initOAuthFlow = asyncHandler(async (req, res) => {
   res.header('Referrer-Policy', 'no-referrer-when-downgrade');

   // Generate the url that will be used for the consent dialog.
   const authorizeUrl = GoogleOAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile  openid ',
      prompt: 'consent',
   });

   res.status(200).json({ url: authorizeUrl });
});

const handleOAuthRedirect = asyncHandler(async (req, res) => {
   const code = req.query.code;

   try {
      const r = await GoogleOAuthClient.getToken(code);
      // Make sure to set the credentials on the OAuth2 client.
      await GoogleOAuthClient.setCredentials(r.tokens);

      const user = GoogleOAuthClient.credentials;

      const UserID = nanoid(6);
      const refreshToken = user.refresh_token;
      const accessToken = user.access_token;

      await GoogleAuthUser.create({ UserID, refreshToken });

      res.cookie('accessTokenG', accessToken, {
         httpOnly: true,
         signed: true,
         maxAge: 55 * 60 * 1000,
         domain: 'localhost',
      });

      res.cookie('UserID', UserID, {
         httpOnly: true,
         secure: true,
         signed: true,
         maxAge: 56 * 60 * 1000,
         domain: 'localhost',
      });
   } catch (err) {
      console.error('Error logging in with OAuth2 user', err);
   }

   res.redirect(303, 'http://localhost:5173/');
});

module.exports = { initOAuthFlow, handleOAuthRedirect };
