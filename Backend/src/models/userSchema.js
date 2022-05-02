const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Image:
    {
        data: Buffer,
        contentType: String
    }
})

const register = new mongoose.model("RegisterdUser",userSchema)
module.exports = register