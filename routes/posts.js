const router = require('express').Router()
const Post = require('../models/posts')
const User = require('../models/user')
var middlewares = require("../middlewares")


//=============getting all the posts===============================

// router.get('/explore',middlewares.isLoggedin,function(req,res){

//     Post.find({}).sort({Created:-1}).exec((err,data)=>
//     {
//         if(err)
//         {
//          return res.send(err)
//         }
//         else
//         {
//             res.render('posts/index', {posts: data})
//         }
//     })
// })



router.get("/explore",middlewares.isLoggedin, function (req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Post.find({}).sort({Created: -1}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, data) {
        Post.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("posts/index", {
                    posts: data,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
                    currentpage: "explore"
                });
            }
        });
    });
});




//====================================


//================new post====================

router.get('/post/new',middlewares.isLoggedin, (req, res) => {
    res.render('posts/new')
})

router.post('/post/new', (req, res) => {
    Post.create({ text: req.body.text, author: req.user.username }, (err, post) => {
        if (err) {
            res.send("Length of Post exceeded 500 characters");
        }
        else {
            User.findOneAndUpdate({ username: req.user.username }, {
                $push: {
                    "posts": {
                        id: post._id
                    }
                }
            }, (err, user) => {
                if (err) {
                    return res.send(err)
                } else {
                    res.redirect('/explore')
                }
            })
        }
    })
})

//=====================================================

//=========particular post show page===================

router.get('/post/:id',middlewares.isLoggedin,(req,res)=>{
    Post.findById(req.params.id).populate("replies").exec(function(err,data){
          if(err)
          {
              console.log("err")
          }
          else
          {
              res.render("posts/show",{post:data})
          }
    })
})

//===================================================

//==========Like Routes===============

router.post("/post/:id/like", middlewares.isLoggedin , function (req, res) {
     Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
        }

        // check if req.user._id exists in user.likes
        var foundUserLike = post.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            post.likes.pull(req.user._id);
        } else {
            // adding the new user like
            post.likes.push(req.user);
        }

        post.save(function (err) {
            if (err) {
                console.log(err);
            }
            {
               return res.redirect("/post/"+req.params.id);
            }
            
        });
    });
});

//==================================


module.exports = router