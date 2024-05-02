const redis = require('redis');
require('dotenv').config();
const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: process.env.REDIS_HOST
    }
});
redisClient.connect()

module.exports = redisClient;
