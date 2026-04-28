import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import ReportDetailsModal from '../../components/admin/ReportDetailsModal';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const loadReports = () => {
    const saved = JSON.parse(localStorage.getItem('wildmap_reports') || '[]');
    // Sort newest first
    saved.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setReports(saved);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = reports.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setReports(updated);
    localStorage.setItem('wildmap_reports', JSON.stringify(updated));
    setSelectedReport(null); // close modal if open
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1">Report Management</h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase">AI-Assisted Verification Queue</p>
        </div>
      </div>

      <div className="flex-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col backdrop-blur-sm">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-2">Date</div>
          <div className="col-span-2">User / ID</div>
          <div className="col-span-2">Species</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">AI Score</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          <AnimatePresence>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No reports found in the system.</p>
              </div>
            ) : (
              reports.map((report) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-12 gap-4 p-4 items-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors"
                >
                  <div className="col-span-2 text-xs text-gray-300">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-xs text-white font-medium truncate">{report.userId === 'anonymous' ? 'Anonymous' : report.userId}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">#{report.id.slice(-6)}</p>
                  </div>
                  
                  <div className="col-span-2 text-xs text-gray-300 font-medium">
                    {report.species}
                  </div>

                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      report.status === 'Verified' ? 'bg-brand-lightGreen/10 text-brand-lightGreen border border-brand-lightGreen/20' :
                      report.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                    }`}>
                      {report.status === 'Verified' && <ShieldCheck size={12} />}
                      {report.status === 'Rejected' && <X size={12} />}
                      {report.status === 'Pending' && <Clock size={12} />}
                      {report.status}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    {report.aiScore !== undefined ? (
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              report.aiScore >= 70 ? 'bg-brand-lightGreen' : 
                              report.aiScore >= 40 ? 'bg-yellow-400' : 'bg-red-500'
                            }`}
                            style={{ width: `${report.aiScore}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold font-mono ${
                          report.aiScore < 40 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {report.aiScore}%
                        </span>
                        {report.aiScore < 40 && (
                          <AlertTriangle size={12} className="text-red-400" title="Low AI Confidence" />
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Cpu size={12}/> Not Analyzed
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                      title="View Details & Analyze"
                    >
                      <Eye size={16} />
                    </button>
                    {report.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(report.id, 'Verified')}
                          className="p-1.5 bg-brand-lightGreen/10 hover:bg-brand-lightGreen/20 text-brand-lightGreen rounded transition-colors"
                          title="Quick Verify"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(report.id, 'Rejected')}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                          title="Quick Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <ReportDetailsModal 
        report={selectedReport} 
        isOpen={!!selectedReport} 
        onClose={() => setSelectedReport(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdateReport={(updatedReport) => {
          const updated = reports.map(r => r.id === updatedReport.id ? updatedReport : r);
          setReports(updated);
          localStorage.setItem('wildmap_reports', JSON.stringify(updated));
          setSelectedReport(updatedReport);
        }}
      />
    </div>
  );
};

export default ReportManagement;
