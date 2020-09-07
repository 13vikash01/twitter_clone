const router = require('express').Router()
const Post = require('../models/posts')
const User = require('../models/user')
// const { route } = require('../middlewares')


router.get('/post', (req, res) => {
    Post.find({}, (err, data) => {
        if (err)
            return res.send(err)

        res.render('posts/index', { posts: data })
    })
})


router.get('/post/new', (req, res) => {
    res.render('posts/new')
})

router.post('/post/new', (req, res) => {
    Post.create({ text: req.body.text, author: req.user.username }, (err, post) => {
        if (err) {
            return res.send(err)
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
                    res.redirect('/post')
                }
            })
        }
    })
})


router.get('/explore',function(req,res){

    Post.find({}).sort({Created:-1}).exec((err,data)=>
    {
        if(err)
        {
         return res.send(err)
        }
        else
        {
            res.render('posts/index', {posts: data})
        }
    })
})

module.exports = router