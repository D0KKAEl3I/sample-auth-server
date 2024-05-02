const express = require('express');
const { verify } = require('../jwt-util');

const verifyRouter = express.Router();

verifyRouter.post('/', async (req, res) => {
    const token = req.headers.authorization?.split('Bearer ')?.[1];
    if (!token) {
        res.status(401).json('Token is required');
        return;
    }
    const result = verify(token);
    if (result.ok) {
        res.status(200).json(result);
    } else {
        res.status(401).json(result.message);
    }
});

module.exports = verifyRouter