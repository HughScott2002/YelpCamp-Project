const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ErrorFile");
const { campgroundSchema } = require("../validations/validations");
const { isLoggedIn } = require("../middleware");
// const flash = require("connect-flash");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Route for all Campgrounds
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Add new Campground
router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    res.render("campgrounds/new"); //{ campgrounds });
  })
);
//Submit New Campground
router.post(
  "/submit",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully Created");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Go to Campground with the id
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    //const campground =  await Campground.findById(req.params.id);
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Campground no longer exists");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

//Find and Update the editied Campground
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    //res.render("campgrounds/edit", { campground });
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Update Successful");
    res.redirect(`/campgrounds/${id}`);
  })
);
//Finds and Deletes a Campground
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    //res.render("campgrounds/edit", { campground });
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground Deleted");
    res.redirect(`/campgrounds`);
  })
);
// Edit Campground
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground no longer exists");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

module.exports = router;
