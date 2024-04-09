const redis = require('redis');
require('dotenv').config();
const redisClient = redis.createClient(process.env.REDIS_PORT);
redisClient.connect()
module.exports = redisClient;