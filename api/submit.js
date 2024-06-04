const mongoose = require('mongoose');
const Result = require('../models/Result'); // Adjust the path if needed

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', 'https://a11yadrian.github.io'); // Allow requests from your GitHub Pages site
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache the preflight response for 24 hours

  if (req.method === 'OPTIONS') {
    // Respond to preflight requests
    return res.status(200).end();
  }

  await connectToDatabase(mongoUri);

  if (req.method === 'POST') {
    const { result } = req.body;

    if (!result) {
      return res.status(400).json({ message: 'Result is required' });
    }

    try {
      const newResult = new Result({ result });
      await newResult.save();

      const allResults = await Result.find({});
      const rank = allResults.length; // Basic rank logic

      return res.status(201).json({ rank });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
