const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const routes = require("./route");
const {setupPassportStrategies} = require("../services/auth");

const app = express();

const createServer = () => {
    setupPassportStrategies();
    app.use(bodyParser.json());
    app.use(passport.initialize());

    routes(app);
    return app;
}

module.exports = createServer;