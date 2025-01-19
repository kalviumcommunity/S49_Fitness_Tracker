const tutorialSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    videoUrl: {
        type: String, required: true
    },
    description: {
        type: String
    },
    category: {
        type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true
    },
});

module.exports = mongoose.model('Tutorial', tutorialSchema);
