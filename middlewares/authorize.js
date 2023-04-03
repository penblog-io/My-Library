const {isUserAuthorized} = require("../services/auth");
const isAuthorize = (req, res, next) => {
    if(!isUserAuthorized(req)) return res.status(403).send();
    next();
};

module.exports = isAuthorize;