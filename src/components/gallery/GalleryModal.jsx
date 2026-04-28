import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, ExternalLink, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const GalleryModal = ({ item, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-brand-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 backdrop-blur transition-all z-10"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black">
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            {item.is_placeholder && (
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-[10px] text-white/80 uppercase px-3 py-1.5 rounded tracking-widest border border-white/20">
                Sample / Representative Image
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <span className="bg-brand-orange text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold">
                {item.category}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar bg-gradient-to-b from-brand-dark to-black">
            
            <h2 className="text-2xl md:text-3xl font-hero font-bold text-white mb-2 leading-tight">
              {item.title}
            </h2>
            
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-brand-orange" />
                <span className="font-bold text-white">{item.animal}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-brand-lightGreen" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{item.date}</span>
              </div>
            </div>

            <div className="flex-grow">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-3">Incident Description</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {item.description}
              </p>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Image Source & Verification</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">{item.source}</span>
                  {item.source_url !== "#" && (
                    <a 
                      href={item.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 transition-colors"
                    >
                      Verify Source <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-auto">
              {item.coordinates && (
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => {
                    onClose();
                    navigate('/map');
                  }}
                >
                  <span className="flex items-center gap-2"><MapPin size={16}/> VIEW LOCATION ON MAP</span>
                  <ArrowRight size={16} className="opacity-50" />
                </Button>
              )}
              
              <Button 
                variant="primary" 
                className="w-full justify-between"
                onClick={() => {
                  onClose();
                  navigate('/contact');
                }}
              >
                <span className="flex items-center gap-2"><AlertTriangle size={16}/> REPORT SIMILAR INCIDENT</span>
                <ArrowRight size={16} className="opacity-50" />
              </Button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GalleryModal;
