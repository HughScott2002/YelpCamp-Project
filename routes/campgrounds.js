const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ErrorFile");
const { campgroundSchema } = require("../validations/validations");

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
router.get("/", async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (e) {
    console.log("Error from /Campground: \n", e);
    next(e);
  }
});

//Add new Campground
router.get(
  "/new",
  catchAsync(async (req, res, next) => {
    //const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/new"); //{ campgrounds });
  })
);
//Submit New Campground
router.post(
  "/submit",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
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
    res.render("campgrounds/show", { campground });
  })
);

//Find and Update the editied Campground
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    //res.render("campgrounds/edit", { campground });
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${id}`);
  })
);
//Finds and Deletes a Campground
router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    //res.render("campgrounds/edit", { campground });
    await Campground.findByIdAndDelete(id), res.redirect(`/campgrounds`);
  })
);
// Edit Campground
router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

module.exports = router;
