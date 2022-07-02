const mongoose = require('mongoose')

const facultyPublicationSchema = new mongoose.Schema({
    
    facultyName:{
        type:String,
        required:true
    },
    titleOfPublication:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    created_at: {type: Date, default: Date.now}
})

const facultyPublication = new mongoose.model("facultyPublication",facultyPublicationSchema,"facultyPublications")
module.exports = facultyPublication