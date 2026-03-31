import React, { useEffect, useState } from 'react'
import axios from 'axios'


const Products = () => {
    const [openModal, setOpenModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        supplierId: ""
    })
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [editProducts, setEditProducts] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")


    const fetchProducts = async ()=>{
        try {
            
                setLoading(true);
                const response = await axios.get(
                "http://localhost:3000/api/products",
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                });
                if(response.data.success){
                    setSuppliers(response.data.suppliers);
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
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: value,
        }))
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        try {
            if(editProducts){
                 // ✅ UPDATE
                const response = await axios.put(
                    `http://localhost:3000/api/products/update/${editProducts}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                )

                if(response.data.success){
                    alert("Product updated successfully!")
                    closeModal()
                    setEditProducts(null)
                    fetchProducts()
                }
            }else{
                    const response = await axios.post(
                    "http://localhost:3000/api/products/add",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                    )
                    if(response.data.success){
                        alert("Products added successfully!")
                        setOpenModal(false)
                        setFormData({
                            name: "",
                            description: "",
                            price: "",
                            stock: "",
                            categoryId: "",
                            supplierId: ""
                        })
                        fetchProducts()
                    }else{
                        console.error("Error Adding Products:", response.data)

                        alert("Error adding Products. Please try again")
                    }
                }
            } catch (error) {
                console.error("Error Products:", error)
                alert("Error  Products. Please try again.")
            }
    }
    const handleEdit = async (product)=>{
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId._id,
            supplierId: product.supplierId._id
        })
        
        setEditProducts(product._id)
        setOpenModal(true)
    }
    const closeModal = ()=>{
        setOpenModal(false)
        setEditProducts(null)
        setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        supplierId: ""
        })
    }
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure you want to delete?");

        if (confirmDelete) {
                try {
                const response = await axios.delete(
                `http://localhost:3000/api/products/delete/${id}`,
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
                );

                if (response.data.success) {
                    alert("Product deleted successfully!");
                    fetchProducts(); // refresh list
                }else{
                    console.error("Error Deleting Product:", data)
                    alert("Error Deleting Product. Please try again.")
                }

            } catch (error) {
                console.error("Delete Error:", error.response?.data || error.message);
                alert("Error deleting Product");
            }
        }
    };
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryId.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplierId.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Product Management</h1>
        <div className='flex justify-between items-center'>
            <input type="text" 
                placeholder='Search' 
                className='border p-1 bg-white rounded px-4'
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                    
            />
            <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer'
            onClick={()=> {
                setOpenModal(true)
                setEditProducts(null)
                }
            }
            >Add Product</button>
        </div>

       {loading ? <div>Loading....</div> :(
             <div>
            <table className='w-full border-collapse border border-gray-300 mt-4'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='border border-gray-300 p-2'>SL No</th>
                        <th className='border border-gray-300 p-2'>Product Name</th>
                        <th className='border border-gray-300 p-2'>Category Name</th>
                        <th className='border border-gray-300 p-2'>Supplier Name</th>

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
                            <td className='border border-gray-300 p-2'>{product.supplierId.name}</td>
        
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
                                    onClick={() => handleEdit(product)}
                                    >Edit</button>
                                    <button className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                    onClick={()=> handleDelete(product._id)}
                                    >Delete</button>
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
                         {editProducts ? "Edit Product" : "Add Product"}
                    </h2>
                    <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer '
                    onClick={closeModal}
                    >X</button>
                    <form  className="space-y-4" 
                    onSubmit={handleSubmit}
                    >
                
                        <input
                        type="text"
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                        placeholder="Enter Product Name"
                        required
                        />

                        <input
                        type="text"
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                        placeholder="Enter Description"
                        required
                        />

                        <input
                        type="number"
                        name='price'
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                        placeholder="Enter Price"
                        required
                        />

                        <input
                        type="number"
                        min="0"
                        name='stock'
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Enter Stock"
                        required
                        />

                        <div className='w-full border'>
                            <select 
                                name="categoryId" 
                                value={formData.categoryId}
                                onChange={handleChange}
                                className='w-full p-2'>
                                <option value="">Select Category</option>
                                {categories && categories.map((category)=>(
                                    <option key={category._id} value={category._id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='w-full border'>
                            <select 
                                name="supplierId" 
                                value={formData.supplierId}
                                onChange={handleChange}
                                className='w-full p-2'>
                                <option value="">Select Supplier</option>
                                {suppliers && suppliers.map((supplier)=>(
                                    <option key={supplier._id} value={supplier._id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                                {editProducts ? "Save Changes" : "Add Product"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Products