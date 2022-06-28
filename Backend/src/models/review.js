const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    
    firstName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    image:{
       type:String
    }
})

const review = new mongoose.model("Review",reviewSchema,"reviews")
module.exports = review