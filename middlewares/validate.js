const {param, validationResult, checkSchema} = require("express-validator");
const mongoose = require('mongoose');
const {Error} = require("mongoose");

const errorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
}

const validBookPayload = () => {
    return [
        checkSchema({
            isbn: {
                in: 'body',
                custom: {
                    options: (isbn) => {
                        isbn = isbn.replaceAll('-', '');
                        const regex = /^([0-9]{10}|[0-9]{13})$/;
                        if(!regex.test(isbn)) throw new Error('Invalid ISBN format.');
                        else return true;
                    }
                },
                customSanitizer: {
                    options: isbn => {
                        return isbn.replaceAll('-', '');
                    }
                }
            },
            title: {
                in: 'body',
                exists: true,
                notEmpty: true,
            },
            excerpt: {
                in: 'body',
                exists: true,
                notEmpty: true
            },
            author: {
                in: 'body',
                exists: true,
                notEmpty: true
            }
        }),
        errorHandler,
    ];
}

const validUserPayload = () => {
    return [
        checkSchema({
            username: {
                in: 'body',
                exists: true,
                notEmpty: true,
                trim: true,
            },
            firstName: {
                in: 'body',
                exists: true,
                notEmpty: true,
                trim: true,
            },
            lastName: {
                in: 'body',
                exists: true,
                notEmpty: true,
                trim: true,
            },
            password: {
                in: 'body',
                exists: true,
                notEmpty: true,
                isLength: {min: 8}
            },
            role: {
                in: 'body',
                exists: true,
                custom: {
                    options: role => {
                        if(!['ADMIN', 'LIBRARIAN', 'READER'].includes(role)) throw new Error('Invalid role option.');
                        return true;
                    }
                }
            }
        }),
        errorHandler,
    ];
}

const validPatchUserPayload = () => {
    return [
        checkSchema({
            firstName: {
                in: 'body',
                optional: true,
                notEmpty: true,
                trim: true,
            },
            lastName: {
                in: 'body',
                optional: true,
                notEmpty: true,
                trim: true,
            },
        }),
        errorHandler,
    ];
}

const validObjectId = () => {
    const isValid = (id) => {
        const regex = /^[0-9a-z]{24}$/i;
        return regex.test(id);
    }
    return [
        param('id').custom((id) => {
            if(!isValid(id)) return Promise.reject('Invalid ID param format.');
            return true;
        }),
        param('id').customSanitizer(id => {
            if(isValid(id)) return new mongoose.Types.ObjectId(id);
        }),
        errorHandler,
    ];
}


module.exports = {
    validBookPayload,
    validUserPayload,
    validPatchUserPayload,
    validObjectId,
}