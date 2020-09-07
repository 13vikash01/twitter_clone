var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var Post     = require("../models/posts");


//====ADDING AUTHENTICATION ROUTES =============

//new user signup route
router.get('/register', (req, res) => {
    res.render("register")
})


// new user signup post route
router.post('/register', (req, res) => {
    var newuser = new User({ name: req.body.name, email: req.body.email, username: req.body.username, });
    User.register(newuser, req.body.password, function (err, data) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register")
        }
        else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Successfully Signed up!! , Welcome " + data.username);
                res.redirect('/explore')
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

        successRedirect: "/home",
        failureRedirect: "/login"

    }), (req, res) => {

    })

//==============homeRoute==================
router.get('/home',(req,res)=>
{
    User.findOne({username:req.user.username},function(err,user){
          if(err)
          {
            console.log("error")
          }
          else
          {
             var following_users=[]
            for(let i=0;i<user.following.length;i++)
                { 
                     following_users.push(user.following[i].name)
                }
  
            User.find().where('username').in(following_users).exec((err,data)=>
           {
                if(err)
                {
                 console.log(err);
                }
                else{
                    let related_posts=[]
                    for(let i=0;i<data.length;i++)
                    {
                         let user=data[i];
                         for(let i=0;i<user.posts.length;i++)
                         {
                             related_posts.push(user.posts[i].id)
                         }
                    }
                    Post.find().where('_id').in(related_posts).exec((err, data)=>
                    {
                         if(err)
                         {
                             console.log(err)
                         }
                         else
                         {
                            res.render('posts/index',{posts : data})
                         }
                          
                    })
                }
           })
        }
    })
})


//==========Follower Route =================
router.get('/follow/:author', (req, res) => {
    User.findOneAndUpdate({ username : req.params.author}, {
        $push: {
            "followers": {
                name: req.user.username
            }
        }
    }, function(err,data){
        if(err)
        {
            console.log(err)
        }
    })

    User.findOneAndUpdate({username:req.user.username},{
        $push:{"following": {
          name:req.params.author
     }}
    },function(err,data){
        if(err)
        {
            console.log(err)
        }
        else{
            req.flash("success", "You are now following " + req.params.author);
            res.redirect('/explore')
        }
      })
      
})

//===============================================


//================unfollowRoute==================

router.get('/unfollow/:author',(req,res)=>
 {
      User.findOneAndUpdate({username:req.params.author},{
         $pull:{"followers": {                   
           name:req.user.username
      }}
     },function(err,data){
        if(err)
        {
            console.log(err)
        }

    })


       User.findOneAndUpdate({username:req.user.username},{
       $pull:{"following": {               
         name:req.params.author
    }}
   },function(err,data){
       if(err)
       {
           console.log(err)
       }
       else{
        req.flash("success", "You unfollowed " + req.params.author);
        res.redirect('/explore')
       }
     })       
})

//======================================================

// ADD Logout ROUTE
    router.get("/logout", (req, res) => {
        req.logout();
        req.flash("success", "Logged you out!");
        res.redirect("/register");
    })



    module.exports = router;