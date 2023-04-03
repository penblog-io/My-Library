const {getUsersHandler, getUserHandler, createUserHandler, updateUserHandler, deleteUserHandler, patchUserHandler} = require("../controllers/user");
const {validObjectId, validUserPayload, validPatchUserPayload} = require("../middlewares/validate");
const userRouter = require('express').Router();


/**
 * @swagger
 * /api/users:
 *     get:
 *         tags: [User]
 *         description: Get list of users.
 *         security:
 *             - bearerAuth: []
 *         responses:
 *             200:
 *                 content:
 *                     application/json:
 *                         schema:
 *                 description: Returns a list of users.
 *             400:
 *                 description: Error getting a list of users.
 *             403:
 *                 description: Unauthorized request.
 */
userRouter.get('/', getUsersHandler);

/**
 * @swagger
 * /api/users/{id}:
 *     get:
 *         tags: [User]
 *         description: Get a user resource.
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
 *                 description: Returns a user resource.
 *             400:
 *                 description: Error getting a user resource.
 *             403:
 *                 description: Unauthorized request.
 */
userRouter.get('/:id', validObjectId(), getUserHandler);


/**
 * @swagger
 * /api/users:
 *     post:
 *         tags: [User]
 *         description: Create a new user resource.
 *         security:
 *             - bearerAuth: []
 *         requestBody:
 *             required:
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             username:
 *                                 type: string
 *                                 example: 'reader2'
 *                             firstName:
 *                                 type: string
 *                                 example: 'Chicken'
 *                             lastName:
 *                                 type: string
 *                                 example: 'Wing'
 *                             password:
 *                                 type: string
 *                                 example: 'reader2'
 *                             role:
 *                                 type: string
 *                                 example: 'READER'
 *         responses:
 *             201:
 *                 description: Successfully created a new user resource.
 *             400:
 *                 description: Error creating a new user resource.
 *             403:
 *                 description: Unauthorized request.
 *             422:
 *                 description: User input error.
 */
userRouter.post('/', validUserPayload(), createUserHandler);


/**
 * @swagger
 * /api/users/{id}:
 *     put:
 *         tags: [User]
 *         description: Update a new user resource.
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
 *                             username:
 *                                 type: string
 *                                 example: 'reader3'
 *                             firstName:
 *                                 type: string
 *                                 example: 'Chicken'
 *                             lastName:
 *                                 type: string
 *                                 example: 'Finger'
 *                             password:
 *                                 type: string
 *                                 example: 'reader3'
 *                             role:
 *                                 type: string
 *                                 example: 'READER'
 *         responses:
 *             200:
 *                 description: Successfully updated a user resource.
 *             400:
 *                 description: Error updating a user resource.
 *             403:
 *                 description: Unauthorized request.
 *             422:
 *                 description: User input error.
 */
userRouter.put('/:id', validObjectId(), validUserPayload(), updateUserHandler);


/**
 * @swagger
 * /api/users/{id}:
 *     patch:
 *         tags: [User]
 *         description: Update a new user resource.
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
 *                             firstName:
 *                                 type: string
 *                                 example: 'Chicken'
 *                             lastName:
 *                                 type: string
 *                                 example: 'Finger'
 *         responses:
 *             200:
 *                 description: Successfully updated a user resource.
 *             400:
 *                 description: Error updating a user resource.
 *             403:
 *                 description: Unauthorized request.
 *             422:
 *                 description: User input error.
 */
userRouter.patch('/:id', validObjectId(), validPatchUserPayload(), patchUserHandler);



/**
 * @swagger
 * /api/users/{id}:
 *     delete:
 *         tags: [User]
 *         description: Delete a new user resource.
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
 *                 description: Successfully deleted a user resource.
 *             400:
 *                 description: Error deleting a book resource.
 *             403:
 *                 description: Unauthorized request.
 */
userRouter.delete('/:id', validObjectId(), deleteUserHandler);


module.exports = userRouter;