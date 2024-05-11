const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/estore');
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

module.exports = connectDB;