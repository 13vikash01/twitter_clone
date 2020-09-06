const mongoose=require('mongoose')
const validator=require('validator')

const ReplySchema=new mongoose.Schema({

    body:{
        type:String,
        required:true,
        trim:true,
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
           type:String,
           required:true,
           trim:true
       },
       likes:[
        {
            username:{
                type:String
            }
        }
     ]
})
const Replies=mongoose.model('Replies',ReplySchema)
module.exports=Replies