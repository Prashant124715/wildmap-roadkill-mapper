import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Map, Flame, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Map, label: 'Map View', path: '/admin/map' },
    { icon: Flame, label: 'Hotspots', path: '/admin/hotspots' },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex text-white font-sans bg-grid">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col fixed h-full z-50">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 mb-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-brand-orange flex items-center justify-center text-white">
              <ShieldAlert size={16} />
            </div>
            <div>
              <h1 className="text-sm font-hero font-bold tracking-widest leading-none">WILDMAP</h1>
              <span className="text-[9px] text-gray-400 tracking-widest uppercase">Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="absolute inset-0 bg-brand-orange/10 border border-brand-orange/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={18} className={`relative z-10 ${isActive ? 'text-brand-orange' : ''}`} />
                <span className="text-xs font-bold tracking-widest uppercase relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <div className="bg-black/50 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold">{user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase">Administrator</p>
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
      <main className="flex-1 ml-64 p-8 relative">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
