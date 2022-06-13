const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
x = module.exports;

x.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

x.newCampPage = (req, res) => {
  res.render("campgrounds/new");
};

x.newCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully Created");
  res.redirect(`/campgrounds/${campground._id}`);
};

x.campgroundId = async (req, res, next) => {
  //const campground =  await Campground.findById(req.params.id);
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground no longer exists");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

x.findAndUpdateCampground = async (req, res, next) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Update Successful");
  res.redirect(`/campgrounds/${id}`);
};

x.deleteCampground = async (req, res, next) => {
  const id = req.params.id;
  //res.render("campgrounds/edit", { campground });
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground Deleted");
  res.redirect(`/campgrounds`);
};

x.editCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground no longer exists");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
