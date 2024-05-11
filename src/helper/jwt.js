const jwt = require('jsonwebtoken');

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: 60*60*24*7}); // 7 days
}

const varifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {createToken, varifyToken};
