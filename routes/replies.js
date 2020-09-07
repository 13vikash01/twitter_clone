const router = require('express').Router()
var Post    = require("../models/posts");
var Replies = require("../models/replies");
var User    = require("../models/user");
var middlewares = require("../middlewares")




//================comments new route===============

router.get('/post/:id/comment/new',middlewares.isLoggedin, (req, res) => {
    Post.findById(req.params.id, (err, data) => {
        if (err) {
            console.log("error")
        }
        else {
            res.render("replies/new", { post : data })
        }
    })
})

//=================comment new post route================

router.post('/post/:id/comment',middlewares.isLoggedin, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            res.send("Length of comment exceeded 500 characters");
        }
        else {
            Replies.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log("something went wrong");
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.replies.push(comment);
                    post.save();
                    req.flash("Success", "Succesfully added Comment");
                    res.redirect("/post/"+req.params.id)
                }
            })
        }
    })
})



module.exports = router;