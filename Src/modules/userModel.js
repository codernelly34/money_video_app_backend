const mongoose = require('mongoose');

const MainAuthUserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'please enter your name'],
      },
      username: {
         type: String,
         required: [true, 'please enter your username'],
      },
      email: {
         type: String,
         required: [true, 'please enter your email'],
      },
      profilePic: {
         type: String,
         default: '',
      },
      password: {
         type: String,
         required: [true, 'please enter your password'],
      },
      token: {
         type: [String],
         default: [],
      },
   },
   {
      timestamps: true,
   }
);

const GoogleAuthUserSchema = new mongoose.Schema(
   {
      userID: {
         type: String,
         required: true,
      },
      accessToken: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const MainAuthUser = mongoose.model('MainAuthUser', MainAuthUserSchema);
const GoogleAuthUser = mongoose.model('GoogleAuthUser', GoogleAuthUserSchema);

module.exports = { MainAuthUser, GoogleAuthUser };
