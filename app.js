const express           = require('express')
const bodyParser        = require('body-parser')
const passport          = require('passport')
const Localstrategy     = require('passport-local')
const flash             = require('connect-flash')
const moment            = require('moment')
const Posts             = require("./models/posts")
const Replies           = require("./models/replies")
const User              = require("./models/user")
const app               = express()

//==============Mongo setup============

const mongoose = require('mongoose');
const { Db } = require('mongodb');
mongoose.connect('mongodb://localhost:27017/twitter_v3', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//=====================

//=======USES==============

app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"))

app.set("view engine","ejs");

app.locals.moment = require('moment');

//==========================



//=======Routes Required============

var   indexRoutes       =   require("./routes/user")
var   postRoutes        =   require("./routes/posts")
var   repliesRoutes     =   require('./routes/replies')

//==================

//=====================
//Passport Authentication

app.use(require("express-session")({
    secret: "Vikash is GOAT",
    resave:false,
    saveUninitialized:false
}))


//=====passport setup===============

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================================

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use(postRoutes);
app.use(repliesRoutes);


app.get('/',(req,res)=>{
    res.render("main");
})


app.listen(5555,()=>{
    console.log("server started at 5555.")
})