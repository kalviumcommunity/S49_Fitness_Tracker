const express = require('express');
const cors = require('cors');
const connectDB = require('./connectDB');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// Connect to MongoDB


// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.use('/api', require('./Routes/workoutRoutes'));
app.use('/api', require('./Routes/userRoutes'));
app.use('/api', require('./Routes/tutorialRoutes'));
app.use('/api', require('./Routes/blogRoutes'));

// To start the server


connectDB().then(() => {
    
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})