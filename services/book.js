const Book = require('../models/book');
const getBookList = () => {
    return Book.find({});
};

const getBook = (id) => {
    return Book.findById(id);
};

const getBookByIsbn = (isbn) => {
    return Book.findOne({isbn: isbn});
};

const createBook = (data) => {
    return Book.create(data);
};

const updateBook = (id, data) => {
    return Book.updateOne({_id: id}, data);
};

const deleteBook = (id) => {
    return Book.deleteOne({_id: id});
}


module.exports = {
    getBookList,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getBookByIsbn,
}