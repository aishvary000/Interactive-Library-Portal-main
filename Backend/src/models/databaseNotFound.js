const mongoose = require('mongoose')

const databaseNotFoundSchema = new mongoose.Schema({
    
    Name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    location:{
        type:String,
        // required:true
    },
    created_at: {type: Date, default: Date.now}
})

const databaseNotFound = new mongoose.model("databaseNotFound",databaseNotFoundSchema,"databasesNotFound")
module.exports = databaseNotFound