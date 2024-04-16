const { Router } = require("express");
const validateReqBody = require("../middlewares/validateReqBody");
const { create_account, user_login } = require("../controllers/userController");

const userRoute = Router();

userRoute.use(validateReqBody);

userRoute.route("/sin_up").post(create_account);
userRoute.route("/log_in").post(user_login);

module.exports = userRoute;
