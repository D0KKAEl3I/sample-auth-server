const express = require('express');
const users = require('../data/user');
const jwtUtils = require('../jwt-util');
const redisClient = require('../redis');

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    const foundUser = users.find((user) => {
        return user.id === req.body?.id && user.password === req.body?.password;
    })
    const isSuccess = Boolean(foundUser);
    if (isSuccess) {
        const { password, ...userData } = foundUser;
        const accessToken = jwtUtils.sign(userData);
        const refreshToken = jwtUtils.refresh();
        redisClient.set(userData.id, refreshToken);
        res.status(200).json({
            user: userData,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(401).send();
    }
});

module.exports = loginRouter