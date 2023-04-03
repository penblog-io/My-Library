const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;


const userSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    role: String,
}, {
    methods: {
        verifyPassword: async function(password) {
            return await bcrypt.compare(password, this.password);
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;