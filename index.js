require('dotenv').config({path: '.env'});
const createServer = require('./utils/server');
const {connect} = require("./utils/database");
const setup = require('./data/setup');

app = createServer();

app.listen(process.env.PORT || 80, async() => {
    console.log('Server started, listening to port 80.');

    await connect();
    await setup();
    console.log('Database connected.');
});


module.exports = app;