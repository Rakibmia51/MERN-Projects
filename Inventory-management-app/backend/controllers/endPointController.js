const InvestmentEndpoint = require('../models/endPoint'); // আপনার মডেল পাথ

// নতুন ইনভেস্টমেন্ট এন্ডপয়েন্ট তৈরি করা
const createInvestmentEndpoint = async (req, res) => {
    try {
        const { projectId, endpointName, type, amount, date, description } = req.body;

        const newEntry = new InvestmentEndpoint({
            projectId,
            endpointName,
            type,
            amount,
            date,
            description
        });


        await newEntry.save();

        res.status(201).json({
            success: true,
            message: "Successfully created!",
            data: newEntry
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// একটি প্রজেক্টের সব এন্ডপয়েন্ট দেখা
const getAllInvestmentData = async (req, res) => {
    try {
        // ১. সকল ডাটাবেস এন্ট্রি নিয়ে আসা এবং প্রজেক্টের নাম পপুলেট করা
        const allEndpoints = await InvestmentEndpoint.find()
            .populate('projectId', 'projectName projectCode')
            .sort({ createdAt: -1 })
            .lean();

        // ২. সব ডাটা থেকে ইনকাম এবং এক্সপেন্স এর মোট যোগফল বের করা
        const overallTotals = allEndpoints.reduce((acc, curr) => {
            if (curr.type === 'Income') acc.income += curr.amount;
            if (curr.type === 'Expense') acc.expense += curr.amount;
            return acc;
        }, { income: 0, expense: 0 });

        // ৩. ফাইনাল রেসপন্স পাঠানো
        res.status(200).json({
            success: true,
            count: allEndpoints.length,
            overallTotals: {
                totalIncome: overallTotals.income,
                totalExpense: overallTotals.expense,
                totalProfit: overallTotals.income - overallTotals.expense
            },
            data: allEndpoints
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Data ante somossa hoyeche",
            error: error.message
        });
    }
};


// একটি নির্দিষ্ট প্রজেক্টের সব এন্ডপয়েন্ট দেখা
const getEndpointsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const endpoints = await InvestmentEndpoint.find({ projectId })
            .sort({ date: -1 }); // নতুনগুলো আগে দেখাবে

        // ইনকাম এবং এক্সপেন্স এর টোটাল ক্যালকুলেশন
        const totals = endpoints.reduce((acc, curr) => {
            if (curr.type === 'Income') acc.income += curr.amount;
            if (curr.type === 'Expense') acc.expense += curr.amount;
            return acc;
        }, { income: 0, expense: 0 });

        res.status(200).json({
            success: true,
            totalIncome: totals.income,
            totalExpense: totals.expense,
            netProfit: totals.income - totals.expense,
            data: endpoints
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// এন্ডপয়েন্ট ডিলিট করা
const deleteEndpoint = async (req, res) => {
    try {
        await InvestmentEndpoint.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports={createInvestmentEndpoint, getEndpointsByProject,  deleteEndpoint, getAllInvestmentData}