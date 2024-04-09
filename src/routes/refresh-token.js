const jwtUtils = require('../jwt-util');
const jwt = require('jsonwebtoken');

const refresh = async (req, res) => {
    const accessToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
        res.status(401).send();
        return;
    }

    const decoded = jwt.decode(accessToken);
    if (decoded === null) {
        res.status(401).send();
    }

    const refreshResult = jwtUtils.refreshVerify(refreshToken, decoded.id);
    if (refreshResult.ok === false) {
        res.status(401).send();
    }

    const newAccessToken = jwtUtils.sign(user);
    const newRefreshToken = jwtUtils.refresh();

    res.status(200).send({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
};

module.exports = refresh;