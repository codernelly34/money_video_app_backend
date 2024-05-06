const express = require('express');
const GoogleAuthRoute = express.Router();
const { startOAuthFlow, handleOAuthRedirect } = require('../../controllers/userWithGoogleAuth');

// Route to initiate the OAuth flow
GoogleAuthRoute.post('/start_oauth_flow', startOAuthFlow);

// Route to handle OAuth redirect after user grants consent
GoogleAuthRoute.get('/oauth_redirect', handleOAuthRedirect);

module.exports = GoogleAuthRoute;
