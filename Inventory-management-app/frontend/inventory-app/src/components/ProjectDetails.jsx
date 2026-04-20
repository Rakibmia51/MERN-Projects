import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Landmark, Wallet, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, BadgeDollarSign } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/projects/details/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
        });
        setProject(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchProject();
  }, [id]);

  if (!project) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Loading...</div>;

  // --- Calculations ---
  const totalCashIn = (project.initialInvestment || 0) + (project.shareValue || 0);
  const availableToDeploy = totalCashIn - (project.expenses || 0);
  const roi = project.initialInvestment > 0 ? (((project.currentValue - project.initialInvestment) / project.initialInvestment) * 100).toFixed(1) : 0;
  const totalInvestment = (project.shareDetails.soldQuantity || 0) * (project.shareDetails.pricePerShare || 0)

  //--- Ownership Summary 

  // মোট ইস্যু করা শেয়ার সংখ্যা (ধরা যাক ১২০০)
    const totalProjectShares = project.shareDetails?.totalQuantity || 1; 

    // মেম্বার অনুযায়ী শেয়ার গ্রুপ করা
    const ownershipData = project.shareSales.reduce((acc, sale) => {
      const memberId = sale.userId._id;
      if (!acc[memberId]) {
        acc[memberId] = {
          name: sale.userId.fullName,
          totalQty: 0,
          memberCode: sale.userId.memberCode
        };
      }
      acc[memberId].totalQty += sale.quantity;
      return acc;
    }, {});

    // অবজেক্টকে অ্যারেতে রূপান্তর
    const ownershipList = Object.values(ownershipData);


  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-800">
      {/* Top Simple Navigation */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-xs font-bold transition-all">
          <ArrowLeft size={14}/> BACK PAGE
        </button>
        <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-tighter">Project Identity: {project.projectCode}</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-3">
        {/* Main Heading Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight">{project.projectName}</h1>
            <div className="flex gap-4 mt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><Calendar size={12}/> {new Date(project.expectedStartDate).toLocaleDateString()}</span>
              <span className={`text-[10px] font-black uppercase ${project.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>● {project.status}</span>
            </div>
          </div>
          <div className="bg-blue-600 px-5 py-3 rounded-xl text-white text-center min-w-[150px]">
            <p className="text-[9px] font-bold uppercase opacity-80">Available to Deploy</p>
            <h3 className="text-xl font-black">৳{availableToDeploy.toLocaleString()}</h3>
          </div>
        </div>

        {/* Small Financial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <CompactCard title="Total Share Value" value={project.shareDetails.totalValue.toLocaleString()} color="text-slate-600" />
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center items-center">
            <p className="text-[9px] font-black text-slate-400 uppercase">Share Qty</p>
            <h3 className={`text-lg font-black text-indigo-600`}>{project.shareDetails.totalQuantity}</h3>
          </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center items-center">
            <p className="text-[9px] font-black text-slate-400 uppercase">Share Price</p>
            <h3 className={`text-lg font-black text-indigo-600`}>{project.shareDetails.pricePerShare}</h3>
          </div>

          <CompactCard title="Total Investment" value={totalInvestment.toLocaleString()} color="text-slate-600" />
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center items-center">
            <p className="text-[9px] font-black text-slate-400 uppercase">Share Sale Qty</p>
            <h3 className={`text-lg font-black text-indigo-600`}>{project.shareDetails.soldQuantity}</h3>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center items-center">
            <p className="text-[9px] font-black text-slate-400 uppercase">ROI Performance</p>
            <h3 className={`text-lg font-black ${roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{roi}%</h3>
          </div>
          <CompactCard title="Total Income" value={project.totalIncome} color="text-emerald-600" highlight />
          <CompactCard title="Total Expenses" value={project.expenses} color="text-rose-600" />
          <CompactCard title="Current Value" value={project.currentValue} color="text-blue-600" />
         
        </div>

        {/* Bottom Section: Description & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1"><FileText size={12}/> Project Description</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{project.description || "No description provided."}</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">Manager Notes</h4>
            <p className="text-xs text-slate-500 italic">{project.notes || "No special notes recorded for this project."}</p>
          </div>
        </div>

        {/* Share Distribution Table */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Share Distribution
            </h2>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded">
              Recent Sales
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase">Sales No</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase">Member</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase">Sale Date</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase">Quantity</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase">Value</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* জাস্ট স্যাম্পল ডাটা দিয়ে লুপ চালানো হয়েছে, আপনি আপনার actual data map করবেন */}
                {project.shareSales?.map((sale, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-bold text-slate-600">#{sale.saleNumber || '001'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          {sale.memberName?.charAt(0) || 'M'}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{sale.userId.fullName || 'John Doe'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-xs font-black text-slate-700">{sale.quantity}</td>
                    <td className="px-5 py-3 text-xs font-black text-indigo-600">
                      {sale.totalAmount?.toLocaleString()} TK
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ownership Summary Table */}
        <div className="mt-6 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5">
            Ownership Summary (%)
          </h2>
          <div className="space-y-5">
            {ownershipList.map((member, index) => {
              const percentage = ((member.totalQty / totalProjectShares) * 100).toFixed(2);
              
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600">{member.name} ({member.memberCode})</span>
                    <span className="text-indigo-600">{percentage}%</span>
                  </div>
                  
                  {/* Progress Bar Background */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-[10px] text-slate-400">
                    Holding {member.totalQty} shares out of {totalProjectShares}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

          {/* Investment Endpoints Table */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table Header Section */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">
              Investment Endpoints
            </h2>
            <button className="text-[11px] font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all">
              Add Investment
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">Income</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">Expense</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">Profit</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* লুপ চালিয়ে ডাটা দেখানোর জন্য: project.investments.map(...) */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-slate-700">{project.projectName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{project.projectCode}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">
                    {project.description || "Agro"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                      project.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-emerald-600">
                    +{(project.totalIncome || 0).toLocaleString()} TK
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-rose-500">
                    -{(project.expenses || 0).toLocaleString()} TK
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black ${(project.totalIncome - project.expenses) >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                      {(project.totalIncome - project.expenses).toLocaleString()} TK
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-md transition-all">
                        <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-md transition-all">
                        <svg xmlns="http://w3.org" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        
      </div>
    </div>
  );
};

// --- Small Helper Component ---
const CompactCard = ({ title, value, color, highlight }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200'}`}>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{title}</p>
    <h3 className={`text-base font-black mt-0.5 ${color}`}>৳{value?.toLocaleString() || 0}</h3>
  </div>
);

export default ProjectDetails;
