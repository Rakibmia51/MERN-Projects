import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Categories = () => {

    const [categoryName, setCategoryName]= useState("")
    const [categoryDescription, setCategoryDescription] = useState("")
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [editCategory, setEditCategory] = useState(null)


   const fetchCategories = async () => {
    try {
        setLoading(true);

        const response = await axios.get(
        "http://localhost:3000/api/category",
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
        }
        );

        setCategories(response.data.categories);

    } catch (error) {
        console.error("Error fetching categories:", error);
    } finally {
        setLoading(false); // ✅ এক জায়গায় handle
    }
    };

    useEffect(() => {
    fetchCategories();
    }, []);


    const handleSubmit = async (e) =>{
        e.preventDefault()

        if(editCategory){
            const response = await axios.put(
            `http://localhost:3000/api/category/update/${editCategory}`,
            {categoryName, categoryDescription},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            }
            )
            if(response.data.success){
                setCategoryName("")
                setCategoryDescription("")
                setEditCategory(null)
                alert("Category Updated successfully!")
                fetchCategories()

            }else{
                console.error("Error Updated Category:", data)

                alert("Error Updated category. Please try again")
            }
        }else{
            const response = await axios.post(
            "http://localhost:3000/api/category/add",
            {categoryName, categoryDescription},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                },
            }
            )
            if(response.data.success){
                setCategoryName("")
                setCategoryDescription("")
                alert("Category added successfully!")
                fetchCategories()

            }else{
                console.error("Error Adding Category:", data)

                alert("Error adding category. Please try again")
            }
        }
    }

    const handleEdit = async (category) =>{
        setEditCategory(category._id)
        setCategoryName(category.categoryName)
        setCategoryDescription(category.categoryDescription)
    }

    const handleCancel = async (category) =>{
        setEditCategory(null)
        setCategoryName("")
        setCategoryDescription("")
    }

    
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure you want to delete?");

        if (confirmDelete) {
                try {
                const response = await axios.delete(
                `http://localhost:3000/api/category/delete/${id}`,
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
                );

                if (response.data.success) {
                    alert("Category deleted successfully!");
                    fetchCategories(); // refresh list
                }else{
                    console.error("Error Deleting Category:", data)
                    alert("Error Deleting Category. Please try again.")
                }

            } catch (error) {
                console.error("Delete Error:", error.response?.data || error.message);
                if(error.response){
                    alert(error.response.data.message)
                }else{
                    alert("Error deleting category");
                } 
            }
        }

       
    };


    if(loading) return <div> Loading ....</div>

  return (
    <div className='p-4'>
        <h1 className='text-2xl font-bold mb-8'>Categories Mangement</h1>

        <div className='flex flex-col lg:flex-row gap-4'>
            <div className='lg:w-1/3'>
               <div className='bg-white shadow-md rounded-lg p-4'>
                     <h2 className='text-center text-xl font-bold mb-4' >{editCategory ? "Edit Category" : "Add Categories"}</h2>
                    <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <input 
                            type="text" 
                            placeholder='Categories Name' 
                            className='border border-gray-300 w-full p-2 rounded-md'
                            value={categoryName}
                            required
                            onChange={(e)=>setCategoryName(e.target.value)}
                            />
                    </div>
                        <div>
                            <textarea 
                                type="text" 
                                placeholder='Categories Description' 
                                className='border border-gray-300 w-full p-2 rounded-md'
                                required
                                value={categoryDescription}
                                onChange={(e)=>setCategoryDescription(e.target.value)}
                                />
                        </div>

                        <div className='flex space-x-2'>
                             <button 
                                type='submit'
                                className='w-full mt-2 rounded-md bg-blue-500 text-white p-3 cursor-pointer hover:bg-blue-600 font-bold'
                                >
                               {editCategory ? "Save Changes" : " Add Categories"}
                            </button>
                               
                            {editCategory && (
                                <button 
                                    type='button'
                                    className='w-full mt-2 rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600 font-bold'
                                    onClick= {handleCancel}
                                    >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
               </div>
            </div>



            <div className='lg:w-2/3'>
            <div className='bg-white shadow-md rounded-lg p-4'>
                <table className='w-full border-collapse border border-gray-200'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='border border-gray-200 p-2'>S No</th>
                            <th className='border border-gray-200 p-2'>Cagegory Name</th>
                            <th className='border border-gray-200 p-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index)=>(
                            <tr key={index}>
                                <td className='border border-gray-200 p-2'>{index + 1}</td>
                                <td className='border border-gray-200 p-2'>{category.categoryName}</td>
                                <td className='border border-gray-200 p-2'>
                                    <button className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-2'
                                    onClick={() => handleEdit(category)}>Edit</button>
                                    <button className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                    onClick={()=> handleDelete(category._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>

        </div>



        

        
    </div>
  )
}

export default Categories