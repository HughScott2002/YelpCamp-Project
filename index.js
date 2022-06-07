// Imports;
const express = require("express");
const { engine } = require("express/lib/application");
const path = require("path");
const mongoose = require("mongoose");
const Override = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const ExpressError = require("./utils/ErrorFile");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

//Database
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // These options Crash the Program
  // useFindAndModify: false,
  // useCreateIndex: true,
});

const db = mongoose.connection;
try {
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Database connected");
  });
} catch (e) {
  console.log("Database Not found", e);
}

//<Middleware>
const app = express();

const sessionConfig = {
  secret: "Mypersonalsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    //Needs Https to work
    //secure: true
  },
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(Override("_method"));
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // res.locals.login = req.flash("login")

  next();
});

app.get("/", (req, res) => {
  try {
    res.render("home");
  } catch (e) {
    console.log("Error from /: \n", e);
  }
});
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

//For every path we didnt route
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Error Handling middleware
app.use((err, req, res, next) => {
  // const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong!";
  }
  // erroG = err.stack
  res.render("error", { err });
});

//Localhost:3000
app.listen(3000, () => {
  console.log("Hosting on port 3000");
});
