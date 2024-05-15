const { OAuth2Client } = require('google-auth-library');
require('dotenv/config');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const GoogleOAuthClient = new OAuth2Client({
   clientId: CLIENT_ID,
   clientSecret: CLIENT_SECRET,
   redirectUri: REDIRECT_URI,
   tokenUri: 'https://oauth2.googleapis.com/token',
});

module.exports = GoogleOAuthClient;
