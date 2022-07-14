const mongoose = require('mongoose')

const bookRecommendSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    publisher:{
        type:String,
        //required:true
    },
    edition:{
        type:String
    },
    year:{
        type:String
    },
    created_at: {type: Date, default: Date.now}
})

const bookRecommend = new mongoose.model("bookRecommend",bookRecommendSchema,"booksRecommend")
module.exports = bookRecommend