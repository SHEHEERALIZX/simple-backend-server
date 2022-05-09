const mongoose = require('mongoose')

const BooksSchema = mongoose.Schema({


    bookID: {
        type: String,
        required: true
      }

 
})

module.exports = mongoose.model('Book',BooksSchema)