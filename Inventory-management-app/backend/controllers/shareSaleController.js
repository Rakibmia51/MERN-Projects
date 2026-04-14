const ShareSale = require('../models/shareSale');


// শেয়ার সেল ক্রিয়েট করা
const createShareSale = async (req, res) => {
    try {
        // ১. অটো সেল নম্বর জেনারেট করা (SLS-0001)
        const lastSale = await ShareSale.findOne().sort({ createdAt: -1 });
        let nextNumber = 1;
        if (lastSale?.saleNumber) {
            nextNumber = parseInt(lastSale.saleNumber.split('-')[1]) + 1;
        }
        const formattedNumber = `SLS-${nextNumber.toString().padStart(4, '0')}`;

        // ২. নতুন সেল তৈরি (Total Amount ব্যাকএন্ডেও ডাবল চেক করা হচ্ছে)
        const newSale = new ShareSale({
            ...req.body,
            saleNumber: formattedNumber,
            totalAmount: req.body.quantity * req.body.pricePerShare
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
            .populate('issueId', 'issueNumber')   // Get issue number
            .populate('userId', 'fullName memberCode') // Get member details
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