const mongoose = require('mongoose')
var mongooseTypePhone = require('mongoose-type-phone');
const studentsCommonSchema = new mongoose.Schema({
    
    STUDENT_NAME:{
        type:String,
       
    },
    EMAIL:{
        type:String,
        
    },
    DOB:{
        type:String
    },
    GENDER:{
        type:String
    },
    ROLL_NO:{
        type:String
    },
    MOBILE:{
        type:Number
    },
    BRANCH:{
        type:String
    },
    DEGREE:{
        type:String
    }

   
})

const validusers = new mongoose.model("validUsers",studentsCommonSchema,"validusers")
module.exports = validusers