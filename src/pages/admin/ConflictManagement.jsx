import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X, AlertTriangle, ShieldCheck, Cpu, Clock, Loader2, AlertOctagon, HeartHandshake, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ConflictDetailsModal from '../../components/admin/ConflictDetailsModal';

import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';

const ConflictManagement = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([
    { 
      id: 'conf001', 
      timestamp: new Date().toISOString(), 
      userId: 'Suresh Gaikwad', 
      species: 'Leopard', 
      location: '19.0760, 72.8777', 
      aiScore: 92, 
      status: 'Pending', 
      type: 'Conflict Support',
      emergencyLevel: 'CRITICAL',
      compensationStatus: 'Under Review',
      details: 'Leopard sighted near livestock pen at midnight. One calf injured.',
      imageUrl: 'https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&q=80&w=800',
      supportStatus: { ngoRequested: true, forestContacted: true }
    },
    { 
      id: 'conf002', 
      timestamp: new Date(Date.now() - 86400000).toISOString(), 
      userId: 'Mahesh Patil', 
      species: 'Elephant', 
      location: '15.3173, 75.7139', 
      aiScore: 78, 
      status: 'Verified', 
      type: 'Conflict Support',
      emergencyLevel: 'HIGH',
      compensationStatus: 'Verified',
      details: 'Elephants damaged crop fields near village edge. Need urgent fence support.',
      imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800',
      supportStatus: { ngoRequested: true, forestContacted: false, compensationProcessing: true }
    },
    { 
      id: 'conf003', 
      timestamp: new Date(Date.now() - 172800000).toISOString(), 
      userId: 'Vilas Rao', 
      species: 'Wild Boar', 
      location: '18.5204, 73.8567', 
      aiScore: 45, 
      status: 'Verified', 
      type: 'Conflict Support',
      emergencyLevel: 'MODERATE',
      compensationStatus: 'Released',
      details: 'Wild boar group entering vegetable patches frequently.',
      imageUrl: 'https://images.unsplash.com/photo-1590424768472-36192277341e?auto=format&fit=crop&q=80&w=800',
      supportStatus: { ngoRequested: false, forestContacted: false, fieldTeamAssigned: true }
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    // Filter specifically for Conflict Support reports
    const q = query(
      collection(db, 'reports'), 
      where('type', '==', 'Conflict Support'),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReports = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp
      }));
      
      // Merge real reports with dummy data, prioritizing real reports by ID
      setReports((prev) => {
        const merged = [...fetchedReports];
        prev.forEach(p => {
          if (!merged.some(m => m.id === p.id)) {
            merged.push(p);
          }
        });
        return merged;
      });
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching conflict reports:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, { status: newStatus });
      setSelectedReport(null);
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Failed to update report status.");
    }
  };

  const getEmergencyStyles = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MODERATE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-brand-lightGreen/20 text-brand-lightGreen border-brand-lightGreen/40';
    }
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-3">
            <AlertOctagon className="text-red-500" size={32} />
            Conflict Management
          </h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Emergency Response & Compensation Queue</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 glass-panel border-white/5 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live Monitoring Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        <div className="overflow-x-auto h-full custom-scrollbar">
          <div className="min-w-[1000px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Date & Time</div>
              <div className="col-span-2">Farmer / Location</div>
              <div className="col-span-2">Animal / Conflict</div>
              <div className="col-span-2 text-center">Urgency</div>
              <div className="col-span-2 text-center">Compensation</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {isLoading ? (
                  <div className="p-32 text-center">
                    <Loader2 size={40} className="animate-spin text-brand-orange mx-auto mb-4" />
                    <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Syncing Conflict Database...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="p-32 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="text-gray-600" size={32} />
                    </div>
                    <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No Conflict Reports Found</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <motion.div 
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-white/[0.03] transition-all group border-l-4 border-l-transparent hover:border-l-brand-orange"
                    >
                      <div className="col-span-1 font-mono text-[10px] text-gray-500">#{report.id.slice(-4)}</div>
                      
                      <div className="col-span-2">
                        <p className="text-xs text-white font-bold">{new Date(report.timestamp).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase">{new Date(report.timestamp).toLocaleTimeString()}</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-white font-bold truncate">{report.userId}</p>
                        <p className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">{report.location}</p>
                      </div>

                      <div className="col-span-2">
                        <span className="px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px] text-brand-orange font-black uppercase tracking-widest">
                          {report.species}
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getEmergencyStyles(report.emergencyLevel)}`}>
                          {report.emergencyLevel || 'PENDING AI'}
                        </span>
                      </div>

                      <div className="col-span-2 flex justify-center">
                         <div className="flex flex-col items-center gap-1">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${
                             report.compensationStatus === 'Released' ? 'text-brand-lightGreen' : 
                             report.compensationStatus === 'Verified' ? 'text-blue-400' : 'text-gray-500'
                           }`}>
                             {report.compensationStatus || 'Submitted'}
                           </span>
                           <div className="flex gap-1">
                             {[1, 2, 3, 4].map((step) => (
                               <div key={step} className={`w-3 h-1 rounded-full ${
                                 (report.compensationStatus === 'Released' && step <= 4) ||
                                 (report.compensationStatus === 'Verified' && step <= 3) ||
                                 (report.compensationStatus === 'Under Review' && step <= 2) ||
                                 (step <= 1) ? 'bg-brand-orange' : 'bg-white/10'
                               }`} />
                             ))}
                           </div>
                         </div>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-brand-orange hover:border-brand-orange transition-all group-hover:scale-110 shadow-lg"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <ConflictDetailsModal 
        report={selectedReport} 
        isOpen={!!selectedReport} 
        onClose={() => setSelectedReport(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateReport={async (updatedReport) => {
          try {
            const reportRef = doc(db, 'reports', updatedReport.id);
            const { id, ...data } = updatedReport;
            await updateDoc(reportRef, data);
            
            setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
            setSelectedReport(updatedReport);
          } catch (error) {
            console.error("Error updating report:", error);
            alert("Failed to save changes.");
          }
        }}
      />
    </div>
  );
};

export default ConflictManagement;
