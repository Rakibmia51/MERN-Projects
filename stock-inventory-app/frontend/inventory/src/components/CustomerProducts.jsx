import React, { useEffect, useState } from 'react'
import axios from 'axios'



const CustomerProducts = () => {

    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

      const fetchProducts = async ()=>{
        try {
            
                // setLoading(true);
                const response = await axios.get(
                "http://localhost:3000/api/products",
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
        // setLoading(false); // ✅ এক জায়গায় handle
        } 
    }
    useEffect(()=>{
        fetchProducts();
    },[])

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryId.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplierId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <div className='py-4 px-6'>
            <h2 className='font-bold text-xl'>
                Products
            </h2>
        </div>
        <div className='py-4 px-6 flex justify-between items-center'>
            <div>
                select
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
                                    // onClick={() => handleEdit(product)}
                                    >Order</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredProducts.length === 0 && <div>No Records</div>}
        </div>
    </div>
  )
}

export default CustomerProducts