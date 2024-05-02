const { format } = require('date-fns');
const users = require('../data/user');
const jwtUtils = require('../jwt-util');
const redisClient = require('../redis');

const refresh = async (req, res) => {
    const refreshToken = req.headers.authorization?.split('Bearer ')[1];
    if (!refreshToken) {
        return res.status(401).json(null);
    }
    const refreshResult = await jwtUtils.refreshVerify(refreshToken);
    if (!refreshResult.ok) {
        redisClient.del(refreshToken);
        return res.status(401).json(null);
    }

    const userId = refreshResult.userId
    const user = users.find((user) => user.id === userId);
    if (!user) {
        return res.status(409).json(null);
    }

    redisClient.del(refreshToken);
    const newAccessToken = jwtUtils.sign(user);
    const newRefreshToken = jwtUtils.refresh();
    redisClient.set(newRefreshToken, userId);


    return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
};

module.exports = refresh;