const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
require('dotenv').config();

const secret = process.env.TOKEN_SECRET;
const jwtUtils = {
    sign: (user) => { // access token 발급
        const payload = {
            user: { // access token에 들어갈 payload
                id: user.id,
                username: user.username,
            }
        };

        return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
            algorithm: 'HS256', // 암호화 알고리즘
            expiresIn: process.env.ACCESS_TOKEN_DURATION, 	  // 유효기간
        });
    },
    verify: (token) => { // access token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                id: decoded.id,
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: () => { // refresh token 발급
        return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
            algorithm: 'HS256',
            expiresIn: process.env.REFRESH_TOKEN_DURATION,
        });
    },
    refreshVerify: async (token) => { // refresh token 검증
        try {
            const data = await redisClient.v4.get(token);
            if (!data) {
                return {
                    ok: false
                };
            }
            try {
                const verified = jwt.verify(token, secret)
                return {
                    ok: true,
                    userId: data
                };
            } catch (err) {
                redisClient.del(token);
                return {
                    ok: false
                };
            }
        } catch (err) {
            return {
                ok: false
            };
        }
    },
};

module.exports = jwtUtils;