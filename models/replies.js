const mongoose=require('mongoose')
const validator=require('validator')

const ReplySchema=new mongoose.Schema({

    comment : {
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
       author:{
           type:String
       },
       likes:[
        {
            username:String
        }
     ]
})


module.exports=mongoose.model('Replies',ReplySchema)