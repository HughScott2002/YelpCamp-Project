const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

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
    campground.author = req.user._id;
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
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
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
  isAuthor,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
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
  isAuthor,
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
  isAuthor,
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
