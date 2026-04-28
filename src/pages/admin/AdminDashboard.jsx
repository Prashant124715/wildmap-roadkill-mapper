import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    highRisk: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Load reports from localStorage
    const savedReports = JSON.parse(localStorage.getItem('wildmap_reports') || '[]');
    
    const total = savedReports.length;
    const pending = savedReports.filter(r => r.status === 'Pending').length;
    const verified = savedReports.filter(r => r.status === 'Verified').length;
    // Mock high risk logic (e.g., reports that mention specific keywords)
    const highRisk = savedReports.filter(r => r.details?.toLowerCase().includes('critical') || r.details?.toLowerCase().includes('fatal')).length;

    setStats({ total, pending, verified, highRisk });

    // Generate mock chart data based on last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => ({
      name: day,
      reports: Math.floor(Math.random() * 15) + (total > 0 ? 2 : 0)
    }));
    setChartData(data);

  }, []);

  const statCards = [
    { title: 'Total Reports', value: stats.total, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Verified Incidents', value: stats.verified, icon: CheckCircle, color: 'text-brand-lightGreen', bg: 'bg-brand-lightGreen/10' },
    { title: 'High-Risk Zones', value: stats.highRisk + 3, icon: Flame, color: 'text-brand-orange', bg: 'bg-brand-orange/10' }, // +3 for demo
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1">System Overview</h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Admin Operations Center</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Reporting Trends (7 Days)</h3>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5c00" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff5c00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#ff5c00' }}
                />
                <Area type="monotone" dataKey="reports" stroke="#ff5c00" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System Alerts */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm flex flex-col"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">System Alerts</h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex gap-3 bg-brand-orange/5 border border-brand-orange/20 p-3 rounded-lg">
              <AlertTriangle size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">AI Confidence Warning</p>
                <p className="text-[10px] text-gray-400 mt-1">3 new reports have an AI validation score below 40%. Manual review required immediately.</p>
              </div>
            </div>
            
            <div className="flex gap-3 bg-white/5 border border-white/10 p-3 rounded-lg">
              <FileText size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Data Sync Status</p>
                <p className="text-[10px] text-gray-400 mt-1">All verified reports have been successfully synchronized with the central Firestore database.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default AdminDashboard;
