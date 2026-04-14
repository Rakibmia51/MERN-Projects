const Projects = require('../models/project');
const ShareIssue = require('../models/shareIssue');



const createShareIssue = async (req, res) => {
  try {
    // ১. সবশেষ ইস্যু খুঁজে বের করা
    const lastIssue = await ShareIssue.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;

    if (lastIssue && lastIssue.issueNumber) {
      const lastNum = parseInt(lastIssue.issueNumber.split('-')[1]);
      nextNumber = lastNum + 1;
    }

    const formattedNumber = `ISS-${nextNumber.toString().padStart(4, '0')}`;

    // ২. ডেটা সেভ করা
    const newIssue = new ShareIssue({
      ...req.body,
      issueNumber: formattedNumber,
      totalValue: req.body.totalQuantity * req.body.pricePerShare
    });

    await newIssue.save();
    res.status(201).json({ success: true, message: "Share Issued successfully", data: newIssue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getShareIssues = async (req, res) => {
    try {
        // populate('projectId', 'projectName') ব্যবহার করা হয়েছে যাতে প্রজেক্টের নামও পাওয়া যায়
        const shares = await ShareIssue.find()
            .populate('projectId', 'projectName') 
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: shares.length,
            shares: shares
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const singleShareIssue = async (req, res) => {
    try {
        const share = await ShareIssue.findById(req.params.id).populate('projectId', 'projectName');
        
        if (!share) {
            return res.status(404).json({
                success: false,
                message: "Share Issue record not found"
            });
        }

        return res.status(200).json({
            success: true,
            share: share
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// শেয়ার ইস্যু আপডেট করা
const updateShareIssue = async (req, res) => {
    try {
        const { totalQuantity, pricePerShare } = req.body;
        const totalValue = totalQuantity * pricePerShare;

        const updatedIssue = await ShareIssue.findByIdAndUpdate(
            req.params.id,
            { ...req.body, totalValue },
            {returnDocument: 'after'}
        );

        res.status(200).json({ success: true, message: "Updated successfully", data: updatedIssue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// শেয়ার ইস্যু ডিলিট করা
const deleteShareIssue = async (req, res) => {
    try {
        await ShareIssue.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getLatestPrice = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // প্রজেক্ট আইডি দিয়ে ডাটাবেস থেকে সবশেষ ইস্যু করা শেয়ারটি খুঁজে বের করা
        const latestIssue = await ShareIssue.findOne({ projectId: projectId })
            .sort({ createdAt: -1 }); // সবশেষটি পাওয়ার জন্য সর্ট করা

        if (latestIssue) {
           
                res.json({ 
                    success: true, 
                    price: latestIssue.pricePerShare, 
                    // আপনার ডাটাবেসে ফিল্ডের নাম totalQuantity
                    availableShares: latestIssue.totalQuantity, 
                    issueId: latestIssue._id 
                });
        } else {
            res.status(404).json({ success: false, message: "No stock found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports ={createShareIssue,getLatestPrice, getShareIssues, singleShareIssue, updateShareIssue, deleteShareIssue}