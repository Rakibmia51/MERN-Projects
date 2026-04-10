import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Orders = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])

   const fetchOrders = async ()=>{
          try {
              
                  setLoading(true);
                  const response = await axios.get(
                  "https://api.wsfrc.com/api/order",
                  {
                      headers: {
                      Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
                      },
                  });
                  if(response.data.success){
                      setOrders(response.data.orders)
                  }else{
                      console.error("Error fetching Orders:", error);
                      alert("Error Fetching Orders. Please try again ")
                  }
                  
          } catch (error) {
              console.error("Error fetching Orders:", error);
          }finally {
          setLoading(false); // ✅ এক জায়গায় handle
          } 
      }
    useEffect(()=>{
          fetchOrders();
      },[])

  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Orders</h1>
       
       {loading ? <div>Loading....</div> :(
        <div>
            <table className='w-full border-collapse border border-gray-300 mt-4'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='border border-gray-300 p-2'>SL No</th>
                        <th className='border border-gray-300 p-2'>Product Name</th>
                        <th className='border border-gray-300 p-2'>Category Name</th>
                        <th className='border border-gray-300 p-2'>Quantity</th>
                        <th className='border border-gray-300 p-2'>Total Price</th>
                        <th className='border border-gray-300 p-2'>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index)=>(
                        <tr key={index}>
                            <td className='border border-gray-300 p-2'>{index +1}</td>
                            <td className='border border-gray-300 p-2'>{order.product.name}</td>
                            <td className='border border-gray-300 p-2'>{order.product.categoryId.categoryName}</td>
                            <td className='border border-gray-300 p-2'>{order.quantity}</td>
                            <td className='border border-gray-300 p-2'>{order.totalPrice}</td>
                            <td className='border border-gray-300 p-2'>
                                  {new Date(order.orderDate).toLocaleDateString()} 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {orders.length === 0 && <div>No Records</div>}
        </div>
       )}

    </div>
  )
}

export default Orders