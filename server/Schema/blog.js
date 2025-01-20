const mongoose = require('mongoose'); 
const blogSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [
    {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          comment: {
              type: String
          },
          date: {
              type: Date, default: Date.now
          },
    },
  ],
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {collection: 'Blogs'});

module.exports = mongoose.model('Blog', blogSchema);
