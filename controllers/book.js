const sanitize = require('mongo-sanitize');
const {getBookList, getBook, createBook, updateBook, deleteBook, getBookByIsbn} = require('../services/book');

const getBookObject = data => ({
    isbn: data.isbn,
    title: data.title,
    author: data.author,
    excerpt: data.excerpt
});

const getBooksHandler = async (req, res) => {
    try {
        const books = await getBookList();

        res.json(books.map(book => ({
            id: book._id,
            ...getBookObject(book),
        })));
    } catch (e) {
        res.status(400).send();
    }
};

const getBookHandler = async (req, res) => {
    const id = req.params.id;

    try {
        const book = await getBook(id);
        // if book is not found
        if (!book) return res.status(404).send();

        res.json({
            id: book._id,
            ...getBookObject(book),
        });
    } catch (e) {
        res.status(400).send();
    }
};

const createBookHandler = async (req, res) => {
    const data = sanitize(req.body);

    // check if existing
    const book = await getBookByIsbn(data.isbn);
    if (book) return res.status(409).send();

    try {
        await createBook(getBookObject(data));
        res.status(201).send();
    } catch (e) {
        console.log(e)
        res.status(400).send();
    }
};

const updateBookHandler = async (req, res) => {
    const id = req.params.id;
    const data = sanitize(req.body);

    // if book is not found
    const book = await getBook(id);
    if (!book) return res.status(404).send();


    // check if isbn is already in use by another book
    const anotherBook = await getBookByIsbn(data.isbn);
    if (!!anotherBook && anotherBook._id !== book._id) {
        return res.status(409).send();
    }

    try {
        await updateBook(id, getBookObject(data));
        res.json();
    } catch (e) {
        res.status(400).send();
    }
};

const deleteBookHandler = async (req, res) => {
    const id = req.params.id;
    // if book is not found
    const book = await getBook(id);
    if (!book) return res.status(404).send();

    try {
        await deleteBook(id);
        res.status(204).send();
    } catch (e) {
        res.status(400).send();
    }
};


module.exports = {
    getBooksHandler,
    getBookHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler
};