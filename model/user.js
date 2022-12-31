const mongoose=require('mongoose')

//user schema 
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min :4
    },
   password:{
        type:String,
        required:true,
        min :6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now
    }
})




module.exports=mongoose.model('User', userSchema)
