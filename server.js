require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 20;

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const client = new OAuth2Client('YOUR_CLIENT_ID');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error:', err.message));

// User schema and model
const userSchema = new mongoose.Schema({
    pseudonym: String,
    email: { type: String, required: true, unique: true },
    userType: { type: String, enum: ['student', 'admin'], default: 'student' },
    password: String
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/api/test', (req, res) => {
    res.json({message: 'Hello, World!'});
})

app.post('/api/auth/google', async (req, res) => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: 'YOUR_CLIENT_ID',
        });
        const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                pseudonym: payload.name,
                email: payload.email,
                userType: 'student',
                password: '',
            });
            await user.save();
        }

        res.json({ success: true, message: 'Logged in successfully' });
    } catch (error) {
        console.error('Google Sign-In Error:', error.message);
        res.status(400).json({ success: false, message: 'Google Sign-In failed' });
    }
});

app.post('/api/register', async (req, res) => {
    const { pseudonym, email, userType, password } = req.body;

    if (!pseudonym || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = new User({ pseudonym, email, userType, password });
        await user.save();
        res.json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
