const mongoose = require('mongoose')

const complimentScehma = new mongoose.Schema({
    
    
    explanation:{
        type:String,
        required:true
    },
    created_at: {type: Date, default: Date.now}
})

const compliment = new mongoose.model("compliment",complimentScehma,"compliments")
module.exports = compliment