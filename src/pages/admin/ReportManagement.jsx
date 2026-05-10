import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X, AlertTriangle, ShieldCheck, Cpu, Clock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReportDetailsModal from '../../components/admin/ReportDetailsModal';

import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

const Card = ({ children, className = "" }) => (
  <div className={`bg-black/40 border border-white/10 rounded-xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const ReportManagement = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([
    { id: 'rep001', timestamp: '2026-04-21T10:00:00Z', userId: 'Rahul Sharma', species: 'Deer', location: 'Mumbai-Pune Expressway', aiScore: 82, status: 'Verified', imageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&q=80&w=800' },
    { id: 'rep002', timestamp: '2026-04-22T11:30:00Z', userId: 'Sneha Patil', species: 'Dog', location: 'NH48', aiScore: 65, status: 'Pending', imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800' },
    { id: 'rep003', timestamp: '2026-04-23T14:20:00Z', userId: 'Amit Verma', species: 'Cow', location: 'Nashik Highway', aiScore: 78, status: 'Verified', imageUrl: 'https://images.unsplash.com/photo-1545468246-28562d04f215?auto=format&fit=crop&q=80&w=800' },
    { id: 'rep004', timestamp: '2026-04-24T09:15:00Z', userId: 'Priya Nair', species: 'Monkey', location: 'NH160', aiScore: 55, status: 'Pending', imageUrl: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&q=80&w=800' },
    { id: 'rep005', timestamp: '2026-04-25T16:45:00Z', userId: 'Karan Mehta', species: 'Fox', location: 'Pune Bypass', aiScore: 38, status: 'Rejected', imageUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=800' },
    { id: 'rep006', timestamp: '2026-04-26T12:00:00Z', userId: 'Anjali Desai', species: 'Cat', location: 'NH66', aiScore: 72, status: 'Verified', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800' },
    { id: 'rep007', timestamp: '2026-04-27T08:30:00Z', userId: 'Rohan Kulkarni', species: 'Buffalo', location: 'Thane Highway', aiScore: 47, status: 'Pending', imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReports = querySnapshot.docs
        .map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp
        }))
        .filter(report => report.type === 'Incident' || !report.type);
      
      setReports(fetchedReports);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching reports:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, { status: newStatus });
      // State updates automatically via onSnapshot
      setSelectedReport(null);
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Failed to update report status in database.");
    }
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1">{t('admin.reports')}</h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase">{t('admin.verificationQueue')}</p>
        </div>
      </div>

      <div className="flex-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col backdrop-blur-sm">
        <div className="p-0 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto">
          <div className="min-w-[900px] lg:min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <div className="col-span-1">{t('admin.id')}</div>
              <div className="col-span-2">{t('admin.timestamp')}</div>
              <div className="col-span-2">{t('admin.user')}</div>
              <div className="col-span-2">{t('admin.species')}</div>
              <div className="col-span-3">{t('admin.aiAnalysis')}</div>
              <div className="col-span-2 text-right">{t('admin.actions')}</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/5 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {isLoading ? (
                  <div className="p-20 text-center">
                    <Loader2 size={32} className="animate-spin text-brand-orange mx-auto mb-4" />
                    <p className="text-gray-500 uppercase tracking-widest text-[10px]">{t('admin.syncing')}</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-gray-500 uppercase tracking-widest text-[10px]">{t('admin.noIncidents')}</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <motion.div 
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="col-span-1 font-mono text-[10px] text-gray-400">#{report.id.slice(-4)}</div>
                      
                      <div className="col-span-2">
                        <p className="text-xs text-white">{new Date(report.timestamp).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{new Date(report.timestamp).toLocaleTimeString()}</p>
                      </div>

                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange text-[10px] font-bold border border-brand-orange/20">
                          {report.userId?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs text-gray-300 truncate" title={report.userId}>{report.userId}</span>
                      </div>

                      <div className="col-span-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white font-bold uppercase tracking-widest">
                          {report.species}
                        </span>
                      </div>

                      <div className="col-span-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold uppercase tracking-tighter ${
                            report.aiScore >= 70 ? 'text-brand-lightGreen' : 
                            report.aiScore >= 40 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {report.confidence || (report.aiScore >= 70 ? t('admin.highConfidence') : report.aiScore >= 40 ? t('admin.mediumConfidence') : t('admin.lowConfidence'))}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">{report.aiScore}%</span>
                        </div>
                        <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${report.aiScore}%` }}
                            className={`h-full rounded-full transition-all duration-1000 ${
                              report.aiScore >= 70 ? 'bg-brand-lightGreen shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 
                              report.aiScore >= 40 ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 
                              'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="p-2 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all group-hover:scale-110"
                        >
                          <Eye size={14} />
                        </button>
                        {report.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(report.id, 'Verified')}
                              className="p-2 rounded bg-brand-lightGreen/10 border border-brand-lightGreen/20 text-brand-lightGreen hover:bg-brand-lightGreen/20 transition-all group-hover:scale-110"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(report.id, 'Rejected')}
                              className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all group-hover:scale-110"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <div className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-[0.2em] border ${
                            report.status === 'Verified' ? 'bg-brand-lightGreen/10 text-brand-lightGreen border-brand-lightGreen/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {report.status === 'Verified' ? t('admin.verified') : t('admin.rejected')}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      </div>

      <ReportDetailsModal 
        report={selectedReport} 
        isOpen={!!selectedReport} 
        onClose={() => setSelectedReport(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateReport={async (updatedReport) => {
          try {
            const reportRef = doc(db, 'reports', updatedReport.id);
            // Remove the id from the data being sent to Firestore
            const { id, ...data } = updatedReport;
            await updateDoc(reportRef, data);
            
            const updated = reports.map(r => r.id === updatedReport.id ? updatedReport : r);
            setReports(updated);
            setSelectedReport(updatedReport);
          } catch (error) {
            console.error("Error updating report:", error);
            alert("Failed to save changes to database.");
          }
        }}
      />
    </div>
  );
};

export default ReportManagement;
