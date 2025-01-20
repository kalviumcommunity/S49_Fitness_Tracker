const mongoose = require('mongoose'); 
const tutorialSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    videoUrl: {
        type: String, required: true
    },
    description: {
        type: String, enum: ['With Equipment', 'Without Equipment'], required: true
    },
    category: {
        type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true
    },
    type: {
        type: String, enum: ['Strength', 'Flexibility', 'Yoga', 'Pilates'], required: true
    }
}, {collection: 'Tutorials'});

module.exports = mongoose.model('Tutorial', tutorialSchema);
