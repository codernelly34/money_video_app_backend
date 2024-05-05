const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'please enter your name'],
      },
      username: {
         type: String,
         required: [true, 'please enter your username'],
      },
      UserID: {
         type: String,
         required: true,
      },
      profilePic: String,
      sub: String,
      email: String,
      password: String,
      tokens: [String],
   },
   {
      timestamps: true,
   }
);

const userModel = mongoose.model('users', UserSchema);

module.exports = userModel;
