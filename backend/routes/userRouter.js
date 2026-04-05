const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  logout,
  getProfile,
  changePassword,
  verifyOtp,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");
const { authentication } = require("../middleware/auth");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/getProfile").get(authentication, getProfile);
router.route("/change").post(authentication, changePassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
