import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Menu, X, Languages, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
  };

  const links = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.hotspots'), path: '/analysis' },
    { name: t('navbar.map'), path: '/map' },
    { name: t('navbar.biodiversity'), path: '/biodiversity' },
    { name: t('navbar.gallery'), path: '/gallery' },
    { name: t('navbar.report'), path: '/contact' },
    { name: t('navbar.resources'), path: '/resources' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const isHome = location.pathname === '/';

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled || !isHome ? 'rgba(5,10,6,0.92)' : 'rgba(5,10,6,0)',
        backdropFilter: scrolled || !isHome ? 'blur(20px)' : 'blur(0px)',
        borderBottomColor: scrolled || !isHome ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 z-50 w-full border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <img 
              src={logo} 
              alt="WILDMAP Logo" 
              className="h-8 sm:h-10 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="block">
              <h1 className="text-lg sm:text-xl font-cinematic font-bold tracking-[0.25em] text-white leading-none">WILDMAP</h1>
              <span className="text-[8px] sm:text-[10px] text-gray-400 tracking-[0.2em] uppercase font-light">{t('navbar.conservationIntelligence')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-5 items-center">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative px-1 py-2 text-[11px] font-medium tracking-[0.15em] transition-colors duration-300"
                >
                  <span className={clsx(
                    "relative z-10",
                    isActive ? "text-brand-orange" : "text-gray-300 hover:text-white"
                  )}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-orange"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <div className="pl-4 ml-4 border-l border-white/10 flex items-center gap-4">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors rounded-full px-4 py-2 border border-white/10 cursor-pointer">
                    <User size={14} className="text-brand-orange" />
                    <span className="text-xs text-white font-bold uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#111]/95 backdrop-blur border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                    <Link 
                      to="/my-reports" 
                      className="block px-4 py-3 text-xs text-gray-300 hover:text-white hover:bg-brand-orange/10 transition-colors"
                    >
                      {t('navbar.myReports')}
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/10"
                    >
                      {t('navbar.signOut')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
                >
                  {t('navbar.signIn')}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-dark/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">

              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "block px-4 py-3 text-sm font-bold tracking-[0.2em] transition-colors rounded-lg",
                    location.pathname === link.path ? "bg-brand-orange/10 text-brand-orange" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <User size={18} className="text-brand-orange" />
                      <span className="text-sm font-bold text-white uppercase tracking-widest">{user.name}</span>
                    </div>
                    <Link 
                      to="/my-reports" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-400 hover:text-white"
                    >
                      {t('navbar.myReports')}
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 flex items-center gap-2"
                    >
                      <LogOut size={16} /> {t('navbar.signOut')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                    className="w-full bg-brand-orange text-white text-sm font-bold uppercase tracking-widest py-4 rounded-lg"
                  >
                    {t('navbar.signIn')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
