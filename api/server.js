const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
//const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Use cors middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the schema and model for storing test results
const resultSchema = new mongoose.Schema({
    result: String,
    timestamp: { type: Date, default: Date.now }
});

const Result = mongoose.model('Result', resultSchema);

// API endpoint to submit test results
app.post('/api/submit', async (req, res) => {
    console.log('Received data:', req.body); // Log the received data
    try {
        const { result } = req.body;
        if (!result) {
          return res.status(400).send('Result is required');
        }
    
        const newResult = new Result({ result });
        await newResult.save();
    
        const allResults = await Result.find({});
        const rank = allResults.length; // Basic rank logic
    
        res.json({ rank });
      } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).send('Server error');
      }
});

// Start the server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

module.exports = app;
