const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    username: {
      type: String,
      required: [true, "please enter your username"],
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
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

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
