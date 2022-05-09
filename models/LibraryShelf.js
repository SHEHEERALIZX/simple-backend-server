const mongoose = require('mongoose')

const LibraryShelfSchema = mongoose.Schema({


    BookTitle:{
        type:String,
        required:true

    },

    AuthorName:{
        type:String,
        required:true
    },

    BookSubtitle:{
        type:String,
        required:false

    },
    PublishedDate:{
        type:String,
        required:false

    },
    PageCount:{
        type:Number,
        required:false

    },
    Language:{
        type:String,
        required:true

    },
    PublisherName:{
        type:String,
        required:false

    },
    BookCount:{
        type:Number,

    },
 
    ISBN13:{
        type:Number,
        required:false

    },
    ISBN10:{
        type:Number,
        required:false

    },


 
})

module.exports = mongoose.model('LibraryShelf',LibraryShelfSchema)




