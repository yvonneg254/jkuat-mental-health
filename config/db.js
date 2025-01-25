// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure dotenv is being used to load environment variables

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/MentalHub'; // Fall back to a default URI if the env variable is not set
        console.log('Using MongoDB URI:', uri);  // Optional: To debug, check what URI is being used

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;
