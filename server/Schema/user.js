const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String, enum: ['Male', 'Female', 'Other']
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    profileImage: {
        type: String
    },
    createdAt: {
        type: Date, default: Date.now
    },
},{ collection: 'Users' });

module.exports = mongoose.model('User', userSchema);