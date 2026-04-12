const User = require("../models/user");
const bcrypt= require('bcrypt')



const addUser =async(req, res)=>{
    try {
        const {
                fullName,
                mobile,
                email,
                nid,
                dateOfBirth,
                fatherName,
                motherName,
                spouseName,
                occupation,
                monthlyIncome,
                presentAddress,
                permanentAddress,
                nomineeName,
                relation,
                nomineeMobile,
                admissionDate,
                role,
                admissionFee,
                password,
                memberPhoto,
                nidCopy,
                signature,
                remarks
                } = req.body;

                // Check if the User already exists
                const existsUser = await User.findOne({email})
                if(existsUser){
                    return res.status(400).json({success: false, message: "User already Exists"})
                }

                const hashedPassword = await bcrypt.hash(password, 10)
                // Create a new user
                const newUser = new User({
                    fullName,
                    mobile,
                    email,
                    nid,
                    dateOfBirth,
                    fatherName,
                    motherName,
                    spouseName,
                    occupation,
                    monthlyIncome,
                    presentAddress,
                    permanentAddress,
                    nomineeName,
                    relation,
                    nomineeMobile,
                    admissionDate,
                    role,
                    admissionFee,
                    password: hashedPassword,
                    memberPhoto,
                    nidCopy,
                    signature,
                    remarks
                })
                await newUser.save();
                return res.status(201).json({success: true, message: 'User added successfully'})

    } catch (error) {
        console.error('Error adding User', error)
        return res.status(500).json({success: false, message: 'Server Error'})
    }
}


const getUsers = async (req, res)=>{
    try {
        const users = await User.find();
        return res.status(200).json({success:true, users})
    } catch (error) {
         console.error('Error fatching users', error)
         return res.status(500).json({success: false, message: 'Server Error in getting users'})
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
       return  res.status(500).json({
                success: false,
                message: "Error get User profile",
                });
    }
}


const deleteUser = async(req, res)=>{
    try {
        const {id} = req.params;

        // check if the user exists
        const existingUser = await User.findById(id)
        if(!existingUser){
            return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }

        await User.findByIdAndDelete(id)
        return res.json({
        success: true,
        message: "User deleted successfully",
        });

    } catch (error) {
        console.error("Delete Error:", error);
       return  res.status(500).json({
                success: false,
                message: "Error deleting User",
                });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // URL থেকে মেম্বার আইডি নিবে
        const updateData = req.body;

        // যদি পাসওয়ার্ড আপডেট করতে চান, তবে সেটি হ্যাশ করতে হবে
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // User খুঁজে আপডেট করা
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true } // new: true দিলে আপডেট হওয়া ডাটা রিটার্ন করবে
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating User:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const statusUpdate = async (req, res)=>{
    try {
        const { id } = req.params;
        const { status } = req.body;

        // ভ্যালিডেশন: শুধুমাত্র active বা inactive এলাউড
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status value" 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { status: status }, 
            {returnDocument: 'after'} // আপডেট হওয়া ডাটাটি রিটার্ন করবে
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: `User is now ${status}`,
            user: updatedUser
        });

    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
}


module.exports = {addUser, getUsers, deleteUser, getProfile, updateUser, statusUpdate}