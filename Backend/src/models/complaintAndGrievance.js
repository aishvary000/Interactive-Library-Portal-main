const mongoose = require('mongoose')

const complaintAndGrievanceSchema = new mongoose.Schema({
    
    complaintAndSuggestion:{
        type:String,
        required:true
    },
    type:{
        type:String,
    },
    status:
    {
        type:Number,

    },
    explanation:{
        type:String,
        required:true
    },
    created_at: {type: Date, default: Date.now}
})

const complaintAndGrievance = new mongoose.model("complaintAndGrievance",complaintAndGrievanceSchema,"complaintAndGrievances")
module.exports = complaintAndGrievance