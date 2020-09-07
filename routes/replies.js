const router = require('express').Router()
var Post    = require("../models/posts");
var Replies = require("../models/replies");
var User    = require("../models/user");

//  -------------------------------
// COMMENT ROUTES
// --------------------------------



//comments new route
router.get('/post/:id/comment/new', (req, res) => {
    Post.findById(req.params.id, (err, data) => {
        if (err) {
            console.log("error")
        }
        else {
            res.render("replies/new", { post : data })
        }
    })
})

//comment new post route
router.post('/post/:id/comment', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log("did not pass this")
            res.redirect("/explore")
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