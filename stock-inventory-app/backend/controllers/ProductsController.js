const Supplier = require("../models/Supplier")
const Category = require("../models/Category")
const Products = require("../models/Products")

const getProducts = async (req, res)=>{
    try {
        const suppliers = await Supplier.find();
        const categories = await Category.find();

        return res.status(200).json({success: true, suppliers, categories})
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

module.exports = {getProducts, addProducts}