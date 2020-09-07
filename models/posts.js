const mongoose=require('mongoose')
const validator=require('validator')
mongoose.set('useFindAndModify', false);

const postSchema=new mongoose.Schema({

       text:{
           type:String,
           validate:{
               validator:(value)=>
               {
                   return value.length<=500
               },
               message:'Not more than 500 character'
           }
       },
       author:String,
       Created:{type: Date,default:Date.now},
       replies:[
           {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Replies"
           }
       ],
       likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]

})


const Post=mongoose.model('post',postSchema)

module.exports=Post