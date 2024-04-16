const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../modules/userModel");

// Create Account
const create_account = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.validBody;

  // Check if name is already in use
  const checkNameInDB = await UserModel.findOne({ name });
  if (checkNameInDB) {
    res.status(400);
    throw new Error("Name already in use");
  }

  // Check if email is already in use
  const checkEmailInDB = await UserModel.findOne({ email });
  if (checkEmailInDB) {
    res.status(400);
    throw new Error("Email already in use");
  }

  // Check if username is already in use
  const checkUsernameInDB = await UserModel.findOne({ username });
  if (checkUsernameInDB) {
    res.status(400);
    throw new Error("Username already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 11);
  if (!hashedPassword) {
    res.status(500);
    throw new Error("Unable to create user pleas try again later");
  }

  // Create user account
  const createUserAccount = await UserModel.create({ name, email, username, password: hashedPassword });
  if (!createUserAccount) {
    res.status(500);
    throw new Error("Unable to create user pleas try again later");
  }

  // Send success response
  res.sendStatus(201);
});

// Login into Account
const user_login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.validBody;

  // Check if email exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid Email");
  }

  // Check if username exists
  const userByUsername = await UserModel.findOne({ username });
  if (!userByUsername) {
    res.status(401);
    throw new Error("Invalid Username");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400);
    throw new Error("Invalid Password");
  }

  // Generate tokens
  const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h",
  });

  // Set cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "lax",
    secure: true,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 20 * 60 * 1000,
    sameSite: "lax",
    secure: true,
  });

  // Update user tokens
  userByUsername.token.push(refreshToken);
  const savedUser = await userByUsername.save();
  if (!savedUser) {
    res.status(500);
    throw new Error("Internal server error pleas try again later");
  }

  const userInfo = {
    name: savedUser.name,
    username: savedUser.username,
    profilePic: savedUser.profilePic,
  };

  // Send success response
  res.status(200).json(userInfo);
});

module.exports = { create_account, user_login };
