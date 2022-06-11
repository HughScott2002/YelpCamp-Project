const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//Post a review
router.post("/", isLoggedIn, validateReview, catchAsync(controller.postReview));

//Delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(controller.deleteReview)
);

module.exports = router;
