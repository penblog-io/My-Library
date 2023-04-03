const fs = require("fs");

const jwtConfig = {
    algorithm: 'RS512',
    privateKey: fs.readFileSync('./keys/private.pem'),
    publicKey: fs.readFileSync('./keys/public.pem'),
    issuer: 'http://localhost:3005',
    audience: 'http://localhost:3005',
    expireIn: 60 * 60 * 1000,
};

module.exports = jwtConfig;