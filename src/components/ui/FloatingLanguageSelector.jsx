import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, X, Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const FloatingLanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.language-selector-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] language-selector-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
            className="absolute bottom-16 right-0 mb-2 min-w-[180px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2"
          >
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] px-3 py-2 font-bold">Select Language</p>
              {languages.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                  <motion.button
                    key={lang.code}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    onClick={() => changeLanguage(lang.code)}
                    className={clsx(
                      "flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all duration-300 group",
                      isActive ? "bg-brand-orange/10 text-brand-orange" : "text-gray-300 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-brand-orange/20 flex items-center justify-center"
                      >
                        <Check size={12} strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255, 92, 0, 0.4)' }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border backdrop-blur-md relative group",
          isOpen 
            ? "bg-brand-orange border-brand-orange text-white rotate-90 shadow-[0_0_30px_rgba(255,92,0,0.6)]" 
            : "bg-black/40 border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-brand-orange/50"
        )}
      >
        <div className="absolute inset-0 rounded-full bg-brand-orange/20 animate-ping group-hover:block hidden" />
        {isOpen ? <X size={24} /> : <Globe size={24} className="group-hover:text-brand-orange transition-colors" />}
        
        {/* Active language indicator badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-orange rounded-full border-2 border-[#050a06] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
            {currentLang.code.toUpperCase()}
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingLanguageSelector;
