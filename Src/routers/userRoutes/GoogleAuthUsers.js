const AuthGoogleRoute = require('express').Router();
const { initOAuthFlow, handleOAuthRedirect } = '../../controllers/userWithGoogleAuth.js';

AuthGoogleRoute.route('/init_google_Oauth_flow').post(initOAuthFlow);

AuthGoogleRoute.route('/handle_Oauth_redirect').get(handleOAuthRedirect);

module.exports = AuthGoogleRoute;
