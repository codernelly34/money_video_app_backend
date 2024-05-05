const asyncHandler = require('express-async-handler');
const GoogleOAuthClient = require('../modules/setGoogleOAuthClient');
const { nanoid } = require('nanoid/non-secure');
const userModel = require('../modules/userModel');

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

      const { access_token, refresh_token } = GoogleOAuthClient.credentials;

      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

      const userData = await response.json();

      console.log(userData);

      const { sub, name, given_name, family_name, picture } = userData;

      const checkUserIsInDB = await userModel.findOne({ sub });

      if (checkUserIsInDB) {
         // Generate tokens
         const refreshToken = jwt.sign(checkUserIsInDB.UserID, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '5h',
         });

         const accessToken = jwt.sign(checkUserIsInDB.UserID, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '2h',
         });

         // Set cookies
         res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 5 * 60 * 60 * 1000,
            sameSite: 'lax',
            secure: true,
            domain: 'localhost',
         });

         res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: 'lax',
            secure: true,
            domain: 'localhost',
         });

         // Update user tokens
         savedUser.tokens.push(refreshToken);
         await savedUser.save();

         res.redirect(303, 'http://localhost:5173/');
      }

      const UserID = nanoid(6);

      const user = {
         UserID,
         sub,
         name,
         username: `@${given_name}${family_name}`.toLowerCase(),
         profilePic: picture,
      };

      const savedUser = await userModel.create(user);

      // Generate tokens
      const refreshToken = jwt.sign(UserID, process.env.REFRESH_TOKEN_SECRET, {
         expiresIn: '5h',
      });

      const accessToken = jwt.sign(UserID, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: '2h',
      });

      // Set cookies
      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         maxAge: 5 * 60 * 60 * 1000,
         sameSite: 'lax',
         secure: true,
         domain: 'localhost',
      });

      res.cookie('accessToken', accessToken, {
         httpOnly: true,
         maxAge: 2 * 60 * 60 * 1000,
         sameSite: 'lax',
         secure: true,
         domain: 'localhost',
      });

      // Update user tokens
      savedUser.tokens.push(refreshToken);
      await savedUser.save();

      res.redirect(303, 'http://localhost:5173/');
   } catch (err) {
      console.error('Error login  with OAuth2 user', err);
   }
});

module.exports = { initOAuthFlow, handleOAuthRedirect };
