const orderModel = require("../models/Order");
const Product = require("../models/Products")



const getData = async (req, res)=>{
    try {
        const totalProducts = await Product.countDocuments()

        const stockResult = await Product.aggregate([
            {$group: {_id: null, totalStock: {$sum: "$stock"}}}
        ])
        const totalStock = stockResult[0]?.totalStock || 0;


        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const ordersToday = await orderModel.countDocuments({
            orderDate: {$gte: startOfDay, $lte: endOfDay}
        })

        const revenueResult = await orderModel.aggregate([
            {$group: {_id: null, totalRevenue: {$sum: "$totalPrice"}}}
        ])
        const revenue = revenueResult[0]?.totalRevenue || 0;

        const outStock = await Product.find({stock: 0})
        .select('name stock')
        .populate('categoryId', 'categoryName')


        const highesSaleResult = await orderModel.aggregate([
            {$group: {_id: '$product', totalQuantity: {$sum: '$quantity'}}},
            {$sort: {totalQuantity: -1}},
            {$limit: 1},
            {
                $lookup:{
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: "$product"
            },
            {
                $lookup:{
                    from: 'categories',
                    localField: 'product.categoryId',
                    foreignField: '_id',
                    as: 'product.categoryId'
                }
            },
            {
                $unwind: "$product.categoryId"
            },
            {
                $project:{
                    name: '$product.name',
                    category: '$product.categoryId.categoryName',
                    totalQuantity: 1,
                }
            }
        ])
        const highesSaleProduct = highesSaleResult[0] || {message: "No sale Data available"}


        // low stock product
        const lowStock = await Product.find({stock: {$gt: 0, $lt: 5}})
        .select('name stock')
        .populate('categoryId', 'categoryName')

        const dashboardData = {
            totalProducts,
            totalStock,
            ordersToday,
            revenue,
            outStock,
            highesSaleProduct,
            lowStock
        }
        return res.status(200).json({success: true, dashboardData})
    } catch (error) {
        console.error('Error fatching Dashboard Data', error)
        res.status(500).json({success: false, message: 'Server Error in getting Dashboard Data'})
    }
}

module.exports = {getData}