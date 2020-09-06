var express = require("express")
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//====ADDING AUTHENTICATION ROUTES =============

//new user signup route
router.get('/register', (req, res) => {
    res.render("register")
})


// new user signup post route
router.post('/register', (req, res) => {
    var newuser = new User({ name: req.body.name , email: req.body.email , username: req.body.username,});
    User.register(newuser, req.body.password, function (err, data) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register")
        }
        else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Successfully Signed up!! , Welcome " + data.username);
                res.redirect('/post/new')
            })
        }
    })
})

// show login auth. form
router.get('/login', (req, res) => {
    res.render("login")
})

//handling login
router.post('/login', passport.authenticate("local",
    {
       
        successRedirect: "/post/new",
        failureRedirect: "/login"

    }), (req, res) => {
          
    })

// ADD Logout ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/register");
})



module.exports = router;