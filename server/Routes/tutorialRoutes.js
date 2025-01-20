const express = require('express');
const Trouter = express.Router();
const Tutorial = require('../Schema/tutorial');

// GET all tutorials
Trouter.get('/tutorials', async (req, res) => {
    try {
        const tutorials = await Tutorial.find();
        res.json(tutorials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = Trouter;