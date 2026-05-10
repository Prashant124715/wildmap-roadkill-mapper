import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, MapPin, Calendar, Camera, Cpu, Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analyzeImage } from '../../lib/aiValidation';

const ReportDetailsModal = ({ report, isOpen, onClose, onUpdateStatus, onUpdateReport }) => {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen || !report) return null;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(report.imageUrl, report.details);
      onUpdateReport({ ...report, ...result });
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 z-10">
            <X size={20} />
          </button>

          {/* Left Column: Image & AI */}
          <div className="w-full md:w-1/2 flex flex-col border-r border-white/10">
            <div className="h-64 md:h-1/2 relative bg-black flex items-center justify-center">
              {report.imageUrl ? (
                <img src={report.imageUrl} alt="Report evidence" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-gray-500">
                  <Camera size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs uppercase tracking-widest">{t('admin.noImage')}</p>
                </div>
              )}
            </div>

            {/* AI Analysis Section */}
            <div className="flex-1 p-6 bg-gradient-to-b from-black to-[#0a0a0a]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={14} className="text-brand-orange" />
                  {t('admin.imageValidation')}
                </h4>
                {report.aiScore === undefined && report.imageUrl && (
                  <button 
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="text-[10px] bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30 px-3 py-1 rounded border border-brand-orange/30 transition-colors uppercase font-bold tracking-widest flex items-center gap-2"
                  >
                    {isAnalyzing ? <><Loader2 size={12} className="animate-spin"/> {t('admin.analyzing')}</> : t('admin.runAnalysis')}
                  </button>
                )}
              </div>

              {report.aiScore !== undefined ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{t('admin.confidenceScore')}</span>
                      <span className={`font-bold font-mono ${report.aiScore < 40 ? 'text-red-400' : 'text-brand-lightGreen'}`}>{report.aiScore}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${report.aiScore}%` }} transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${report.aiScore >= 70 ? 'bg-brand-lightGreen' : report.aiScore >= 40 ? 'bg-yellow-400' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-lg">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">{t('admin.authenticity')}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        report.confidence === 'High' ? 'text-brand-lightGreen' : 
                        report.confidence === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {report.confidence === 'High' ? t('admin.highConfidence') : 
                         report.confidence === 'Medium' ? t('admin.mediumConfidence') : 
                         t('admin.lowConfidence')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">AI Score</span>
                      <span className="text-sm font-mono font-bold text-white">{report.aiScore}%</span>
                    </div>
                  </div>

                  {report.explanation && (
                    <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">{t('admin.explanation')}</span>
                      <p className="text-xs text-gray-300 italic">"{report.explanation}"</p>
                    </div>
                  )}

                  {report.isFlagged && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded flex gap-3 text-red-400 text-xs">
                      <AlertTriangle size={16} className="shrink-0" />
                      <p>{t('admin.manualReviewRequired')}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">{t('admin.detectedLabels')}:</span>
                    <div className="flex flex-wrap gap-2">
                      {report.labels?.map((label, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 text-gray-300 text-[10px] px-2 py-1 rounded uppercase tracking-wider">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs text-gray-600 text-center">
                    {report.imageUrl ? t('admin.runAnalysisDesc') : t('admin.aiRequiresImage')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                report.status === 'Verified' ? 'bg-brand-lightGreen/10 text-brand-lightGreen border border-brand-lightGreen/20' :
                report.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
              }`}>
                {report.status === 'Verified' && <ShieldCheck size={14} />}
                {report.status === 'Verified' ? t('admin.verified') : 
                 report.status === 'Rejected' ? t('admin.rejected') : 
                 t('admin.pending')}
              </span>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest">ID: {report.id}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('admin.reportedSpecies')}</h3>
                <p className="text-lg font-bold text-white">{report.species}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><MapPin size={12}/> {t('admin.location')}</h3>
                  <p className="text-sm text-gray-300 font-mono">{report.location}</p>
                </div>
                <div>
                  <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><Calendar size={12}/> {t('admin.dateTime')}</h3>
                  <p className="text-sm text-gray-300">{new Date(report.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('admin.userDetails')}</h3>
                <p className="text-sm text-gray-300">{t('admin.submittedBy')} <span className="font-medium text-white">{report.userId}</span></p>
              </div>

              <div>
                <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">{t('admin.description')}</h3>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 leading-relaxed">{report.details}</p>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">{t('admin.adminDecision')}</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => onUpdateStatus(report.id, 'Verified')}
                  disabled={report.status === 'Verified'}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-lightGreen/10 hover:bg-brand-lightGreen/20 text-brand-lightGreen border border-brand-lightGreen/30 py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={16} /> {t('admin.verifyReport')}
                </button>
                <button 
                  onClick={() => onUpdateStatus(report.id, 'Rejected')}
                  disabled={report.status === 'Rejected'}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} /> {t('admin.rejectReport')}
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportDetailsModal;
