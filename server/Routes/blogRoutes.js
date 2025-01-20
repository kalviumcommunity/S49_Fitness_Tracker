const express = require('express');
const router = express.Router();
const Blog = require('../Schema/blog');

// GET all blogs
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/blogs', async (req, res) => {
   try {
       // Extract blog data from request body
       const { authorId, title, content } = req.body;

       // Basic validation
       if (!authorId || !title || !content) {
           return res.status(400).json({ 
               message: 'Please provide authorId, title and content' 
           });
       }

       // Create new blog
       const newBlog = new Blog({
           authorId,
           title,
           content,
           likes: 0,
           comments: []
       });

       // Save blog to database
       const savedBlog = await newBlog.save();

       // Populate author details
       const populatedBlog = await Blog.findById(savedBlog._id)
           .populate('authorId', 'name email') // Only get name and email from User
           .exec();

       res.status(201).json({
           message: 'Blog created successfully',
           blog: populatedBlog
       });

   } catch (error) {
       console.error('Error creating blog:', error);
       
       // Handle specific MongoDB errors
       if (error.name === 'ValidationError') {
           return res.status(400).json({ 
               message: 'Validation Error', 
               error: error.message 
           });
       }

       if (error.name === 'CastError') {
           return res.status(400).json({ 
               message: 'Invalid authorId format', 
               error: error.message 
           });
       }

       res.status(500).json({ 
           message: 'Error creating blog', 
           error: error.message 
       });
   }
});

// Add comment to blog
router.post('/blogs/:blogId/comments', async (req, res) => {
   try {
       const { blogId } = req.params;
       const { userId, comment } = req.body;

       // Validate inputs
       if (!userId || !comment) {
           return res.status(400).json({ 
               message: 'Please provide userId and comment' 
           });
       }

       const blog = await Blog.findById(blogId);
       if (!blog) {
           return res.status(404).json({ message: 'Blog not found' });
       }

       // Add new comment
       blog.comments.push({
           userId,
           comment,
           date: new Date()
       });

       await blog.save();

       // Populate user details in comments
       const populatedBlog = await Blog.findById(blogId)
           .populate('authorId', 'name email')
           .populate('comments.userId', 'name email')
           .exec();

       res.status(200).json({
           message: 'Comment added successfully',
           blog: populatedBlog
       });

   } catch (error) {
       console.error('Error adding comment:', error);
       res.status(500).json({ 
           message: 'Error adding comment', 
           error: error.message 
       });
   }
});


// Update the blogg!!!!
router.put('/blogs/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title,
                content
            },
            { new: true } // Returns the updated document
        ).populate('authorId', 'name email');

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({
            message: 'Blog updated successfully',
            blog: updatedBlog
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating blog',
            error: error.message
        });
    }
});


// If u f*** up the comment
router.put('/blogs/:blogId/comments/:commentId', async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const { comment } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Find and update the specific comment
        const commentToUpdate = blog.comments.id(commentId);
        if (!commentToUpdate) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        commentToUpdate.comment = comment;
        await blog.save();

        const updatedBlog = await Blog.findById(blogId)
            .populate('authorId', 'name email')
            .populate('comments.userId', 'name email');

        res.status(200).json({
            message: 'Comment updated successfully',
            blog: updatedBlog
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating comment',
            error: error.message
        });
    }
});


module.exports = router;
