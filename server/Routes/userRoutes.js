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

// Maybe they reduced weight or they f***ed up their name
router.put('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, age, gender, weight, height, profileImage, password } = req.body;

        // Create update object
        const updateData = {
            name,
            email,
            age,
            gender,
            weight,
            height,
            profileImage
        };

        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Remove undefined fields
        Object.keys(updateData).forEach(key => 
            updateData[key] === undefined && delete updateData[key]
        );

        // Check if email is being updated and if it already exists
        if (email) {
            const emailExists = await User.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if (emailExists) {
                return res.status(400).json({ 
                    message: 'Email already in use' 
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation Error', 
                error: error.message 
            });
        }
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
});
module.exports = router;