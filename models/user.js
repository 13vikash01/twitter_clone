const mongoose=require('mongoose')
const validator=require('validator')
var passportLocalMongoose = require("passport-local-mongoose");
const userSchema= new mongoose.Schema({

      name:String,
      email:String,
      username:String,
      password: String,
        posts:[
            {
            id:{
                type:[mongoose.Schema.Types.ObjectId],
                ref:'post'
            }
           }
        ],
        followers:[
            {
                 name:String
           }],
        following:[
            {
                
                name:String
            }
        ]
        
})


userSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model('user',userSchema)
