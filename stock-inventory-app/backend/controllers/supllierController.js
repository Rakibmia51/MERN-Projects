const supplierModal = require("../models/Supplier")


const addSupplier = async(req, res)=>{
    try {
        const {name, email, number, address } = req.body

        // Check if the category already exists
        const existingSupplier = await supplierModal.findOne({name})
        if(existingSupplier){
            return res.status(400).json({success: false, message: 'Supplier already exists'})
        }

        // Create a new category
        const newSupplier = new supplierModal({
           name, email, number, address
        })

        await newSupplier.save();
        return res.status(201).json({success: true, message: 'Supplier added successfully'})

    } catch (error) {
        console.error('Error adding Supplier', error)
        res.status(500).json({success: false, message: 'Server Error'})
    }
}


const getSupplier = async (req, res)=>{
    try {
        const suppliers = await supplierModal.find();
        return res.status(200).json({success: true, suppliers})
    } catch (error) {
        console.error('Error fatching supplier', error)
        res.status(500).json({success: false, message: 'Server Error in getting suppliers'})
    }
}


const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number, address } = req.body;

    const updatedSupplier = await supplierModal.findByIdAndUpdate(
      id,
      { name, email, number, address },
      { returnDocument: "after" }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      category: updatedSupplier, // ✅ important
    });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating Supplier",
    });
  }
};


const deleteSupplier = async (req, res)=>{

    try {
        const {id} = req.params;

        // check if the category exists
        const existingSupplier = await supplierModal.findById(id);

        if (!existingSupplier) {
        return res.status(404).json({
            success: false,
            message: "Supplier not found",
        });
        }

        await supplierModal.findByIdAndDelete(id);
        return res.json({
        success: true,
        message: "Supplier deleted successfully",
        });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting Supplier",
    });
  }
}

module.exports = {addSupplier, getSupplier, updateSupplier, deleteSupplier}