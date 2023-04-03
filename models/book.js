const mongoose = require('mongoose');
const { Schema } = mongoose;


const bookSchema = new Schema({
    isbn: String,
    title: String,
    excerpt: String,
    author: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;