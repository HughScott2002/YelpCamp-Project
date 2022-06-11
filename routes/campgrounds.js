const express = require("express");
const router = express.Router();
const controller = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(controller.index)) //Route for all Campgrounds
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(controller.newCampground) //Submit New Campground
  );

//Add new Campground
router.get("/new", isLoggedIn, controller.newCampPage);

router
  .route("/:id")
  .get(catchAsync(controller.campgroundId)) //Go to Campground with the id
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(controller.findAndUpdateCampground)
  ) //Find and Update the editied Campground
  .delete(isAuthor, isLoggedIn, catchAsync(controller.deleteCampground)); //Finds and Deletes a Campground
// Edit Campground

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(controller.editCampground)
);

module.exports = router;
