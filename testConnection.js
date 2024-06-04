const mongoose = require('mongoose');

// hide in env and reupload project while other project private.
const uri = 'mongodb+srv://adrianwegener:s98kt3ySaNFCRRtV@adriantestcluster.ochlylu.mongodb.net/';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
