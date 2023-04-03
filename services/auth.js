const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../configs/jwt');
const roleConfig = require('../configs/role')


const setLocalStrategy = () => {
    passport.use(new LocalStrategy(
        {usernameField: 'username', passwordField: 'password', session: false},
        async (username, password, done) => {
            try {
                const user = await User.findOne({username: username});
                if (!user) {
                    return done(null, false);
                }
                if (!await user.verifyPassword(password)) {
                    return done(null, false);
                }

                return done(null, user);

            } catch (e) {
                console.log(e);
                return done(e);
            }
        }
    ));
};

const setJwtStrategy = () => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfig.publicKey,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
    };

    passport.use(new JwtStrategy(opts, async (token, done) => {
        try {
            const user = await User.findOne({_id: token.sub});
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (e) {
            console.log(e)
            return done(e, false);
        }
    }));
};

const setupPassportStrategies = () => {
    setLocalStrategy();
    setJwtStrategy();
}

const generateJwt = async (username) => {
    const user = await User.findOne({username: username});
    const now = Date.now();
    try {
        const payload = {
            iss: jwtConfig.issuer,
            aud: jwtConfig.audience,
            iat: now,
            exp: now + jwtConfig.expireIn,
            sub: user._id.toString(),
            scope: user.role,
        };

        return jwt.sign(payload, jwtConfig.privateKey, {algorithm: 'RS512'});
    } catch (e) {
        return null;
    }
};

const isUserAuthorized = (req) => {
    if (!req.isAuthenticated()) return false;

    const user = req.user;
    if(!roleConfig[user.role]) return false;

    const permissions = roleConfig[user.role].permissions[req.baseUrl];
    if (!permissions || !permissions.methods.includes(req.method.toUpperCase())) return false;

    if(permissions.scope === 'SELF' && req.baseUrl === '/api/users') {
        const id = req.originalUrl.replace('/api/users', '')
            .replace('/', '');

        if(!id || id !== user._id.toString()) return false;
    }

    return true;
}

module.exports = {
    setupPassportStrategies,
    generateJwt,
    isUserAuthorized
};