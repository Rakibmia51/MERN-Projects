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


    const fetchProducts = async ()=>{
        try {
            // setLoading(true);

            const response = await axios.get(
            "http://localhost:3000/api/products",
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            }
            );
            setSuppliers(response.data.suppliers);
            setCategories(response.data.categories)
        } catch (error) {
            console.error("Error fetching suppliers:", error);
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

        // if (!formData.categoryId || !formData.supplierId) {
        //     alert("Please select category and supplier");
        //     return;
        // }
        
        try {
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
                // fetchSupplier()
            }else{
                console.error("Error Adding Products:", response.data)

                alert("Error adding Products. Please try again")
            }
            
            } catch (error) {
                console.error("Error Products:", error)
                alert("Error  Products. Please try again.")
            }
    }
    

  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Product Management</h1>
        <div className='flex justify-between items-center'>
            <input type="text" 
                placeholder='Search' 
                className='border p-1 bg-white rounded px-4'
                // value={searchTerm}
                // onChange={(e)=>setSearchTerm(e.target.value)}
                    
            />
            <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer'
            onClick={()=> {
                setOpenModal(true)
                // setEditSupplier(null)
                }
            }
            >Add Product</button>
        </div>

        {openModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                    <h2 className="text-xl font-bold mb-4">
                        Add Product
                         {/* {editSupplier ? "Edit Supplier" : "Add Supplier"} */}
                    </h2>
                    <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer '
                    onClick={()=> setOpenModal(false)}
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
                                onClick={()=> setOpenModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                {/* {editSupplier ? "Save Changes" : "Add Supplier"} */}
                                Add Product
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