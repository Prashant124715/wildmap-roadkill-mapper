import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GalleryCard = ({ item, onClick }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative group aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-brand-dark border border-white/5 shadow-lg"
      onClick={() => onClick(item)}
    >
      <img 
        src={item.image_url} 
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {item.is_placeholder && (
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-[9px] text-white/70 uppercase px-2 py-1 rounded tracking-widest border border-white/10">
          {t('common.sampleImage')}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block px-2 py-0.5 bg-brand-orange/20 text-brand-orange text-[9px] uppercase tracking-widest rounded mb-2 border border-brand-orange/30">
            {item.category}
          </span>
          
          <h3 className="text-lg font-hero font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
          
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
            <span className="font-bold text-white">{item.animal}</span>
          </div>

          <div className="flex items-start gap-1.5 text-[10px] text-gray-400">
            <MapPin size={12} className="shrink-0 mt-0.5 text-brand-lightGreen" />
            <span className="line-clamp-1">{item.location}</span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <Camera size={12} />
              <span>{item.source}</span>
            </div>
            <span className="text-[10px] text-brand-orange flex items-center gap-1 font-bold uppercase tracking-wider">
              {t('buttons.viewDetails')} <ExternalLink size={10} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCard;
