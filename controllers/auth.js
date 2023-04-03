const {generateJwt} = require("../services/auth");
const authHandler = async (req, res) => {
    const token = await generateJwt(req.body.username);
    res.send(token);
}


module.exports = {
    authHandler
};