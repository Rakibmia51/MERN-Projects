const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  stock:{
    type: Number,
    required: true
  },
  categoryId:{type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
  supplierId:{type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true}
}, { timestamps: true });

const ProductModal = mongoose.model("Product", productsSchema);

module.exports = ProductModal;