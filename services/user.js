const User = require('../models/user');
const bcrypt = require("bcrypt");
const getUserList = () => {
    return User.find({});
};

const getUser = (id) => {
    return User.findById(id);
};

const getUserByUsername = (username) => {
    return User.findOne({username: username});
};

const createUser = async(data) => {
    data.password = await bcrypt.hash(data.password, 10);
    return User.create(data);
};

const updateUser = async(id, data) => {
    if(data.password) data.password = await bcrypt.hash(data.password, 10);
    return User.updateOne({_id: id}, data);
};

const deleteUser = (id) => {
    return User.deleteOne({_id: id});
}


module.exports = {
    getUserList,
    getUser,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
}