
const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    designation:{
        type:String,
        required:true
    },
  
    email:{
        type:String,
        required:true
    },

    PhoneNumber:{
        type:Number,
        required:true

    }


})

module.exports = mongoose.model('employee',employeeSchema)