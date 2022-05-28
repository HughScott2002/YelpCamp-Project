const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const seed = require('./seedHelpers');





//Database
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
    // These options Crash the Program
    //useFindAndModify: false,
    //useCreateIndex: true, 
});

const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });
try{
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
    console.log("Database connected");
});}
catch (e){
    console.log("Database Not found", e)
}

function rand(num=10){
    return Math.floor(Math.random() * num);
}

const sample = array => array[Math.floor(Math.random() * array.length) - 1]



const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const r = rand(999);
        const s = `${sample(seed.descript)} ${sample(seed.types)}`
        const camp = new Campground({
            title: s,
            price: `$${rand(10000)}.${rand(10)}`,
            description: `${sample(seed.types)}`,
            location: `${sample(seed.places)}`
        });
        await camp.save();
        
        
    }
    
    
}

seedDB();