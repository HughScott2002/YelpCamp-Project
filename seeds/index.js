const mongoose = require("mongoose");
const Campground = require("../models/campground");
// const Report = require("../models/report");
// const cities = require("./cities");
const seed = require("./seedHelpers");

//Database
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // These options Crash the Program
  //useFindAndModify: false,
  //useCreateIndex: true,
});

const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });
try {
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Database connected");
  });
} catch (e) {
  console.log("Database Not found", e);
}

function rand(num = 10) {
  return Math.floor(Math.random() * num);
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const r = rand(999);
    const arry = [`${sample(seed.descript)}`, `${sample(seed.types)}`];
    const s = `${arry[0]} ${arry[1]}`;
    const dis = `${arry[1]}`;
    const camp = new Campground({
      author: "629ecb00bc32da83e064902b",
      images: [
        {
          url: "https://res.cloudinary.com/dvmsgwcg7/image/upload/v1654909692/YelpCamp/hd7aeh0v10fefhmn1kvl.jpg",
          filename: "YelpCamp/hd7aeh0v10fefhmn1kvl",
        },
        {
          url: "https://res.cloudinary.com/dvmsgwcg7/image/upload/v1654909692/YelpCamp/kh2gvvqynuwes3pxhp36.jpg",
          filename: "YelpCamp/kh2gvvqynuwes3pxhp36",
        },
        {
          url: "https://res.cloudinary.com/dvmsgwcg7/image/upload/v1654909693/YelpCamp/euzonsfk9ew4xlj8sudd.jpg",
          filename: "YelpCamp/euzonsfk9ew4xlj8sudd",
        },
      ],
      title: s,
      price: rand(10000),
      description: dis,
      location: `${sample(seed.places)}`,
    });
    console.log(camp);
    await camp.save();
  }
};

seedDB();
