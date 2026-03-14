const mongoose = require('mongoose');

require('dotenv').config();

async function dbConnection() {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

module.exports = dbConnection;