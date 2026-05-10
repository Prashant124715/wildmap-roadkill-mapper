import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, MapPin, Calendar, Camera, Cpu, Loader2, AlertTriangle, AlertOctagon, Info, HeartHandshake, PhoneCall, ExternalLink, User, FileText, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analyzeImage } from '../../lib/aiValidation';

const ConflictDetailsModal = ({ report, isOpen, onClose, onUpdateStatus, onUpdateReport }) => {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen || !report) return null;

  const severityColors = {
    'CRITICAL': 'text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    'HIGH': 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    'MODERATE': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    'LOW': 'text-brand-lightGreen bg-brand-lightGreen/10 border-brand-lightGreen/30'
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(report.imageUrl, report.details);
      
      // Enhance AI result for conflicts
      const enhancedResult = {
        ...result,
        emergencyLevel: result.aiScore > 85 ? 'CRITICAL' : result.aiScore > 70 ? 'HIGH' : 'MODERATE',
        suggestedAction: result.aiScore > 80 
          ? "Send forest response team immediately. Evacuate livestock from buffer zone."
          : "Monitor movement and inform local village head. NGO assistance recommended."
      };
      
      onUpdateReport({ ...report, ...enhancedResult });
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStatusToggle = (field) => {
    const currentStatus = report.supportStatus || {};
    onUpdateReport({
      ...report,
      supportStatus: {
        ...currentStatus,
        [field]: !currentStatus[field]
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
        >
          {/* Glowing Top Border for Emergency Level */}
          <div className={`absolute top-0 left-0 right-0 h-1 z-20 ${
            report.emergencyLevel === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' :
            report.emergencyLevel === 'HIGH' ? 'bg-orange-500' : 'bg-brand-orange'
          }`} />

          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2.5 z-30 transition-all">
            <X size={20} />
          </button>

          {/* Left Column: Media & AI Diagnostics */}
          <div className="w-full md:w-[45%] flex flex-col border-r border-white/10 bg-[#0d0d0d]">
            <div className="h-72 md:h-1/2 relative bg-black group overflow-hidden">
              {report.imageUrl ? (
                <img 
                  src={report.imageUrl} 
                  alt="Conflict Evidence" 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80'; }} 
                />
              ) : (
                <div className="text-center text-gray-600 flex flex-col items-center p-12">
                  <Camera size={48} className="mb-3 opacity-30" />
                  <p className="text-[10px] uppercase tracking-widest font-bold">No Visual Evidence Provided</p>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${severityColors[report.emergencyLevel] || severityColors.LOW}`}>
                  {report.emergencyLevel || 'LOW'} PRIORITY
                </span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0d0d0d] to-black">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[11px] font-black text-brand-orange uppercase tracking-[0.2em] flex items-center gap-2">
                  <Cpu size={16} />
                  AI Conflict Diagnostic
                </h4>
                {!report.aiScore && report.imageUrl && (
                  <button 
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="text-[10px] bg-brand-orange text-white px-4 py-1.5 rounded-full font-black tracking-widest hover:bg-brand-orange/80 transition-all flex items-center gap-2"
                  >
                    {isAnalyzing ? <Loader2 size={12} className="animate-spin"/> : <Cpu size={12} />}
                    RUN AI
                  </button>
                )}
              </div>

              {report.aiScore ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">AI Confidence</span>
                      <span className="text-xl font-mono font-black text-white">{report.aiScore}%</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Risk Factor</span>
                      <span className={`text-sm font-black uppercase ${report.aiScore > 70 ? 'text-red-500' : 'text-yellow-500'}`}>
                        {report.aiScore > 85 ? 'CRITICAL' : report.aiScore > 60 ? 'HIGH' : 'MODERATE'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-brand-orange/5 border border-brand-orange/20 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <AlertOctagon size={80} className="text-brand-orange" />
                    </div>
                    <span className="text-[10px] text-brand-orange uppercase tracking-widest font-black flex items-center gap-2 mb-2">
                      <ShieldCheck size={14} /> Recommended Action
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed italic font-medium">
                      "{report.suggestedAction || 'Awaiting comprehensive analysis...'}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Detected Risk Markers:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Predator Identified', 'Livestock Proximity', 'Village Encroachment', 'Nocturnal Movement'].map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold text-center px-8 leading-relaxed">
                    Awaiting evidence upload for predictive conflict analysis.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Case Management & Logistics */}
          <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-hero font-black text-white uppercase tracking-widest">{report.species} Conflict</h2>
                <p className="text-[10px] text-gray-500 font-mono">CASE_ID: {report.id.toUpperCase()}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                report.status === 'Verified' ? 'bg-brand-lightGreen/10 text-brand-lightGreen border-brand-lightGreen/30' :
                report.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                'bg-brand-orange/10 text-brand-orange border-brand-orange/30 animate-pulse'
              }`}>
                {report.status}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg"><MapPin size={16} className="text-brand-orange" /></div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Incident Zone</span>
                    <p className="text-sm text-white font-mono flex items-center gap-2">
                      {report.location}
                      <a href={`https://www.google.com/maps?q=${report.location}`} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:text-white transition-colors">
                        <ExternalLink size={12} />
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg"><Calendar size={16} className="text-brand-orange" /></div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Date & Time</span>
                    <p className="text-sm text-white">{new Date(report.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg"><User size={16} className="text-brand-orange" /></div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Reporter Detail</span>
                    <p className="text-sm text-white font-bold">{report.userId}</p>
                    <p className="text-[10px] text-gray-500">{report.userPhone || 'No direct phone link'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg"><Info size={16} className="text-brand-orange" /></div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-0.5">Compensation Status</span>
                    <select 
                      value={report.compensationStatus || 'Pending'}
                      onChange={(e) => onUpdateReport({ ...report, compensationStatus: e.target.value })}
                      className="bg-transparent text-xs text-white border-none outline-none focus:ring-0 font-black uppercase tracking-widest cursor-pointer"
                    >
                      <option className="bg-black text-white">Pending</option>
                      <option className="bg-black text-white">Under Review</option>
                      <option className="bg-black text-white">Verified</option>
                      <option className="bg-black text-white">Released</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[11px] text-brand-orange uppercase tracking-[0.2em] font-black mb-3">Field Investigation Details</h3>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <p className="text-sm text-gray-300 leading-relaxed font-medium italic">"{report.details}"</p>
              </div>
            </div>

            {/* Support Logistics Checklist */}
            <div className="mb-10 space-y-4">
              <h3 className="text-[11px] text-brand-orange uppercase tracking-[0.2em] font-black">Support Logistics Status</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ngoRequested', label: 'NGO Assistance', icon: HeartHandshake },
                  { id: 'forestContacted', label: 'Forest Dept Contacted', icon: PhoneCall },
                  { id: 'compensationProcessing', label: 'Compensation Logic', icon: FileText },
                  { id: 'fieldTeamAssigned', label: 'Field Team Assigned', icon: UserCheck },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleStatusToggle(item.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                      report.supportStatus?.[item.id] 
                        ? 'bg-brand-lightGreen/10 border-brand-lightGreen/30 text-brand-lightGreen shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                        : 'bg-white/5 border-white/10 text-gray-500 grayscale'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Controls */}
            <div className="mt-auto flex gap-4">
              <button 
                onClick={() => onUpdateStatus(report.id, 'Verified')}
                className="flex-1 py-4 bg-brand-lightGreen/10 hover:bg-brand-lightGreen/20 text-brand-lightGreen border border-brand-lightGreen/30 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95"
              >
                Approve Case
              </button>
              <button 
                onClick={() => onUpdateStatus(report.id, 'Rejected')}
                className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95"
              >
                Deny Claim
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConflictDetailsModal;
