const express = require('express');
const router = express.Router();
const User = require('../Schema/user');

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

module.exports = router;