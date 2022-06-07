module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //Keep track off the website being requested
    // console.log(" Path: ", req.path, "Url: ", req.url);
    // console.dir("Path: ", req.originalUrl); // '/admin/new?sort=desc'
    // console.dir("Path: ", req.baseUrl); // '/admin'
    // console.dir("Path: ", req.path); // '/new'
    // console.log("\n\n\n Req....\n", req);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please login");
    return res.redirect("/login");
  }
  next();
};
