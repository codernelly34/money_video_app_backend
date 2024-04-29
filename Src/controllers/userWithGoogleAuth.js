const asyncHandler = require('express-async-handler');
const GoogleOAuthClient = require('../modules/setGoogleOAuthClient');

// Route for initiating the OAuth flow
const initOAuthFlow = asyncHandler(async (req, res) => {
   res.header('Referrer-Policy', 'no-referrer-when-downgrade');

   // Generate the url that will be used for the consent dialog.
   const authorizeUrl = GoogleOAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile  openid ',
      prompt: 'consent',
   });

   res.json({ url: authorizeUrl });
});

const handleOAuthRedirect = asyncHandler(async (req, res) => {
   const code = req.query.code;

   try {
      const r = await GoogleOAuthClient.getToken(code);
      // Make sure to set the credentials on the OAuth2 client.
      await GoogleOAuthClient.setCredentials(r.tokens);

      const user = GoogleOAuthClient.credentials;
      console.log(user, '\n');

      const response = await fetch(
         `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${GoogleOAuthClient.credentials.access_token}`
      );

      const data = await response.json();
      console.log('data', data);
   } catch (err) {
      console.log('Error logging in with OAuth2 user', err);
   }

   res.redirect(303, 'http://localhost:5173/');
});

module.exports = { initOAuthFlow, handleOAuthRedirect };
