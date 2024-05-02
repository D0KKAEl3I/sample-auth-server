const express = require('express');
const loginRouter = require('./login');
const verifyRouter = require('./verify');
const refreshTokenRouter = require('./refresh-token');
const authJWT = require('../middlewares/auth-jwt');

const router = express.Router();
router.use('/login', loginRouter)
router.use('/verify', verifyRouter)
router.use('/refresh-token', refreshTokenRouter)

module.exports = router