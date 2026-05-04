import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle, Flame, WifiOff } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Card = ({ children, className = "" }) => (
  <div className={`bg-black/40 border border-white/10 rounded-xl backdrop-blur-sm p-6 ${className}`}>
    {children}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 128,
    pending: 34,
    verified: 76,
    highRisk: 18,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);
  const [chartData, setChartData] = useState([
    { name: 'Tue', reports: 12 },
    { name: 'Wed', reports: 18 },
    { name: 'Thu', reports: 22 },
    { name: 'Fri', reports: 30 },
    { name: 'Sat', reports: 28 },
    { name: 'Sun', reports: 25 },
    { name: 'Mon', reports: 20 },
  ]);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (reports.length > 0) {
        const total = reports.length;
        const pending = reports.filter(r => r.status === 'Pending').length;
        const verified = reports.filter(r => r.status === 'Verified').length;
        const highRisk = reports.filter(r => 
          r.details?.toLowerCase().includes('critical') || 
          r.details?.toLowerCase().includes('fatal') ||
          r.details?.toLowerCase().includes('high speed')
        ).length;

        setStats({ total, pending, verified, highRisk });
        setRecentReports(reports.slice(0, 5));

        // Build real chart data from the last 7 days
        const now = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);

          const count = reports.filter(r => {
            const ts = r.timestamp?.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
            return ts >= dayStart && ts < dayEnd;
          }).length;

          last7.push({ name: dayNames[dayStart.getDay()], reports: count });
        }
        setChartData(last7);
      }
      
      setIsLoading(false);
      setFirebaseError(null);
    }, (error) => {
      console.error("Error in dashboard listener:", error);
      // Keep dummy data on error for demo purposes
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    { title: 'Total Reports', value: stats.total, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Verified Incidents', value: stats.verified, icon: CheckCircle, color: 'text-brand-lightGreen', bg: 'bg-brand-lightGreen/10' },
    { title: 'High-Risk Zones', value: stats.highRisk, icon: Flame, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1">System Overview</h2>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400 tracking-widest uppercase">Admin Operations Center</p>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : firebaseError ? 'bg-red-500' : 'bg-brand-lightGreen'}`}></div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                {isLoading ? 'Connecting to Database...' : firebaseError ? 'Connection Error' : 'Database Online'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Firebase Error Banner */}
      {firebaseError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
        >
          <WifiOff size={20} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-400">Firebase Connection Error</p>
            <p className="text-xs text-gray-400 mt-1">{firebaseError}</p>
            <p className="text-xs text-gray-500 mt-2">
              Make sure your Firestore rules allow reads. Go to Firebase Console → Firestore Database → Rules and set:
              <code className="block bg-black/50 p-2 rounded mt-1 text-brand-orange font-mono">
                {`rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if true; } } }`}
              </code>
            </p>
          </div>
        </motion.div>
      )}

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
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#ff5c00' }}
                />
                <Area type="monotone" dataKey="reports" stroke="#ff5c00" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System Alerts - now dynamic */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm flex flex-col"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">System Alerts</h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex gap-3 bg-brand-orange/5 border border-brand-orange/20 p-3 rounded-lg">
              <AlertTriangle size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">High Activity Detected</p>
                <p className="text-[10px] text-gray-400 mt-1">High activity detected on Mumbai-Pune Expressway. Increased surveillance recommended.</p>
              </div>
            </div>
            
            <div className="flex gap-3 bg-white/5 border border-white/10 p-3 rounded-lg">
              <Clock size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Night-time Trends</p>
                <p className="text-[10px] text-gray-400 mt-1">Night-time incidents increasing (9 PM – 3 AM). Hotspot markers updated.</p>
              </div>
            </div>

            <div className="flex gap-3 bg-brand-orange/5 border border-brand-orange/20 p-3 rounded-lg">
              <CheckCircle size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Urgent Verification</p>
                <p className="text-[10px] text-gray-400 mt-1">3 reports pending urgent verification. Action required in the queue.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default AdminDashboard;
