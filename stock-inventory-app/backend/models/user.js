const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Stores as lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    select: false // Excludes password by default from queries for security
  },
  address: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'customer'], // Restricts values to specific options
    default: 'customer'
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;