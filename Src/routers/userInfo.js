const asyncHandler = require("express-async-handler");
const verifyAccess = require("../middlewares/verifyAccess");
const UserModel = require("../modules/userModel");

const UserInfo = require("express").Router();

UserInfo.use(verifyAccess);

UserInfo.route("/").get(
  asyncHandler(async (req, res) => {
    const user = req.user.username;

    const info = await UserModel.findOne({ username: user });

    const { name, email, username, profilePic } = info;

    res.status(200).json({ name, email, username, profilePic });
  })
);

module.exports = UserInfo;
