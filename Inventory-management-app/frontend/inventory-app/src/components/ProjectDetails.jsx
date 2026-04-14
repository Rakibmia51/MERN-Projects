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
        const res = await axios.get(`http://localhost:3000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
        });
        setProject(res.data);
      } catch (err) { console.error(err); }
    };
    fetchProject();
  }, [id]);

  if (!project) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Loading...</div>;

  // --- Calculations ---
  const totalCashIn = (project.initialInvestment || 0) + (project.shareValue || 0);
  const availableToDeploy = totalCashIn - (project.expenses || 0);
  const roi = project.initialInvestment > 0 ? (((project.currentValue - project.initialInvestment) / project.initialInvestment) * 100).toFixed(1) : 0;

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
          <CompactCard title="Initial Investment" value={project.initialInvestment} color="text-slate-600" />
          <CompactCard title="Share Value" value={project.shareValue} color="text-indigo-600" />
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
