import React, { useState } from 'react'

const Suppliers = () => {
    const [addEditModal, setAddEditModal] = useState(false)
  return (
    <div className='w-full h-full flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Supplier Management</h1>
        <div className='flex justify-between items-center'>
            <input type="text" placeholder='Search' className='border p-1 bg-white rounded px-4'/>
            <button className='px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer'
            onClick={()=> setAddEditModal(1)}>Add Supplier</button>
        </div>


        {addEditModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Edit Supplier</h2>
                    <form  className="space-y-4">
                
                        <input
                        type="text"
                        // value={supplierName}
                        // onChange={(e) => setSupplierName(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Supplier Name"
                        />

                        <input
                        type="email"
                        // value={supplierEmail}
                        // onChange={(e) => setSupplierEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Supplier Email"
                        />

                        <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Update
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