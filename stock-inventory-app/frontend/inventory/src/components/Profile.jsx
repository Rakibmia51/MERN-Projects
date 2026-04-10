import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Profile = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    })
    const [edit, setEdit] =useState(false)

    const fetchUser = async ()=>{
        try {
                const response = await axios.get(
                "https://api.wsfrc.com/api/users/profile",
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                });
                if(response.data.success){
                    setUser({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        address: response.data.user.address
                    })
                }else{
                    console.error("Error fetching User Profile:", error);
                    alert("Error Fetching User Profile. Please try again ")
                }
                
        } catch (error) {
            console.error("Error fetching User Profile:", error);
        }
    }
    useEffect(()=>{
            fetchUser();
        },[])

    const handleSubmit = async (e)=>{
        e.preventDefault();
         try {
                const response = await axios.put(
                "https://api.wsfrc.com/api/users/profile",user,
                {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                    },
                });
                if(response.data.success){
                    alert("Profile update successfully!")
                    setEdit(false)
                }else{
                    console.error("Error Profile update:", error);
                    alert("Error Profile update. Please try again ")
                }
                
        } catch (error) {
            console.error("Error Profile update:", error);
             alert("Error  Profile update. Please try again.")
        }
    }



  return (
    <div className='p-5'>
        <form className='bg-white p-6 rounded-lg shadow max-w-md'  onSubmit={handleSubmit}>
            <h2 className='font-bold text-2xl'>User Profile</h2>
            <div className='mb-4 mt-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Name
                </label>
                <input 
                    className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="text" 
                    name='name'
                    value={user.name}
                    onChange={(e)=> setUser({...user, name: e.target.value})}
                    disabled={!edit}
                    />
            </div>
             <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email
                </label>
                <input 
                    className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="email" 
                    name='email'
                    value={user.email}
                    onChange={(e)=> setUser({...user, email: e.target.value})}
                    disabled={!edit}
                   
                    />
            </div>
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Address
                </label>
                <input 
                    className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="address" 
                    name='address'
                    value={user.address}
                    disabled={!edit}
                    onChange={(e)=> setUser({...user, address: e.target.value})}
                    />
            </div>
            {edit && (
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Password
                    </label>
                    <input 
                        className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        type="password" 
                        placeholder='Enter new Password (Optional)'
                        name='password'
                        value={user.password}
                        onChange={(e)=> setUser({...user, password: e.target.value})}
                        />
                </div>
            )}

           {!edit ? (
             <button type='button' className='bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled: bg-yellow-300 cursor-pointer'
                onClick={()=> setEdit(!edit)}
            >
                Edit Profile
            </button>
           ): (
             <>
                <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled: bg-green-300 cursor-pointer'
                >
                Save Changes
                </button> 

                 <button type='button' className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled: bg-red-300 ml-2 cursor-pointer'
                onClick={()=> setEdit(!edit)}
                >
                Cancel
                </button>              
             </>
           )}
            
        </form>
        
    </div>
  )
}

export default Profile