const validateReqBody = (req, res, next) => {
  let { name, username, email, password } = req.body;

  if (name !== undefined && !name.split(" ").length < 0) {
    res.status(400);
    throw new Error("Please provide both first and last name");
  }
  if (!username || !username.startsWith("@")) {
    res.status(400);
    throw new Error("Please provide a username starting with '@'");
  }
  if (!email || !email.endsWith("@gmail.com")) {
    res.status(400);
    throw new Error("Please provide a valid Gmail address");
  }
  if (!password || password.length < 4) {
    res.status(400);
    throw new Error("Please provide a password with at least 4 characters");
  }

  req.validBody = { name, email, username, password };

  next(); // Call next middleware if validation passes
};

module.exports = validateReqBody;
