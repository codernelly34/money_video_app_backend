const asyncHandler = require('express-async-handler');
const GoogleOAuthClient = require('../modules/setGoogleOAuthClient');

const refreshGoogleAuthAccess = asyncHandler(async (req, res) => {
   const refreshedToken = await GoogleOAuthClient.refreshToken(refresh_token);
});
