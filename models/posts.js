const mongoose=require('mongoose')
const validator=require('validator')

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
       author:{
           type:String,
       },
       replies:[
           {
               Id:{
                   type:[mongoose.Schema.Types.ObjectId],
                   ref:'Replies'
               }
           }
       ],
       likes:[
        {
            username:{
                type:String
            }
        }
     ]

})


const Post=mongoose.model('post',postSchema)

module.exports=Post