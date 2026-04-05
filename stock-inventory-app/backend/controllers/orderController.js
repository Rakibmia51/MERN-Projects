
const Order = require("../models/Order")
const Products = require("../models/Products")


const addOrder = async (req, res)=>{
    try {
        const { productId, quantity, total} = req.body
        const userId = req.user._id
        const product = await Products.findById({_id: productId})
        if(!product){
            return res.status(404).json({error: "product not found in order"})
        }

        if(quantity > product.stock){
            return res.status(404).json({error: "Not enough stock"})
        }else{
            product.stock -= parseInt(quantity)
            await product.save()
        }

        const orderObj = new Order({
            customer: userId,
            product: productId,
            quantity,
            totalPrice: total
        })
         await orderObj.save()
         return res.status(200).json({success: true, message: 'Order added successfully'})
       

    } catch (error) {
        console.error('Error adding Order', error)
        res.status(500).json({success: false, message: 'Server Error adding order'})
    }
}

const getOrders = async (req, res)=>{
    try {
        const userId = req.user._id;
        const orders = await Order.find({customer: userId}).populate({path: 'product', populate: {
            path: 'category',
            select: 'categoryName',
        }, select: 'name price'}).populate('user', 'name email')
        return res.status(200).json({success: true, orders})
    } catch (error) {
         console.error('Error get Order', error)
          res.status(500).json({success: false, message: 'Server Error get order'})
    }
}

module.exports= {addOrder, getOrders}