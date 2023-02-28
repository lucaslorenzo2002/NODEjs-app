const jwt = require('jsonwebtoken');
require('dotenv').config()

const generateToken = (id) => {
    return jwt.sign({userId: id}, process.env.PRIVATE_KEY, {expiresIn: 86400})
}

module.exports = generateToken