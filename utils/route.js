const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerConfig = require('../configs/swagger');
const passport = require('passport');
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
const bookRouter = require("../routes/book");
const isAuthorize = require("../middlewares/authorize");


const swaggerSpec = swaggerJsdoc(swaggerConfig);

const routes = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api/authorize', passport.authenticate('local', {session: false}), authRouter);
    app.use('/api/users', passport.authenticate('jwt', {session: false}), isAuthorize, userRouter);
    app.use('/api/books', passport.authenticate('jwt', {session: false}), isAuthorize, bookRouter);
};

module.exports = routes;