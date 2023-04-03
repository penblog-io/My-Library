const {authHandler} = require("../controllers/auth");
const authRouter = require('express').Router();


/**
 * @swagger
 * /api/authorize:
 *     post:
 *         description: Authorize a user using local strategy, default username and password is "admin". After
 *                      receiving the access token, use it for APIs authentication. There are users you can use
 *                      "admin", "librarian", "reader" (same username and password).
 *         tags: [Authentication]
 *         produces:
 *             application/json
 *         responses:
 *             200:
 *                 description: Authorization successful.
 *                 content:
 *                     text/plain:
 *                         schema:
 *                             type: string
 *             401:
 *                 description: Authorization fail.
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             username:
 *                                 type: string
 *                                 example: 'admin'
 *                                 description: username to authenticate to retrieve user JWT token
 *                             password:
 *                                 type: string
 *                                 example: 'admin'
 *                                 description: password to authenticate to retrieve user JWT token
 */
authRouter.post('/', authHandler);

module.exports = authRouter;