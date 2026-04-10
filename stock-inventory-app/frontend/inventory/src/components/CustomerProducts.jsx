import React, { useEffect, useState } from 'react'
import axios from 'axios'



const CustomerProducts = () => {

    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [orderData, setOrderData] = useState({
        productId:"",
        quantity: 1,
        total : 0,
        stock:0,
        price: 0
    })

    const fetchProducts = async ()=>{
        try {
            
                setLoading(true);
                const response = await axios.get(
                "https://api.wsfrc.com/api/products",
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                });
                if(response.data.success){
                    setCategories(response.data.categories)
                    setProducts(response.data.products)
                }else{
                    console.error("Error fetching Products:", error);
                    alert("Error Fetching Products. Please try again ")
                }
                
        } catch (error) {
            console.error("Error fetching Products:", error);
        }finally {
        setLoading(false); // ✅ এক জায়গায় handle
        } 
    }
    useEffect(()=>{
        fetchProducts();
    },[])

    const filteredProducts = products.filter((product) => {

        // Search Filter
        const matchesSearch =  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryId.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplierId.name.toLowerCase().includes(searchTerm.toLowerCase())
    
        // Category Filter
        const matchesCategory =
        selectedCategory === "" || product.categoryId?._id === selectedCategory;

    return matchesSearch && matchesCategory;
    
    });

    const closeModal = ()=>{
        setOpenModal(false)

    }

    const handleOrderChange = (product)=>{
        setOrderData({
            productId: product._id,
            quantity: 1,
            total: product.price,
            stock: product.stock,
            price: product.price
        })
        setOpenModal(true)
    }

    const handleSubmit = async (e) =>{
          e.preventDefault();

          try {
              const response = await axios.post(
                    "https://api.wsfrc.com/api/order/add",
                    orderData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                    )
                    if(response.data.success){
                        alert("Order Place successfully!")
                        setOpenModal(false)
                        setOrderData({
                            productId: "",
                            quantity: 1,
                            total: 0,
                            stock: 0,
                            price: 0
                        })
                        fetchProducts()
                    }else{
                        console.error("Error Add Order Data:", response.data)

                        alert("Error Add Order Data. Please try again")
                    }
          } catch (error) {
              console.error('Error adding Order', error)
                res.status(500).json({success: false, message: 'Server Error adding Order'})
          }
    }

    const increaseQuantity = (e)=>{
        if(e.target.value > orderData.stock){
            alert("Not enougth stock")
        }else{
            setOrderData((prev)=>({
                ...prev,
                quantity: parseInt(e.target.value),
                total: parseInt(e.target.value) * parseInt(orderData.price)
            }))
        }
    }

  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <div className='py-4 px-6'>
            <h2 className='font-bold text-xl'>
                Products
            </h2>
        </div>
        <div className='py-4 px-6 flex justify-between items-center'>
            <div>
                <select name='category' id='' className='bg-white border p-1 rounded'
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Selct Category</option>
                    {categories && categories.map((cat, index)=>(
                        <option key={cat._id} value={cat._id}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <input type="text" 
                placeholder='Search' 
                className='border p-1 bg-white rounded px-4'
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}   
                />
            </div>
        </div>

        {loading ? <div>Loading....</div> :(
        <div>
            <table className='w-full border-collapse border border-gray-300 mt-4'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='border border-gray-300 p-2'>SL No</th>
                        <th className='border border-gray-300 p-2'>Product Name</th>
                        <th className='border border-gray-300 p-2'>Category Name</th>

                        <th className='border border-gray-300 p-2'>Price</th>
                        <th className='border border-gray-300 p-2'>Stock</th>
                        <th className='border border-gray-300 p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product, index)=>(
                        <tr key={index}>
                            <td className='border border-gray-300 p-2'>{index +1}</td>
                            <td className='border border-gray-300 p-2'>{product.name}</td>
                            <td className='border border-gray-300 p-2'>{product.categoryId.categoryName}</td>
        
                            <td className='border border-gray-300 p-2'>{product.price}</td>
                            <td className='border border-gray-300 p-2'>
                                <span className='rounded-full font-semibold'>
                                    {product.stock == 0 ? (
                                        <span className='bg-red-100 text-red-500 px-2 py-1 rounded-full'>{product.stock}</span>
                                    ) : product.stock < 5 ? (
                                        <span className='bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full'>{product.stock}</span>
                                    ) : (<span className='bg-green-100 text-green-500 px-2 py-1 rounded-full'>{product.stock}</span>)}
                                </span>
                            </td>
                          
                            <td className='border border-gray-300 p-2'>
                                    <button className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-2'
                                    onClick={() => {
                                        handleOrderChange(product)
                                    }}
                                    >Order</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredProducts.length === 0 && <div>No Records</div>}
        </div>
        )}

        {openModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                    <h2 className="text-xl font-bold mb-4">
                         {/* {editProducts ? "Edit Product" : "Add Product"} */}
                         Place Order
                    </h2>
                    <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer '
                    onClick={closeModal}
                    >X</button>
                    <form  className="space-y-4" 
                    onSubmit={handleSubmit}
                    >
                        <input
                        type="number"
                        min="1"
                        name='quantity'
                        value={orderData.quantity}
                        onChange={increaseQuantity}
                        className="w-full border p-2 rounded"
                        placeholder="Increase Order Quantity."
                        required
                        />

                        <p>Total : {orderData.quantity * orderData.price}</p>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                {/* {editProducts ? "Save Changes" : "Add Product"} */}
                                Order Submit
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        )}
       
    </div>
  )
}

export default CustomerProducts