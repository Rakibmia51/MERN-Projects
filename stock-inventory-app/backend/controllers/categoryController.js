const Category = require("../models/Category")
const Products = require("../models/Products")

const addCategory = async(req, res)=>{
    try {
        const {categoryName, categoryDescription } = req.body

        // Check if the category already exists
        const existingCategory = await Category.findOne({categoryName})
        if(existingCategory){
            return res.status(400).json({success: false, message: 'Category already exists'})
        }

        // Create a new category
        const newCategory = new Category({
            categoryName,
            categoryDescription
        })

        await newCategory.save();
        return res.status(201).json({success: true, message: 'Category added successfully'})

    } catch (error) {
        console.error('Error adding category', error)
        res.status(500).json({success: false, message: 'Server Error'})
    }
}


const getCategories = async (req, res)=>{
    try {
        const categories = await Category.find();
        return res.status(200).json({success: true, categories})
    } catch (error) {
        console.error('Error fatching category', error)
        res.status(500).json({success: false, message: 'Server Error in getting categories'})
    }
}


const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName, categoryDescription },
      { returnDocument: "after" }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory, // ✅ important
    });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating category",
    });
  }
};

const deleteCategory = async (req, res)=>{

    try {
        const {id} = req.params;

        const productCount = await Products.countDocuments({categoryId: id})
        if(productCount > 0){
          return res.status(404).json({
            success: false,
            message: "Can not Delete category associated with products",
          });
        }
        // check if the category exists
        const existingCategory = await Category.findById(id);

        if (!existingCategory) {
        return res.status(404).json({
            success: false,
            message: "Category not found",
        });
        }

        await Category.findByIdAndDelete(id);
        return res.json({
        success: true,
        message: "Category deleted successfully",
        });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting category",
    });
  }
}

module.exports = {addCategory, getCategories, updateCategory, deleteCategory}