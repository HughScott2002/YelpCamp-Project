//Imports
const express = require("express");
const { engine } = require("express/lib/application");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Override = require("method-override");
const morgan = require("morgan");
//Database
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // These options Crash the Program
  //useFindAndModify: false,
  //useCreateIndex: true,
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

//RESTful Routes
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(Override("_method"));
app.use(morgan("dev"));

//Root Route
app.get("/", (req, res) => {
  try {
    res.render("home");
  } catch (e) {
    console.log("Error from /: \n", e);
  }
});
//Route for all Campgrounds
app.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (e) {
    console.log("Error from /Campground: \n", e);
    res.render("error", { e });
  }
});
app.get("/campgrounds/new", async (req, res) => {
  try {
    //const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/new"); //{ campgrounds });
  } catch (e) {
    console.log("Error from /Campground/new: \n", e);
    res.render("error", { e });
  }
});
app.post("/campgrounds/submit", async (req, res) => {
  try {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    console.log("Error from /Campground/submit: \n", e);
    res.render("error", { e });
  }
});
app.get("/campgrounds/:id/edit", async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  } catch (e) {
    console.log("Error from /Campground:id/edit \n", e);
    //res.send("Nothing by that ID");
    res.render("error", { e });
  }
});
app.put("/campgrounds/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //res.render("campgrounds/edit", { campground });
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${id}`);
  } catch (e) {
    console.log("Error from /Campground:id (PUT)) \n", e);
    //res.send("Nothing by that ID");
    res.render("error", { e });
  }
});
app.delete("/campgrounds/:id", async (req, res) => {
  try {
    const id = req.params.id;
    //res.render("campgrounds/edit", { campground });
    await Campground.findByIdAndDelete(id), res.redirect(`/campgrounds`);
  } catch (e) {
    console.log("Error from /Campground:id (DELETE) \n", e);
    //res.send("Nothing by that ID");
    res.render("error", { e });
  }
});

app.get("/campgrounds/:id", async (req, res) => {
  //const campground =  await Campground.findById(req.params.id);
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  } catch (e) {
    console.log("Error from /Campground:id \n", e);
    //res.send("Nothing by that ID");
    res.render("error", { e });
  }
});

//Localhost:3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
