
var middlewareObj={};


middlewareObj.isLoggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You have to Sign up/login first!");
    res.redirect("/register");
}

module.exports = middlewareObj;