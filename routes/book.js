const {getBooksHandler, getBookHandler, createBookHandler,
    updateBookHandler, deleteBookHandler} = require("../controllers/book");
const {validBookPayload, validObjectId} = require("../middlewares/validate");
const bookRouter = require('express').Router();

/**
 * @swagger
 * /api/books:
 *     get:
 *         tags: [Book]
 *         description: Get list of books
 *         security:
 *             - bearerAuth: []
 *         responses:
 *             200:
 *                 content:
 *                     application/json:
 *                         schema:
 *                 description: Returns a list of books.
 *             400:
 *                 description: Error retrieving book list.
 *             403:
 *                 description: Unauthorized request.
 */
bookRouter.get('/', getBooksHandler);

/**
 * @swagger
 * /api/books/{id}:
 *     get:
 *         tags: [Book]
 *         description: Get a book resource.
 *         security:
 *             - bearerAuth: []
 *         parameters:
 *             - name: id
 *               schema:
 *                   type: string
 *               require: true
 *               in: path
 *         responses:
 *             200:
 *                 content:
 *                     application/json:
 *                         schema:
 *                 description: Returns a book resource.
 *             400:
 *                 description: Error retrieving a book resource.
 *             403:
 *                 description: Unauthorized request.
 */
bookRouter.get('/:id', validObjectId(), getBookHandler);

/**
 * @swagger
 * /api/books:
 *     post:
 *         tags: [Book]
 *         description: Create a new book resource.
 *         security:
 *             - bearerAuth: []
 *         requestBody:
 *             required:
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             isbn:
 *                                 type: string
 *                                 require: true
 *                                 example: '979-8985349900'
 *                             title:
 *                                 type: string
 *                                 require: true
 *                                 example: 'Engineers Survival Guide: Advice, tactics, and tricks After a decade of working at Facebook, Snapchat, and Microsoft'
 *                             author:
 *                                 type: string
 *                                 require: true
 *                                 example: 'Merih Taze'
 *                             excerpt:
 *                                 type: string
 *                                 require: true
 *                                 example: 'There are a lot of amazing technical books out there. But what about your life as an engineer? How you interact with others? How happy are you with your career?'
 *         responses:
 *             201:
 *                 description: Successfully created a new book resource.
 *             400:
 *                 description: Error creating a new book resource.
 *             403:
 *                 description: Unauthorized request.
 *             422:
 *                 description: User input error.
 */

bookRouter.post('/', validBookPayload(), createBookHandler);

/**
 * @swagger
 * /api/books/{id}:
 *     put:
 *         tags: [Book]
 *         description: Update a new book resource.
 *         security:
 *             - bearerAuth: []
 *         parameters:
 *             - name: id
 *               schema:
 *                   type: string
 *               require: true
 *               in: path
 *         requestBody:
 *             required:
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             isbn:
 *                                 type: string
 *                                 example: '300-8985349910'
 *                             title:
 *                                 type: string
 *                                 example: 'Engineers Survival Guide: Advice, tactics, and tricks After a decade of working at Facebook, Snapchat, and Microsoft'
 *                             author:
 *                                 type: string
 *                                 example: 'Merih Taze'
 *                             excerpt:
 *                                 type: string
 *                                 example: 'There are a lot of amazing technical books out there. But what about your life as an engineer? How you interact with others? How happy are you with your career?'
 *         responses:
 *             200:
 *                 description: Successfully updated a book resource.
 *             400:
 *                 description: Error updating a book resource.
 *             403:
 *                 description: Unauthorized request.
 *             422:
 *                 description: User input error.
 */
bookRouter.put('/:id', validObjectId(), validBookPayload(), updateBookHandler);

/**
 * @swagger
 * /api/books/{id}:
 *     delete:
 *         tags: [Book]
 *         description: Delete a new book resource.
 *         security:
 *             - bearerAuth: []
 *         parameters:
 *             - name: id
 *               schema:
 *                   type: string
 *               require: true
 *               in: path
 *         responses:
 *             204:
 *                 description: Successfully deleted a book resource.
 *             400:
 *                 description: Error deleting a book resource.
 *             403:
 *                 description: Unauthorized request.
 */
bookRouter.delete('/:id', validObjectId(), deleteBookHandler);

module.exports = bookRouter;