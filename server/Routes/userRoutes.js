const express = require('express');
const router = express.Router();
const User = require('../Schema/user');
const bcrypt = require('bcryptjs');

// GET all users
router.get('/accounts', async (req, res) => {
    try {
        const Users = await User.find();
        res.status(200).json(Users);
    } catch (error) {
        console.error('Error fetching users:', error); 
        res.status(500).json({ error: error.message });
    }
});

//Post req for users
router.post('/accounts', async (req, res) => { 
        try {
        // Extract user data from request body
        const { name, email, password, age, gender, weight, height, profileImage } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            weight,
            height,
            profileImage
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

module.exports = router;