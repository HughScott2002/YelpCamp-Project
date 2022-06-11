const User = require("../models/user");
x = module.exports;

x.userRegister = (req, res) => {
  res.render("users/register");
};

x.addUser = async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = new User({ email, username });
  const registeredUser = await User.register(user, password);

  req.login(registeredUser, (err) => {
    if (err) return next(err);
    req.flash("success", `Welcome To YelpCamp ${username}`);
    res.redirect("/campgrounds");
  });
};

x.loginPage = (req, res) => {
  res.render("users/login");
};

x.postLogin = async (req, res) => {
  const { username } = req.body;
  const urlRedirecter = req.session.returnTo || "/campgrounds";
  req.flash("success", `Welcome back ${username}`);
  res.redirect(urlRedirecter);
  delete req.session.returnTo;
};

x.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout Successfull");
    res.redirect("/campgrounds");
  });
};
