import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, UserPlus } from 'lucide-react'; // Icons-er jonno

const MemberList = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/users',{
                     headers: {
                            // Bearer shoho token pathate hobe
                            Authorization: `Bearer ${localStorage.getItem("pos-token")}`, 
                    }
                });
                if (res.data.success) {
                    setMembers(res.data.users);
                }
            } catch (error) {
                console.error("Error fetching members", error);
            }
        };
        fetchMembers();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                {/* Header Section */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Member Directory</h2>
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                        <UserPlus size={18} className="mr-2" /> Add Member
                    </button>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Mobile</th>
                                <th className="px-6 py-4">Admission Date</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {members.length > 0 ? (
                                members.map((member) => (
                                    <tr key={member._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{member.fullName}</td>
                                        <td className="px-6 py-4 capitalize text-gray-600">{member.role}</td>
                                        <td className="px-6 py-4 text-gray-600">{member.mobile}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(member.admissionDate).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                member.status === 'active' || !member.status 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                                {member.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-3">
                                                <button className="text-blue-500 hover:text-blue-700">
                                                    <Edit size={18} />
                                                </button>
                                                <button className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">No members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MemberList;
