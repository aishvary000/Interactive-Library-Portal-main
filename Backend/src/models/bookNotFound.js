const mongoose = require('mongoose')

const bookNotFoundSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    accessionNumber:{
        type:String,
        // required:true
    },
    created_at: {type: Date, default: Date.now}
})

const bookNotFound = new mongoose.model("bookNotFound",bookNotFoundSchema,"booksNotFound")
module.exports = bookNotFound