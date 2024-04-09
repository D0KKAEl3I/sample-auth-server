require('dotenv').config();
const users = [
    {
        id: process.env.DEFAULT_USER_ID,
        username: 'sample',
        password: process.env.DEFAULT_USER_PW,
    },
]

module.exports = users