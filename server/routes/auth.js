const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign(
            { id: savedUser._id },
            process.env.JWT_SECRET || 'fallback_secret_key_123',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            },
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No account with this email has been registered.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'fallback_secret_key_123',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify Token (Check if user is logged in)
router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.json(false);
    }
});

// Get User Data
router.get('/', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
        const user = await User.findById(verified.id);
        res.json({
            id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;
