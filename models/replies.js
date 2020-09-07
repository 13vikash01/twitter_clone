const mongoose=require('mongoose')
const validator=require('validator')

const ReplySchema=new mongoose.Schema({

    text : {
        type:String,
        validate:{
            validator:(value)=>
            {
                return value.length<=500
            },
            message:'Not more than 500 character'
        }
    },
    Created:{type: Date,default:Date.now},
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String,
    },
       likes:[
        {
            username:String
        }
     ]
})


module.exports=mongoose.model('Replies',ReplySchema)