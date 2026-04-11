import React, { useState } from 'react'
import { 
  FaHome,FaSignOutAlt , FaUserCircle, FaUsers, FaBook, FaMoneyCheckAlt, FaChevronDown, FaChevronRight, 
  FaProjectDiagram, FaChartPie, FaCogs, FaHistory, FaTools, FaFileAlt, FaUserCog, FaBars, FaTimes 
} from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [openMenus, setOpenMenus] = useState({});
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = (name) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome /> },
        { name: "My Account", path: "/admin-dashboard/profile", icon: <FaUserCircle /> },
        {
            name: "Management",
            icon: <FaTools />,
            children: [
                { name: "Members", path: "/admin-dashboard/members", icon: <FaUsers /> },
                { name: "Ledger", path: "/admin-dashboard/ledger", icon: <FaBook /> },
                { name: "Subscription Fees", path: "/admin-dashboard/fees", icon: <FaMoneyCheckAlt /> },
                { name: "Projects", path: "/admin-dashboard/projects", icon: <FaProjectDiagram /> },
                { name: "Shares", path: "/admin-dashboard/shares", icon: <FaChartPie /> },
                { name: "Endpoints", path: "/admin-dashboard/endpoints", icon: <FaCogs /> },
                { name: "Profile Management", path: "/admin-dashboard/profiles", icon: <FaUserCog /> },
                { name: "Reports", path: "/admin-dashboard/reports", icon: <FaFileAlt /> },
            ],
        },
        {
            name: "System",
            icon: <FaHistory />,
            children: [{ name: "Activities", path: "/admin-dashboard/activities", icon: <FaHistory /> }],
        },
        {
            name: "Settings",
            icon: <FaCogs />,
            children: [{ name: "System Settings", path: "/admin-dashboard/system", icon: <FaTools /> }],
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* --- FIXED TOP HEADER --- */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-white/10 z-[60] flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
                        <span className="text-white font-bold text-lg italic px-1">NB</span>
                    </div>
                    <h1 className="text-white font-bold tracking-widest text-lg lg:text-xl uppercase">NextBarta</h1>
                </div>

                {/* Mobile Toggle Button */}
                <button 
                    onClick={() => setIsMobileOpen(!isMobileOpen)} 
                    className="lg:hidden text-white text-2xl p-2 hover:bg-white/10 rounded-md transition-colors"
                >
                    {isMobileOpen ? <FaTimes /> : <FaBars />}
                </button>
            </header>

            {/* --- SIDEBAR --- */}
            <aside className={`
                fixed top-16 left-0 z-50 w-72 h-[calc(100vh-64px)] bg-slate-900 border-r border-white/10 shadow-2xl overflow-y-auto
                transform transition-transform duration-300 ease-in-out custom-scrollbar
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <nav className="p-4 space-y-2 mt-4">
                    {menuItems.map((item, index) => {
                        const isChildActive = item.children?.some(c => isActive(c.path));
                        const parentActive = isActive(item.path) || isChildActive;

                        return (
                            <div key={index} className="space-y-1">
                                <div 
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 
                                        ${parentActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                    onClick={() => item.children ? toggleMenu(item.name) : setIsMobileOpen(false)}
                                >
                                    <Link to={item.path || "#"} className="flex items-center gap-3 w-full font-medium" onClick={(e) => item.children && e.preventDefault()}>
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="tracking-wide">{item.name}</span>
                                    </Link>
                                    {item.children && (
                                        <span className="text-[10px]">
                                            {openMenus[item.name] || isChildActive ? <FaChevronDown /> : <FaChevronRight />}
                                        </span>
                                    )}
                                </div>

                                {/* Sub-menus আইকনসহ */}
                                {item.children && (openMenus[item.name] || isChildActive) && (
                                    <div className="ml-6 pl-4 border-l border-slate-700 space-y-1 mt-1">
                                        {item.children.map((child, idx) => (
                                            <Link
                                                key={idx}
                                                to={child.path}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all
                                                    ${isActive(child.path) ? 'text-blue-400 font-bold bg-blue-400/10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                                            >
                                                {/* আইকন রেন্ডার করার জন্য নিচের লাইনটি যোগ করা হয়েছে */}
                                                <span className="text-xs">{child.icon}</span> 
                                                <span>{child.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
                {/* --- Logout Button --- */}
                <div className="mt-4 px-2">
                    <button 
                        onClick={() => {
                            // এখানে আপনার লগআউট লজিক দিন (যেমন: 
                            localStorage.clear()
                            console.log("Logged Out");
                            window.location.href = "/login";
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 font-medium group"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">
                            <FaSignOutAlt />
                        </span>
                        <span className="tracking-wide">Logout</span>
                    </button>
                </div>

                <div className="p-8 border-t border-white/5">
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Powered by <span className="text-blue-500">Rakib mia</span>
                     </p>
                </div>
            </aside>

            {/* Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileOpen(false)}></div>
            )}
        </>
    );
};

export default Sidebar;
