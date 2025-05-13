// src/utils/password.js
const bcrypt = require('bcrypt');
const saltRounds = 10; // Tingkat kompleksitas hash

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };