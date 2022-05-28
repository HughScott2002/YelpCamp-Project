//Imports
const express = require('express');  
const { engine } = require('express/lib/application');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

//Database
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
    // These options Crash the Program
    //useFindAndModify: false,
    //useCreateIndex: true, 
});

const db = mongoose.connection;
try{
    db.on('error', console.error.bind(console, "connection error:"));
    db.once("open",() => {
    console.log("Database connected");
});}
catch (e){
    console.log("Database Not found", e)
}

//API routes
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res)=>{
    res.render('home')
})
app.get('/campground', async (req, res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}) 


app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})