const Supplier = require("../models/Supplier")
const Category = require("../models/Category")
const Products = require("../models/Products")

const getProducts = async (req, res)=>{
    try {
        const products = await Products.find({isDeleted: false}).populate('categoryId').populate('supplierId');
        const suppliers = await Supplier.find();
        const categories = await Category.find();

        return res.status(200).json({success: true, products, suppliers, categories})
    } catch (error) {
        console.error('Error fatching supplier', error)
        res.status(500).json({success: false, message: 'Server Error in getting suppliers'})
    }
}

const addProducts = async(req, res)=>{
    try {
        const { name, description, price, stock, categoryId, supplierId } = req.body

        // Check if the Product already exists
        const existingProduct = await Products.findOne({name})
        if(existingProduct){
            return res.status(400).json({success: false, message: 'Product already exists'})
        }

        // Create a new Product
        const newProduct = new Products({
           name, description, price, stock, categoryId, supplierId
        })

        await newProduct.save();
        return res.status(201).json({success: true, message: 'Product added successfully'})

    } catch (error) {
        console.error('Error adding Product', error)
        res.status(500).json({success: false, message: 'Server Error'})
    }
}

const updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, supplierId} = req.body;

    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { name, description, price, stock, categoryId, supplierId },
      { returnDocument: "after" }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct, // ✅ important
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating Product",
    });
  }
};

const deleteProducts = async (req, res)=>{

    try {
        const {id} = req.params;

        // check if the category exists
        const existingProduct = await Products.findById(id);

        if (!existingProduct) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
        }

        if(existingProduct.isDeleted){
           return res.status(400).json({
            success: false,
            message: "Product already Deleted",
          });
        }

        await Products.findByIdAndUpdate(id, {isDeleted: true}, { returnDocument: 'after' });
        return res.json({
        success: true,
        message: "Product deleted successfully",
        });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting Product",
    });
  }
}

module.exports = {getProducts, addProducts, updateProducts, deleteProducts}