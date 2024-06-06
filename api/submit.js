const mongoose = require('mongoose');
const Result = require('../models/Result');

const mongoUri = process.env.MONGODB_URI;

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = db;
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
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
  
  try {
    await connectToDatabase(mongoUri);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    return res.status(500).json({ message: 'Server error: failed to connect to the database', error: error.message });
  }
  
  if (req.method === 'POST') {
    const { finalRound, time } = req.body;
  
    if (typeof finalRound !== 'number' || typeof time !== 'number') {
      console.log('Invalid result or time type');
      return res.status(400).json({ message: 'Result must be a string and time must be a number' });
    }
    
    try {
      console.log('Saving new result:', finalRound, time);
      const newResult = new Result({ finalRound, time });
      await newResult.save();
      console.log('Result saved successfully');

      // Fetch all results to calculate the rank
      const allResults = await Result.find({});
      const rank = allResults.length; // Basic rank logic

      return res.status(201).json({ message: 'Result saved successfully', rank });
    } catch (error) {
      console.error('Error saving result:', error);
      return res.status(500).json({ message: 'Server error: failed to save result', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};



  // try {
  //   await connectToDatabase(mongoUri);
  //   console.log('Database connected successfully');
  // } catch (error) {
  //   console.error('Error connecting to database:', error);
  //   return res.status(500).json({ message: 'Server error: failed to connect to the database', error: error.message });
  // }

  // if (req.method === 'POST') {
  //   const { result } = req.body;

  //   return res.status(200).json({ message: 'POST request successful' });
  // } else {
  //   res.setHeader('Allow', ['POST']);
  //   return res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
// };








// const mongoose = require('mongoose');
// const Result = require('../models/Result'); // Adjust the path if needed

// // Connect to MongoDB
// const mongoUri = process.env.MONGODB_URI;
// let cachedDb = null;

// async function connectToDatabase(uri) {
//   if (cachedDb) {
//     console.log("Using cached database connection.");
//     return cachedDb;
//   }

//   const db = await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   cachedDb = db;
//   return db;
// }

// module.exports = async (req, res) => {
//   // Set CORS headers for all responses
//   console.log("Request received:", req.method, req.url);
//   res.setHeader('Access-Control-Allow-Origin', 'https://a11yadrian.github.io');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Max-Age', '86400');

//   if (req.method === 'OPTIONS') {
//     console.log("Handling OPTIONS request.");
//     return res.status(200).end();
//   }

//   await connectToDatabase(mongoUri);

//   if (req.method === 'POST') {
//     const { result } = req.body;

//     if (!result) {
//       return res.status(400).json({ message: 'Result is required' });
//     }

//     try {
//       const newResult = new Result({ result });
//       await newResult.save();

//       const allResults = await Result.find({});
//       const rank = allResults.length; // Basic rank logic

//       return res.status(201).json({ rank });
//     } catch (error) {
//       console.error("Database connection error:", error);
//       return res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

// if (req.method === 'POST') {
//   console.log("Handling POST request.");
//   const { result } = req.body;

//   if (!result) {
//     console.log("Missing 'result' in request body.");
//     return res.status(400).json({ message: 'Result is required' });
//   }

//   try {
//     const newResult = new Result({ result });
//     await newResult.save();

//     const allResults = await Result.find({});
//     const rank = allResults.length;

//     console.log("Result saved successfully.");
//     return res.status(201).json({ rank });
//   } catch (error) {
//     console.error("Error saving result:", error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// } else {
//   console.log(`Method ${req.method} not allowed.`);
//   res.setHeader('Allow', ['POST']);
//   return res.status(405).end(`Method ${req.method} Not Allowed`);
// }
// };