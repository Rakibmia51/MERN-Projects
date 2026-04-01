import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Users = () => {

   const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: ""
   })
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
  
   const fetchUsers = async () => {
    try {
        setLoading(true);

        const response = await axios.get(
        "http://localhost:3000/api/users",
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
        }
        );

        setUsers(response.data.users);

    } catch (error) {
        console.error("Error fetching Users:", error);
    } finally {
        setLoading(false); // ✅ এক জায়গায় handle
    }
    };

    useEffect(() => {
    fetchUsers();
    }, []);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: value,
        }))
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const response = await axios.post(
        "http://localhost:3000/api/users/add",
        formData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
        }
        )
        if(response.data.success){
            alert("Users added successfully!")
            setFormData({
                name: "",
                email: "",
                password: "",
                address: "",
                role: ""
            })
            fetchUsers()
        }else{
            console.error("Error Adding User")
            alert("Error adding User. Please try again")
        }
    }
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure you want to delete?");

        if (confirmDelete) {
                try {
                const response = await axios.delete(
                `http://localhost:3000/api/users/delete/${id}`,
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                }
                );

                if (response.data.success) {
                    alert("User deleted successfully!");
                    fetchUsers() // refresh list
                }else{
                    console.error("Error Deleting User")
                    alert("Error Deleting User. Please try again.")
                }

            } catch (error) {
                console.error("Delete Error:", error);
                alert("Error deleting User");
            }
        }
    };
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );


    if(loading) return <div> Loading ....</div>

  return (
    <div className='p-4'>
        <h1 className='text-2xl font-bold mb-8'>Users Mangement</h1>

        <div className='flex flex-col lg:flex-row gap-4'>
            <div className='lg:w-1/3'>
               <div className='bg-white shadow-md rounded-lg p-4'>
                     <h2 className='text-center text-xl font-bold mb-4' >Add User</h2>
                    <form className='space-y-4' onSubmit={handleSubmit}>
                        <div>
                            <input 
                                type="text" 
                                placeholder='Enter Name' 
                                className='border border-gray-300 w-full p-2 rounded-md'
                                name='name'
                                required
                                onChange={handleChange}
                                />
                        </div>
                        <div>
                            <input 
                                type="email" 
                                placeholder='Enter Email' 
                                className='border border-gray-300 w-full p-2 rounded-md'
                                required
                                name='email'
                                onChange={handleChange}
                                />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder='Enter Password' 
                                className='border border-gray-300 w-full p-2 rounded-md'
                                required
                                name='password'
                                onChange={handleChange}
                                />
                        </div>
                        <div>
                            <input 
                                type="address" 
                                placeholder='Enter Address' 
                                className='border border-gray-300 w-full p-2 rounded-md'
                                required
                                name='address'
                                onChange={handleChange}
                                />
                        </div>
                        <div>
                            <select name="role"  className='border border-gray-300 w-full p-2 rounded-md'
                            onChange={handleChange}>
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="customer">Customer</option>
                            </select>
                        </div>
                        <div className='flex space-x-2'>
                             <button 
                                type='submit'
                                className='w-full mt-2 rounded-md bg-blue-500 text-white p-3 cursor-pointer hover:bg-blue-600 font-bold'
                                >
                                Add User
                            </button>
                        </div>
                    </form>
               </div>
            </div>



            <div className='lg:w-2/3'>
            <input type="text" placeholder='Search' className='p-2 bg-gray-200 w-full mb-4 rounded'
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)} 
            />
            <div className='bg-white shadow-md rounded-lg p-4'>
                <table className='w-full border-collapse border border-gray-200'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='border border-gray-200 p-2'>S No</th>
                            <th className='border border-gray-200 p-2'>Name</th>
                            <th className='border border-gray-200 p-2'>Email</th>
                            <th className='border border-gray-200 p-2'>Address</th>
                            <th className='border border-gray-200 p-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers && filteredUsers.map((user, index)=>(
                            <tr key={index}>
                                <td className='border border-gray-200 p-2'>{index + 1}</td>
                                <td className='border border-gray-200 p-2'>{user.name}</td>
                                <td className='border border-gray-200 p-2'>{user.email}</td>
                                <td className='border border-gray-200 p-2'>{user.address}</td>
                                <td className='border border-gray-200 p-2'>{user.role}</td>
                                <td className='border border-gray-200 p-2'>
                                    <button className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                    onClick={()=> handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <div>No Records</div>}
            </div>
        </div>

        </div>



        

        
    </div>
  )
}

export default Users