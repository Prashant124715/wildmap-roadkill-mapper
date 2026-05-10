import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, LogOut, Menu, X, ChevronDown, Search, 
  Map, Compass, Image as ImageIcon, Activity, 
  Database, LineChart, BookOpen, Eye, AlertTriangle, 
  ShieldCheck, PhoneCall, Car, ShieldAlert
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { name: t('navbar.home'), path: "/" },
    {
      name: t('navbar.safety'),
      dropdown: [
        { name: t('navbar.driverSafety'), path: "/driver-safety", desc: t('navbar.driverSafetyDesc'), icon: Car },
        { name: t('navbar.wildlifeRiskMap'), path: "/map", desc: t('navbar.wildlifeRiskMapDesc'), icon: Map }
      ]
    },
    {
      name: t('navbar.explore'),
      dropdown: [
        { name: t('navbar.biodiversityInsights'), path: "/biodiversity", desc: t('navbar.biodiversityInsightsDesc'), icon: Compass },
        { name: t('navbar.wildlifeGallery'), path: "/gallery", desc: t('navbar.wildlifeGalleryDesc'), icon: ImageIcon },
        { name: t('navbar.speciesActivity'), path: "/analysis", desc: t('navbar.speciesActivityDesc'), icon: Activity }
      ]
    },
    {
      name: t('navbar.resources'),
      dropdown: [
        { name: t('navbar.conservationResources'), path: "/resources", desc: t('navbar.conservationResourcesDesc'), icon: Database },
        { name: t('navbar.seasonalTrends'), path: "/seasonal-trends", desc: t('navbar.seasonalTrendsDesc'), icon: LineChart }
      ]
    },
    {
      name: t('navbar.reports'),
      dropdown: [
        { name: t('navbar.reportIncident'), path: "/reports/incident", desc: t('navbar.reportIncidentDesc'), icon: AlertTriangle },
        { name: t('navbar.conflictSupport'), path: "/reports/conflict-support", desc: t('navbar.conflictSupportDesc'), icon: ShieldCheck },
        { name: t('navbar.contactSupport'), path: "/reports/contact", desc: t('navbar.contactSupportDesc'), icon: PhoneCall }
      ]
    },
    { name: t('navbar.about'), path: "/about" }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const isHome = location.pathname === '/';

  // Desktop Dropdown Component
  const DesktopNavItem = ({ item }) => {
    const isActive = item.path ? location.pathname === item.path : item.dropdown?.some(d => location.pathname === d.path);
    const [isHovered, setIsHovered] = useState(false);
    
    if (!item.dropdown) {
      return (
        <Link 
          to={item.path} 
          className="relative px-2 py-2 text-[11px] font-bold tracking-[0.15em] transition-colors duration-300 uppercase"
        >
          <span className={clsx("relative z-10", isActive ? "text-brand-orange" : "text-gray-300 hover:text-white")}>
            {item.name}
          </span>
          {isActive && (
            <motion.div 
              layoutId="navbar-indicator" 
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-orange shadow-[0_0_10px_rgba(255,107,0,0.8)]" 
              initial={false} 
              transition={{ type: "spring", stiffness: 300, damping: 30 }} 
            />
          )}
        </Link>
      );
    }

    return (
      <div 
        className="relative group h-full flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button 
          className={clsx(
            "flex items-center gap-1.5 relative px-2 py-2 text-[11px] font-bold tracking-[0.15em] transition-colors duration-300 uppercase outline-none", 
            isActive || isHovered ? "text-brand-orange" : "text-gray-300 hover:text-white"
          )}
        >
          {item.name} 
          <motion.div animate={{ rotate: isHovered ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.div>
          {(isActive || isHovered) && (
            <motion.div 
              layoutId={isActive ? "navbar-indicator" : undefined}
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-orange shadow-[0_0_10px_rgba(255,107,0,0.8)]" 
              initial={false} 
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }} 
            />
          )}
        </button>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[340px] bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(255,107,0,0.05)] overflow-hidden z-50 p-2"
            >
              {item.dropdown.map((sub, idx) => (
                <Link 
                  key={idx} 
                  to={sub.path} 
                  onClick={() => setIsHovered(false)}
                  className="group/item relative flex items-start gap-4 p-3.5 rounded-xl transition-all duration-300 hover:bg-white/5 overflow-hidden"
                >
                  {/* Left accent line on hover */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-orange to-brand-lightGreen scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-center rounded-r-full" />
                  
                  {/* Icon container */}
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:bg-brand-orange/20 group-hover/item:border-brand-orange/40 group-hover/item:shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all duration-300">
                    <sub.icon size={18} className="text-gray-400 group-hover/item:text-brand-orange transition-colors duration-300" />
                  </div>
                  
                  {/* Text container */}
                  <div className="flex flex-col transform group-hover/item:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-bold text-gray-200 group-hover/item:text-white tracking-wide">{sub.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5 font-medium leading-relaxed">{sub.desc}</span>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
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
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            
            <Link to="/" className="flex items-center space-x-3 group shrink-0">
              <img 
                src={logo} 
                alt="WILDMAP Logo" 
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div className="block">
                <h1 className="text-xl sm:text-2xl font-cinematic font-bold tracking-[0.25em] text-white leading-none shadow-brand-orange">WILDMAP</h1>
                <span className="text-[9px] sm:text-[11px] text-brand-orange tracking-[0.2em] uppercase font-bold">{t('navbar.conservationIntelligence')}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6 items-center h-full">
              
              {navItems.map((item, idx) => (
                <DesktopNavItem key={idx} item={item} />
              ))}

              <div className="pl-6 ml-2 border-l border-white/10 flex items-center gap-4">


                {user ? (
                  <div className="relative group h-full flex items-center">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-brand-orange/10 to-brand-orange/5 hover:from-brand-orange/20 hover:to-brand-orange/10 transition-colors rounded-full px-5 py-2.5 border border-brand-orange/30 cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                      <User size={16} className="text-brand-orange" />
                      <span className="text-xs text-white font-bold uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                    </button>
                    
                    <div className="absolute right-0 top-full mt-4 w-56 bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                      <Link to="/my-reports" className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-300 hover:text-white hover:bg-brand-orange/10 transition-colors">
                        <Activity size={16} className="text-brand-orange" /> {t('navbar.myReports')}
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/10">
                        <LogOut size={16} /> {t('navbar.signOut')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] hover:scale-105"
                  >
                    {t('navbar.signIn')}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={toggleMobileMenu} className="p-2 text-gray-400 hover:text-white transition-colors">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0a0f0c]/98 backdrop-blur-3xl border-t border-white/10 overflow-y-auto max-h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="px-4 py-8 space-y-6">

                {navItems.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    {item.dropdown ? (
                      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-2">
                        <div className="text-xs font-bold text-brand-orange uppercase tracking-widest px-4 py-2 border-b border-white/5 mb-2">{item.name}</div>
                        <div className="space-y-1">
                          {item.dropdown.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                location.pathname === sub.path ? "bg-brand-orange/10 border border-brand-orange/20" : "hover:bg-white/5"
                              )}
                            >
                              <sub.icon size={18} className={location.pathname === sub.path ? "text-brand-orange" : "text-gray-400"} />
                              <div>
                                <div className={clsx("text-sm font-bold", location.pathname === sub.path ? "text-brand-orange" : "text-white")}>{sub.name}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{sub.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={clsx(
                          "block px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-xl",
                          location.pathname === item.path ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/20" : "text-white bg-white/5 border border-white/10"
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="pt-6 border-t border-white/10">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-4 py-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl">
                        <User size={20} className="text-brand-orange" />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">{user.name}</span>
                      </div>
                      <Link 
                        to="/my-reports" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 text-sm font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 rounded-xl"
                      >
                        <Activity size={18} /> {t('navbar.myReports')}
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl"
                      >
                        <LogOut size={18} /> {t('navbar.signOut')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                      className="w-full bg-brand-orange text-white text-sm font-bold uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.3)]"
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
    </>
  );
};

export default Navbar;
