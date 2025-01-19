const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [ 'Strength', 'Flexibility', 'Yoga', 'Pilates'], 
        required: true
    },
    caloriesPerRep: { 
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Workout', workoutSchema);
