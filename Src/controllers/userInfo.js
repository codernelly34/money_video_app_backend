const asyncHandler = require('express-async-handler');

const userinfoWithMainAuth = asyncHandler(async (req, res) => {
   // Get the user from req.user set in verifyAccess if verification is successful
   const user = req.user.username;

   // Get user info from DB, if the verifyAccess is there will be a user no need checking for possible Errors
   const useInfo = await UserModel.findOne({ username: user });

   // Destructure User info from useInfo
   const { name, email, username, profilePic } = useInfo;

   // send a successful response with user info
   res.status(200).json({ name, email, username, profilePic });
});

const userinfoWithGoogleAuth = asyncHandler(async (req, res) => {
   const access_token = req.access_token;
   const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

   const data = await response.json();

   res.status(200).json(data);
});

module.exports = { userinfoWithMainAuth, userinfoWithGoogleAuth };
