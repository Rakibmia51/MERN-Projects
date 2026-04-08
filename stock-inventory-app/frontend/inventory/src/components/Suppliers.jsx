import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Suppliers = () => {
    const [addModal, setaddModal] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        address: ""
    })
    const [loading, setLoading] = useState(true)
    const [suppliers, setSuppliers] = useState([])
    const [editSupplier, setEditSupplier] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")


    const closeModal = ()=>{
        setaddModal(false)
        setEditSupplier(false)
        setFormData({
        name: "",
        email: "",
        number: "",
        address: ""
        })
    }

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

            if(editSupplier){
            // ✅ UPDATE
                const response = await axios.put(
                    `http://localhost:3000/api/supplier/update/${editSupplier}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                        },
                    }
                )

                if(response.data.success){
                    alert("Supplier updated successfully!")
                    closeModal()
                    setEditSupplier(null)
                    fetchSupplier()
                }

            } else {
                const response = await axios.post(
                "http://localhost:3000/api/supplier/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
                )
                if(response.data.success){
                    alert("Supplier added successfully!")
                    setaddModal(false)
                    setFormData({
                    name: "",
                    email: "",
                    number: "",
                    address: ""
                    })
                    fetchSupplier()

                }else{
                    console.error("Error Adding Supplier:", response.data)

                    alert("Error adding Supplier. Please try again")
                }
            }
            } catch (error) {
                console.error("Error Supplier:", error)
                alert("Error  Supplier. Please try again.")
            }
    }

   const fetchSupplier = async () => {
    try {
        setLoading(true);

        const response = await axios.get(
        "http://localhost:3000/api/supplier",
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
        }
        );

        setSuppliers(response.data.suppliers);

    } catch (error) {
        console.error("Error fetching suppliers:", error);
    } finally {
        setLoading(false); // ✅ এক জায়গায় handle
    }
    };

    useEffect(() => {
    fetchSupplier();
    }, []);


    const handleEdit = async(supplier) =>{
        setFormData({
            name: supplier.name,
            email: supplier.email,
            number: supplier.number,
            address: supplier.address
        })
        setEditSupplier(supplier._id)
        setaddModal(true)
    }

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure you want to delete?");

        if (confirmDelete) {
                try {
                const response = await axios.delete(
                `http://localhost:3000/api/supplier/delete/${id}`,
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
                );

                if (response.data.success) {
                    alert("Supplier deleted successfully!");
                    fetchSupplier(); // refresh list
                }else{
                    console.error("Error Deleting Supplier:", data)
                    alert("Error Deleting Supplier. Please try again.")
                }

            } catch (error) {
                console.error("Delete Error:", error.response?.data || error.message);
                if(error.response){
                    alert(error.response.data.message)
                }else{
                    alert("Error deleting Supplier");
                }
                
            }
        }
    };

   const filteredSuppliers = suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.number.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Supplier Management</h1>
        <div className='flex justify-between items-center'>
            <input type="text" 
                placeholder='Search' 
                className='border p-1 bg-white rounded px-4'
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                    
            />
            <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer'
            onClick={()=> {
                setaddModal(true)
                setEditSupplier(null)
                }
            }>Add Supplier</button>
        </div>

        {loading ? <div>Loading.....</div> : (
            <div>
                <table className='w-full border-collapse border border-gray-300 mt-4'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='border border-gray-300 p-2'>SL No</th>
                            <th className='border border-gray-300 p-2'>Supplier Name</th>
                            <th className='border border-gray-300 p-2'>Email</th>
                            <th className='border border-gray-300 p-2'>Phone Number</th>
                            <th className='border border-gray-300 p-2'>Address</th>
                            <th className='border border-gray-300 p-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map((supplier, index)=>(
                            <tr key={index}>
                                <td className='border border-gray-300 p-2'>{index +1}</td>
                                <td className='border border-gray-300 p-2'>{supplier.name}</td>
                                <td className='border border-gray-300 p-2'>{supplier.email}</td>
                                <td className='border border-gray-300 p-2'>{supplier.number}</td>
                                <td className='border border-gray-300 p-2'>{supplier.address}</td>
                                <td className='border border-gray-300 p-2'>
                                        <button className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-2'
                                        onClick={() => handleEdit(supplier)}
                                        >Edit</button>
                                        <button className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                        onClick={()=> handleDelete(supplier._id)}
                                        >Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 && <div>No Records</div>}
            </div>
        )}
        
        {addModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                    <h2 className="text-xl font-bold mb-4">
                    
                         {editSupplier ? "Edit Supplier" : "Add Supplier"}
                    </h2>
                    <button className='absolute top-4 right-4 font-bold text-lg cursor-pointer '
                    onClick={closeModal}>X</button>
                    <form  className="space-y-4" onSubmit={handleSubmit}>
                
                        <input
                        type="text"
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                        placeholder="Supplier Name"
                        required
                        />

                        <input
                        type="email"
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                        placeholder="Supplier Email"
                        required
                        />

                        <input
                        type="number"
                        name='number'
                        value={formData.number}
                        onChange={handleChange}
                        className="w-full border p-1 rounded"
                        placeholder="Supplier Number"
                        required
                        />

                        <input
                        type="text"
                        name='address'
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Supplier Address"
                        required
                        />

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
                                {editSupplier ? "Save Changes" : "Add Supplier"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default Suppliers