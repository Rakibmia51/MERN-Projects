const User = require("../models/user")
const bcrypt = require("bcrypt")


const addUser = async(req, res)=>{
    try {
        const {name, email, password, address, role } = req.body

        // Check if the User already exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new User
        const newUser = new User({
            name, email, password: hashedPassword, address, role
        })

        await newUser.save();
        return res.status(201).json({success: true, message: 'User added successfully'})

    } catch (error) {
        console.error('Error adding User', error)
        res.status(500).json({success: false, message: 'Server Error'})
    }
}


const getUsers = async (req, res)=>{
    try {
        const users = await User.find();
        return res.status(200).json({success: true, users})
    } catch (error) {
        console.error('Error fatching users', error)
        res.status(500).json({success: false, message: 'Server Error in getting users'})
    }
}

const deleteUser = async (req, res)=>{

    try {
        const {id} = req.params;

        // check if the User exists
        const existingUser = await User.findById(id);

        if (!existingUser) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }

        await User.findByIdAndDelete(id);
        return res.json({
        success: true,
        message: "User deleted successfully",
        });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting User",
    });
  }
}

const getProfile = async(req, res)=>{
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password')
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }
        return res.status(200).json({success: true, user})
    } catch (error) {
        console.error("Get User profile Error:", error);
        res.status(500).json({
        success: false,
        message: "Error get User profile",
        });
    }
}

const updateUserProfile = async(req, res)=>{
    try {
        const userId = req.user._id;
        const {name, email, address, password} = req.body;

        const updatedata = {name, email, address};
        if(password && password.trim() !==''){
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedata.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(userId, updatedata,{ returnDocument: "after" }).select('-password')
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }
        return res.status(200).json({success: true, message: 'Profile Updated Successfully', user})
    } catch (error) {
        console.error("Update User profile Error:", error);
        res.status(500).json({
        success: false,
        message: "Error Update User profile",
        });
    }
}

module.exports = {addUser, getUsers, deleteUser, getProfile, updateUserProfile}