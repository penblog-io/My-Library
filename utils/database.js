const mongoose = require('mongoose');
require('dotenv').config();

const connect = async() => {
    await mongoose.connect(process.env.MONGO_URL);
};

const disconnect = async () => {
    await mongoose.disconnect();
}

module.exports = {
    connect,
    disconnect
};