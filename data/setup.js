const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Book = require('../models/book');

const setup = async () => {
    await createUsers();
    await createBooks();
}

const createUsers = async () => {
    await User.deleteMany({});
    await User.insertMany([
        {
            username: 'admin',
            password: await bcrypt.hash('admin', 10),
            role: 'ADMIN',
            firstName: 'Library',
            lastName: 'Admin',
        },
        {
            username: 'librarian',
            password: await bcrypt.hash('librarian', 10),
            role: 'LIBRARIAN',
            firstName: 'Library',
            lastName: 'Librarian',
        },
        {
            username: 'reader',
            password: await bcrypt.hash('reader', 10),
            role: 'READER',
            firstName: 'Library',
            lastName: 'Reader',
        }
    ]);
}

const createBooks = async() => {
    await Book.deleteMany({});
    await Book.insertMany([
        {
            isbn: '9789384323097',
            title: 'Introduction to Algorithms',
            excerpt: 'The name of the book is self-explanatory. It is what the title suggests, i.e., Introduction to Algorithms. Also known as CLRS, a reference to the last name of the authors of the book, it goes in-depth into a range of algorithms divided across several self-contained chapters.',
            author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        },
        {
            isbn: '0134314301',
            title: 'Structure and Interpretation of Computer Programs (SICP)',
            excerpt: 'The Structure and Interpretation of Computer Programs, a.k.a. SICP is among the best books to learn the fundamentals of programming. Employed as a foundational course to programming at MIT, SICP is a generic programming book that uses Scheme to illustrate the various programming concepts.',
            author: 'Harold Abelson, Gerald Jay Sussman, Julie Sussman',
        },
        {
            isbn: '9780321714114',
            title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
            excerpt: 'Don’t you know what software design patterns are? The Design Patterns: Elements of Reusable Object-Oriented Software is one of the authority tomes on the topic. And yes, it is not an easy read.',
            author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, Grady Booch (Foreword)',
        },
    ]);
}


module.exports = setup;