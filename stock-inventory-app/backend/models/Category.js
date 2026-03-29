const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  categoryDescription: {
    type: String,
    required: true,
    unique: true
  }
 
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;