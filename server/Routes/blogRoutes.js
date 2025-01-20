const express = require('express');
const Brouter = express.Router();
const Blog = require('../Schema/blog');

// GET all blogs
Brouter.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = Brouter;
