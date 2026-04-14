const ShareSale = require('../models/shareSale');
const ShareIssue = require('../models/shareIssue');

// শেয়ার সেল ক্রিয়েট করা
const createShareSale = async (req, res) => {
    try {
        const { projectId, quantity, issueId } = req.body;
         // ১. আগে চেক করুন শেয়ার স্টকে আছে কি না
        const issue = await ShareIssue.findById(issueId);
        if (!issue || issue.totalQuantity < quantity) {
            return res.status(400).json({ success: false, message: "Not enough shares available!" });
        }

        // 2. অটো সেল নম্বর জেনারেট করা (SLS-0001)
        const lastSale = await ShareSale.findOne().sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastSale?.saleNumber) {
            nextNumber = parseInt(lastSale.saleNumber.split('-')[1]) + 1;
        }
        const formattedNumber = `SLS-${nextNumber.toString().padStart(4, '0')}`;

        // 3. নতুন সেল তৈরি (Total Amount ব্যাকএন্ডেও ডাবল চেক করা হচ্ছে)
        const newSale = new ShareSale({
            ...req.body,
            saleNumber: formattedNumber,
           totalAmount: Number(quantity) * Number(req.body.pricePerShare),
            soldBy: req.user.id // এটি অটোমেটিক আপনার 'auth' মিডলওয়্যার থেকে আসবে
        });

        // ৪. [গুরুত্বপূর্ণ] ShareIssue থেকে কোয়ান্টিটি কমিয়ে দিন
        // এটিই আপনার স্টক আপডেট করবে
        await ShareIssue.findByIdAndUpdate(issueId, {
            $inc: { totalQuantity: -Number(quantity) }
        });

        await newSale.save();
        res.status(201).json({ success: true, message: "Share sale recorded successfully", data: newSale });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllShareSales = async (req, res) => {
    try {
        const shareSales = await ShareSale.find()
            .populate('projectId', 'projectName') // Get project name
            .populate('userId', 'fullName memberCode') // Get member details
            .populate('soldBy', 'fullName memberCode email') // Populating Admin Name
            .sort({ createdAt: -1 }); // Newest first


        res.status(200).json({
            success: true,
            count: shareSales.length,
            shareSales
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




module.exports = {createShareSale, getAllShareSales}