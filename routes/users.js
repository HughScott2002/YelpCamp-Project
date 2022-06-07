const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ErrorFile");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome To YelpCamp ${username}`);
      res.redirect("/campgrounds");
    });
  })
);
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(async (req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back ${username}`);
    res.redirect("/campgrounds");
  })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout Successfull");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
