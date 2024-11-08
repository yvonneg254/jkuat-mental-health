require('events').EventEmitter.defaultMaxListeners = 20; // or any other number you need

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose'); // Assuming you're using MongoDB

const app = express();
const PORT = process.env.PORT || 3000;
const client = new OAuth2Client('YOUR_CLIENT_ID');

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to your MongoDB database
mongoose.connect('YOUR_MONGODB_URI', { useNewUrlParser: true, useUnifiedTopology: true });

// User model (example)
const User = mongoose.model('User', new mongoose.Schema({
    pseudonym: String,
    email: String,
    userType: String,
    password: String, // Make sure to hash passwords in a real application
}));

// Set up the main route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Google Sign-In endpoint
app.post('/api/auth/google', async (req, res) => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: 'YOUR_CLIENT_ID',  
        });
        const payload = ticket.getPayload();

        // Check if the user already exists
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            // Create a new user if they don't exist
            user = new User({
                pseudonym: payload.name, // Use the user's name or create a pseudonym
                email: payload.email,
                userType: 'student', // Default userType, modify as needed
                password: '', // Password not needed for Google sign-in
            });
            await user.save();
        }

        // You can create a session or JWT token here if required
        res.json({ success: true, message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'Google Sign-In failed' });
    }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
    const { pseudonym, email, userType, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            pseudonym,
            email,
            userType,
            password, // Remember to hash the password in a real app
        });

        await user.save();
        res.json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred during registration.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
