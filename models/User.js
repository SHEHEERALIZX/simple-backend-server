const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({


    username: {
        type: String,
        default:null

        },

    email:{
        type:String,
        unique:true
    },

    password: {
        type: String,
        required: true

    }
})

module.exports = mongoose.model('user',userSchema)