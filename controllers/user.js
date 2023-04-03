const sanitize = require('mongo-sanitize');
const {getUserList, getUser, createUser, getUserByUsername, updateUser, deleteUser} = require('../services/user');

const getUserObject = (user) => ({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
});

const getUsersHandler = async (req, res) => {
    try {
        const books = await getUserList();
        res.json(books.map(user => ({
            id: user._id,
            ...getUserObject(user)
        })));
    } catch (e) {
        res.status(400).send();
    }
};

const getUserHandler = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await getUser(id);
        // if book is not found
        if (!user) return res.status(404).send();

        res.json({
            id: user._id,
            ...getUserObject(user)
        });
    } catch (e) {
        res.status(400).send();
    }
};

const createUserHandler = async (req, res) => {
    const data = sanitize(req.body);

    // check if existing
    const user = await getUserByUsername(data.username);
    if (user) return res.status(409).send();

    try {
        await createUser({
            password: data.password,
            ...getUserObject(data)
        });
        res.status(201).send();
    } catch (e) {
        res.status(400).send();
    }
};

const updateUserHandler = async (req, res) => {
    const id = req.params.id;
    const data = sanitize(req.body);

    // if book is not found
    const user = await getUser(id);
    if (!user) return res.status(404).send();


    // check if isbn is already in use by another book
    const anotherUser = await getUserByUsername(data.username);
    if (!!anotherUser && anotherUser._id !== user._id) {
        return res.status(409).send();
    }

    try {
        await updateUser(id, {
            password: data.password,
            ...getUserObject(data)
        });
        res.json();
    } catch (e) {
        res.status(400).send();
    }
};

const patchUserHandler = async (req, res) => {
    const id = req.params.id;
    const payload = sanitize(req.body);

    // if book is not found
    const user = await getUser(id);
    if (!user) return res.status(404).send();

    const data = {};
    if (payload.firstName) data.firstName = payload.firstName;
    if (payload.lastName) data.lastName = payload.lastName;
    if (payload.password) data.password = payload.password;

    try {
        await updateUser(id, data);
        res.json();
    } catch (e) {
        res.status(400).send();
    }
};

const deleteUserHandler = async (req, res) => {
    const id = req.params.id;
    // if book is not found
    const book = await getUser(id);
    if (!book) return res.status(404).send();

    try {
        await deleteUser(id);
        res.status(204).send();
    } catch (e) {
        res.status(400).send();
    }
};


module.exports = {
    getUsersHandler,
    getUserHandler,
    createUserHandler,
    updateUserHandler,
    deleteUserHandler,
    patchUserHandler
};