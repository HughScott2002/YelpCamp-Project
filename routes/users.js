const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const controller = require("../controllers/users");

//User register
router.get("/register", controller.userRegister);

//Add User
router.post("/register", catchAsync(controller.addUser));

//Login Page
router.get("/login", controller.loginPage);

//Post and Validate login
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  catchAsync(controller.postLogin)
);

//Logout
router.get("/logout", controller.logout);

module.exports = router;
