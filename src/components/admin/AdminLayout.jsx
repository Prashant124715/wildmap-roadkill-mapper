import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart2, Map, LogOut, User, Menu, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Conflict Reports', path: '/admin/conflicts', icon: AlertTriangle },
    { name: 'Hotspots', path: '/admin/hotspots', icon: BarChart2 },
    { name: 'Global Map', path: '/admin/map', icon: Map },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden h-16 glass-panel border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="font-hero font-bold text-white tracking-widest text-sm uppercase">WILDMAP Admin</span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 glass-panel border-r border-white/10 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="mb-10 hidden lg:flex items-center gap-3">
            <img src={logo} alt="WILDMAP Logo" className="h-10 w-auto" />
            <div>
              <h2 className="font-hero font-bold text-white tracking-widest text-lg leading-none">WILDMAP</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Portal</p>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center border border-brand-orange/30">
                <User size={14} className="text-brand-orange" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-500 uppercase">System Root</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-[10px] uppercase tracking-widest font-bold py-2 rounded transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
