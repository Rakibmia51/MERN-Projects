const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  }
}, { timestamps: true });

const supplierModal = mongoose.model("Supplier", supplierSchema);

module.exports = supplierModal;