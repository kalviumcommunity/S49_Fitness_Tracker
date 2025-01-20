const express = require('express');
const Wrouter = express.Router();
const Workout = require('../Schema/workout');

// GET all workouts
Wrouter.get('/workouts', async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = Wrouter;