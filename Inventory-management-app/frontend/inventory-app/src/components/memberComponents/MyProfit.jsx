import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wallet, Clock, CalendarDays, Briefcase, 
  Search, Printer, Download, CheckCircle2, AlertCircle 
} from 'lucide-react';

const MyProfit = () => {
  const [profitData, setProfitData] = useState([]);
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("pos-token")}` };
        
        // আপনার API এন্ডপয়েন্ট অনুযায়ী ডাটা ফেচ করুন
        // const resStats = await axios.get(`http://localhost:3000/api/memberSide/profit-stats`, { headers });
        const resUser = await axios.get('http://localhost:3000/api/users/profile', { headers });
        // const resHistory = await axios.get(`http://localhost:3000/api/memberSide/profit-history`, { headers });

        // setStats(resStats.data.data);
        setUser(resUser.data.user);
        console.log(resUser.data.user)
        // setProfitData(resHistory.data.history);
      } catch (error) {
        console.error("Profit data fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Search Logic
  const filteredHistory = profitData.filter(item => 
    item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.monthYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600">Loading Profit Details...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans print:bg-white print:p-0">
      
      {/* Page Header - Print Hidden */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">
          My Profit Overview
        </h1>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
        >
          <Printer size={18} /> Print Report
        </button>
      </div>

      {/* 1st Row: Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Received" value={`৳ ${stats?.totalReceived || 0}`} icon={<CheckCircle2 className="text-emerald-600" />} bg="bg-emerald-50" />
        <StatCard title="Pending Profit" value={`৳ ${stats?.totalPending || 0}`} icon={<Clock className="text-amber-600" />} bg="bg-amber-50" />
        <StatCard title="Year to Date" value={`৳ ${stats?.ytdProfit || 0}`} icon={<CalendarDays className="text-blue-600" />} bg="bg-blue-50" />
        <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon={<Briefcase className="text-purple-600" />} bg="bg-purple-50" />
      </div>

      {/* 2nd Row: Member Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <InfoBox label="Member Code" value={user?.memberCode} />
          <InfoBox label="Full Name" value={user?.fullName} />
          <InfoBox label="Mobile" value={user?.mobile} />
          <div className="bg-emerald-600 p-4 rounded-2xl text-white">
            <p className="text-[10px] uppercase font-bold opacity-80 tracking-widest">Current Balance</p>
            <p className="text-xl font-black">৳ {user?.currentBalance || 0}</p>
          </div>
        </div>
      </div>

      {/* 3rd Row: Profit History Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header & Search */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-black uppercase tracking-tighter text-gray-700">Profit Distribution History</span>
          <div className="relative w-full md:w-72 print:hidden">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search month or project..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="p-4">Month & Year</th>
                <th className="p-4">Project</th>
                <th className="p-4 text-center">Shares</th>
                <th className="p-4 text-center">Ownership%</th>
                <th className="p-4 text-right">Profit Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Disbursed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50/30 transition-colors text-sm">
                  <td className="p-4 font-bold text-gray-700">{row.monthYear}</td>
                  <td className="p-4 font-medium text-gray-600">{row.projectName}</td>
                  <td className="p-4 text-center font-bold">{row.quantity}</td>
                  <td className="p-4 text-center font-bold text-orange-600">{row.ownership}%</td>
                  <td className="p-4 text-right font-black text-emerald-600">৳ {row.profitAmount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      row.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-500">{row.disbursedDate || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, bg }) => (
  <div className={`${bg} rounded-3xl p-6 border border-white shadow-sm`}>
    <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm">{icon}</div>
    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-black text-gray-800">{value}</h3>
  </div>
);

const InfoBox = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{label}</p>
    <p className="text-gray-800 font-bold">{value || 'N/A'}</p>
  </div>
);

export default MyProfit;
