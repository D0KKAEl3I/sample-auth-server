const express = require('express');
const users = require('../data/user');
const jwtUtils = require('../jwt-util');
const redisClient = require('../redis');
const { format } = require('date-fns');


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
        redisClient.set(refreshToken, userData.id);
        const time = new Date();
        console.info(`[INFO](${format(time, "yyyy/MM/dd HH:mm:SS")}) User ${userData.id} logged in. got ${refreshToken}`);
        res.status(200).json({
            accessToken,
            refreshToken,
        });
    } else {
        res.sendStatus(401)
    }
});

module.exports = loginRouter