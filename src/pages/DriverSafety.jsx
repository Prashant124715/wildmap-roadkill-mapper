import React, { useState, useEffect, useRef } from 'react';
import { getDistance } from 'geolib';
import { Shield, AlertTriangle, Navigation, Activity, Zap, Play, Square, Sun, Moon, Clock, BarChart2, AlertCircle, TrendingUp, MapPin, Calendar, Info, ChevronDown, ChevronUp, Wind, Eye, Car, Map, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Hotspot Data
const HOTSPOTS = [
  {
    id: 1,
    name: "Tiger Corridor NH-7",
    lat: 19.0, // fallback
    lng: 79.0, // fallback
    radius: 1000, // meters
    species: "Bengal Tiger",
    riskLevel: "Extreme",
    recommendedSpeed: "40 km/h",
    incidents: 142
  },
  {
    id: 2,
    name: "Leopard Crossing Zone",
    lat: 19.1,
    lng: 79.1,
    radius: 800,
    species: "Indian Leopard",
    riskLevel: "High",
    recommendedSpeed: "30 km/h",
    incidents: 89
  },
  {
    id: 3,
    name: "Deer Activity Region",
    lat: 19.2,
    lng: 79.2,
    radius: 500,
    species: "Spotted Deer",
    riskLevel: "Medium",
    recommendedSpeed: "50 km/h",
    incidents: 215
  }
];

// Seasonal Data
const SEASONAL_DATA = [
  { species: "Leopard", peak: "Jan - Mar", risk: "HIGH", color: "text-orange-400", bg: "bg-orange-500/10" },
  { species: "Elephant", peak: "Jul - Sep (Monsoon)", risk: "VERY HIGH", color: "text-red-400", bg: "bg-red-500/10" },
  { species: "Deer", peak: "Oct - Dec", risk: "MODERATE", color: "text-yellow-400", bg: "bg-yellow-500/10" }
];

const DriverSafety = () => {
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  // Time Heatmap States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNightMode, setIsNightMode] = useState(false);
  const [manualTimeToggle, setManualTimeToggle] = useState(false);

  // Safety Guidelines State
  const [expandedGuideline, setExpandedGuideline] = useState(null);

  const watchIdRef = useRef(null);
  const demoIntervalRef = useRef(null);
  const audioContext = useRef(null);

  // Time detection logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!manualTimeToggle) {
      const hour = currentTime.getHours();
      setIsNightMode(hour >= 18 || hour < 6); // 6 PM to 6 AM
    }
  }, [currentTime, manualTimeToggle]);

  const toggleDayNight = () => {
    setManualTimeToggle(true);
    setIsNightMode(!isNightMode);
  };

  const playAlertSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, audioContext.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioContext.current.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.current.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    osc.start();
    osc.stop(audioContext.current.currentTime + 0.5);
  };

  const triggerAlert = (hotspot) => {
    setActiveHotspot(hotspot);
    playAlertSound();
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 500]);
    }
  };

  const checkHotspots = (currentLat, currentLng) => {
    let inDangerZone = false;
    for (const hotspot of HOTSPOTS) {
      const distance = getDistance(
        { latitude: currentLat, longitude: currentLng },
        { latitude: hotspot.lat, longitude: hotspot.lng }
      );
      // Dynamic risk radius check based on night mode
      const dynamicRadius = isNightMode ? hotspot.radius * 1.5 : hotspot.radius;
      if (distance <= dynamicRadius) {
        if (!activeHotspot || activeHotspot.id !== hotspot.id) {
          triggerAlert(hotspot);
        }
        inDangerZone = true;
        break;
      }
    }
    if (!inDangerZone && activeHotspot) {
      setActiveHotspot(null);
    }
  };

  const startMonitoring = () => {
    setIsStarting(true);
    if (!navigator.geolocation) {
      startDemoMode();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsStarting(false);
        setIsActive(true);
        setIsDemoMode(false);
        
        // Mock adjustments for demo testing
        HOTSPOTS[0].lat = pos.coords.latitude + 0.001;
        HOTSPOTS[0].lng = pos.coords.longitude + 0.001;
        HOTSPOTS[1].lat = pos.coords.latitude - 0.002;
        HOTSPOTS[1].lng = pos.coords.longitude - 0.002;
        HOTSPOTS[2].lat = pos.coords.latitude + 0.003;
        HOTSPOTS[2].lng = pos.coords.longitude - 0.001;

        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            checkHotspots(latitude, longitude);
          },
          (error) => {
            console.error("GPS error:", error);
            startDemoMode();
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      },
      (error) => {
        console.error("Initial GPS error:", error);
        startDemoMode();
      },
      { enableHighAccuracy: false, timeout: 2000, maximumAge: 10000 }
    );
  };

  const startDemoMode = () => {
    setIsStarting(false);
    setIsActive(true);
    setIsDemoMode(true);
    
    let lat = 19.0;
    let lng = 79.0;
    HOTSPOTS[0].lat = 19.002;
    HOTSPOTS[0].lng = 79.002;
    HOTSPOTS[1].lat = 19.010;
    HOTSPOTS[1].lng = 79.010;
    
    demoIntervalRef.current = setInterval(() => {
      lat += 0.0002;
      lng += 0.0002;
      setLocation({ latitude: lat, longitude: lng });
      checkHotspots(lat, lng);
    }, 2000);
  };

  const stopMonitoring = () => {
    setIsActive(false);
    setActiveHotspot(null);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
  };

  const scrollToHotspots = () => {
    document.getElementById('nearby-hotspots').scrollIntoView({ behavior: 'smooth' });
  };

  const particles = useRef([...Array(25)].map(() => ({
    width: Math.random() * 4 + 2 + 'px',
    height: Math.random() * 4 + 2 + 'px',
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 5,
    xOffset: Math.random() * 50 - 25
  }))).current;

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  // Visual Theme Config
  const bgImage = isNightMode 
    ? 'url("https://images.unsplash.com/photo-1513689404285-d72b8ceec5bd?q=80&w=2070&auto=format&fit=crop")'
    : 'url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop")';

  const overlayClass = isNightMode 
    ? "from-[#050a06]/95 via-[#050a06]/80 to-[#050a06]" 
    : "from-[#1a2e1c]/80 via-[#2d4a2d]/50 to-[#1a2e1c]/90";
    
  const accentColor = isNightMode ? "text-brand-orange" : "text-yellow-400";
  const particleColor = isNightMode ? "bg-red-500/40" : "bg-yellow-300/40";
  const glowShadow = isNightMode ? "shadow-[0_0_30px_rgba(255,107,0,0.4)]" : "shadow-[0_0_30px_rgba(250,204,21,0.4)]";
  const buttonBg = isNightMode ? "bg-red-600 hover:shadow-[0_0_50px_rgba(220,38,38,0.5)]" : "bg-yellow-600 hover:shadow-[0_0_50px_rgba(202,138,4,0.5)]";

  return (
    <div className={`min-h-screen pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-1000 ${isNightMode ? 'bg-brand-dark' : 'bg-[#1a2e1c]'}`}>
      
      {/* -------------------- BACKGROUND -------------------- */}
      <AnimatePresence>
        <motion.div 
          key={isNightMode ? 'night' : 'day'}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: bgImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
      </AnimatePresence>
      
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass} z-0 transition-colors duration-1000`} />
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isNightMode ? 'from-brand-orange/5' : 'from-yellow-400/5'} via-transparent to-transparent z-0 transition-colors duration-1000`} />

      {/* Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[1px] transition-colors duration-1000 ${particleColor}`}
            style={{ width: p.width, height: p.height, left: p.left, top: p.top }}
            animate={{
              y: [0, -150],
              x: [0, p.xOffset],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto space-y-16 pb-20 relative z-10">
        
        {/* Toggle Switch */}
        <div className="flex justify-end sticky top-20 md:top-24 z-50">
          <button 
            onClick={toggleDayNight}
            className="flex items-center gap-1 sm:gap-2 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-full p-1 shadow-2xl transition-all"
          >
            <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${!isNightMode ? 'bg-yellow-400 text-gray-900 shadow-md' : 'text-gray-400'}`}>
              <Sun size={12} /> Day
            </div>
            <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${isNightMode ? 'bg-brand-orange text-white shadow-md' : 'text-gray-400'}`}>
              <Moon size={12} /> Night
            </div>
          </button>
        </div>

        {/* ================================================== */}
        {/* 1️⃣ HERO SAFETY BANNER                               */}
        {/* ================================================== */}
        <div className="text-center space-y-6 sm:space-y-8 pt-2 sm:pt-4">
          <div className="relative inline-block">
            <motion.div
              animate={{ scale: [1, 1.8, 2.5], opacity: [0.6, 0.2, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              className={`absolute inset-0 rounded-full blur-xl transition-colors duration-1000 ${isNightMode ? 'bg-brand-orange' : 'bg-yellow-400'}`}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`relative inline-flex items-center justify-center p-4 sm:p-6 bg-[#0a0f0c]/90 backdrop-blur-xl border rounded-full transition-colors duration-1000 shadow-2xl ${glowShadow} ${isNightMode ? 'border-brand-orange/40' : 'border-yellow-400/40'}`}
            >
              <Shield size={40} className={`${accentColor} sm:w-16 sm:h-16 transition-colors duration-1000`} />
            </motion.div>
          </div>
          
          <div>
            <h1 className="text-[clamp(2rem,10vw,4.5rem)] font-cinematic font-bold tracking-widest text-white leading-tight">
              DRIVER <span className={`${accentColor} transition-colors duration-1000`}>SAFETY</span>
            </h1>
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-lg md:text-xl leading-relaxed font-medium bg-black/50 backdrop-blur-xl py-4 sm:py-6 px-6 sm:px-10 rounded-3xl border border-white/10 shadow-2xl">
            AI-powered wildlife collision prevention and smart highway risk intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            {!isActive ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startMonitoring}
                disabled={isStarting}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl text-white text-xs sm:text-sm ${buttonBg}`}
              >
                {isStarting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent border-white/50 rounded-full animate-spin" />
                    Locating...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Start Safety Monitoring
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopMonitoring}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gray-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-gray-500 transition-colors text-xs sm:text-sm"
              >
                <Square size={20} />
                Stop Monitoring
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToHotspots}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all shadow-xl backdrop-blur-md text-xs sm:text-sm"
            >
              <Map size={20} />
              View Hotspots
            </motion.button>
          </div>
        </div>

        {/* ================================================== */}
        {/* 2️⃣ LIVE DRIVER ALERT SYSTEM                         */}
        {/* ================================================== */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* LIVE ALERT CARD */}
              <div className="lg:col-span-2 h-full min-h-[350px]">
                <AnimatePresence mode="wait">
                  {activeHotspot ? (
                    <motion.div
                      key="danger"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`backdrop-blur-xl border-2 rounded-3xl p-8 shadow-[0_0_80px_rgba(220,38,38,0.3)] h-full relative overflow-hidden group transition-colors duration-500 ${isNightMode ? 'bg-gradient-to-br from-[#3a0a0a]/95 to-[#1a0505]/95 border-red-500/60' : 'bg-gradient-to-br from-[#4a1c1c]/95 to-[#2c1010]/95 border-orange-500/60'}`}
                    >
                      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isNightMode ? 'from-red-600/20' : 'from-orange-500/20'}`}></div>
                      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent to-transparent animate-pulse ${isNightMode ? 'via-red-500' : 'via-orange-500'}`}></div>
                      
                      <motion.div 
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute -top-12 -right-12 ${isNightMode ? 'text-red-500/10' : 'text-orange-500/20'}`}
                      >
                        <AlertTriangle size={220} />
                      </motion.div>
                      
                      <div className="relative z-10 space-y-6">
                        <div className={`flex items-center gap-4 mb-2 ${isNightMode ? 'text-red-400' : 'text-orange-400'}`}>
                          <AlertTriangle size={48} className="animate-pulse" />
                          <h2 className="text-3xl font-bold uppercase tracking-widest">High Risk Zone</h2>
                        </div>
                        
                        <div className="space-y-4">
                          <p className="text-xl sm:text-2xl text-gray-200 font-medium leading-relaxed">
                            Entering <span className={`font-bold border-b-2 pb-0.5 ${isNightMode ? 'text-red-400 border-red-400/30' : 'text-orange-400 border-orange-400/30'}`}>{activeHotspot.name}</span>
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-lg">Detected Species:</span>
                            <span className="text-white font-bold bg-white/10 px-4 py-1.5 rounded-full border border-white/20 text-lg shadow-lg">
                              {activeHotspot.species}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`border-2 rounded-2xl p-6 flex items-center justify-between backdrop-blur-sm transition-colors duration-300 mt-6 shadow-xl ${isNightMode ? 'bg-red-500/10 border-red-500/40 group-hover:bg-red-500/20' : 'bg-orange-500/10 border-orange-500/40 group-hover:bg-orange-500/20'}`}>
                          <div>
                            <p className={`text-xs uppercase tracking-widest mb-1 font-bold ${isNightMode ? 'text-red-300' : 'text-orange-300'}`}>Recommended Speed</p>
                            <p className="text-4xl font-bold text-white tracking-wider">{activeHotspot.recommendedSpeed}</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <Zap size={40} className={isNightMode ? "text-red-400" : "text-orange-400"} />
                            <span className="text-[10px] text-gray-300 uppercase mt-2 font-bold tracking-widest">AI Score: 98/100</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="safe"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-[#0a0f0c]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl h-full flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group hover:border-white/20 transition-colors"
                    >
                      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isNightMode ? 'from-brand-orange/10' : 'from-yellow-400/10'}`}></div>
                      
                      <div className={`w-28 h-28 bg-gradient-to-br to-transparent rounded-full flex items-center justify-center border-2 relative shadow-2xl ${isNightMode ? 'from-brand-orange/20 border-brand-orange/30' : 'from-yellow-400/20 border-yellow-400/30'}`}>
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className={`absolute inset-0 rounded-full blur-2xl ${isNightMode ? 'bg-brand-orange' : 'bg-yellow-400'}`}
                        />
                        <Navigation size={48} className={`relative z-10 ${accentColor}`} />
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-white uppercase tracking-widest mb-4">Route Clear</h3>
                        <p className="text-gray-400 text-lg max-w-sm mx-auto leading-relaxed">
                          No wildlife hotspots detected nearby. Maintain safe driving speeds.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3️⃣ LIVE STATUS PANEL (DAY VS NIGHT) */}
              <div className="bg-[#0a0f0c]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
                
                <div className="relative z-10 mb-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <Clock size={16} className={accentColor} /> Current Time
                    </h3>
                    <div className="text-3xl font-mono text-white tracking-wider">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {isDemoMode && (
                    <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1.5 rounded-md border border-yellow-500/30 uppercase tracking-widest shadow-lg">
                      Demo Mode
                    </span>
                  )}
                </div>
                
                <div className={`p-6 rounded-2xl border flex-grow flex flex-col justify-center transition-colors duration-500 shadow-xl relative overflow-hidden ${isNightMode ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50 ${isNightMode ? 'via-red-500' : 'via-yellow-500'}`} />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle size={24} className={isNightMode ? "text-red-400 animate-pulse" : "text-yellow-400"} />
                    <span className={`font-bold text-lg uppercase tracking-widest ${isNightMode ? 'text-red-400' : 'text-yellow-400'}`}>
                      {isNightMode ? 'High Night Risk' : 'Moderate Day Risk'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                    {isNightMode 
                      ? "Visibility is low. Nocturnal predators like tigers and leopards are highly active in this corridor." 
                      : "Daytime foraging animals active. Maintain moderate speed and watch for crossing deer."}
                  </p>
                  <div className="mt-auto bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Global Recommended Speed</div>
                    <div className="text-3xl font-bold text-white tracking-widest flex items-center gap-2">
                      <Car size={24} className={accentColor} /> {isNightMode ? '40 km/h' : '60 km/h'}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================== */}
        {/* 4️⃣ WILDLIFE RISK ANALYTICS                         */}
        {/* ================================================== */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <Activity size={32} className={accentColor} />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-white">Wildlife Risk Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Incident Analytics Chart */}
            <div className="bg-[#0a0f0c]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col hover:border-white/10 transition-colors">
              <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <BarChart2 size={18} className={accentColor} />
                Time Analytics
              </h3>
              <p className="text-sm text-gray-300 mb-8 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed font-medium">
                <strong className="text-white text-lg">78%</strong> of wildlife incidents on highway corridors occur during <strong className="text-red-400">Night hours</strong> (8 PM - 4 AM).
              </p>
              
              <div className="flex items-end justify-between gap-4 h-32 mt-auto border-b border-white/10 pb-3 px-2">
                {[
                  { label: 'Day', val: 22, night: false },
                  { label: 'Dusk', val: 45, night: true },
                  { label: 'Night', val: 95, night: true },
                  { label: 'Dawn', val: 65, night: true }
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 w-full group">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`w-full max-w-[30px] rounded-t-md relative ${bar.night && isNightMode ? 'bg-gradient-to-t from-red-900/50 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : (bar.night ? 'bg-orange-900/50' : 'bg-gradient-to-t from-yellow-900/50 to-yellow-400')}`}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{bar.val}%</span>
                    </motion.div>
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Animal Activity Insights */}
            <div className="bg-[#0a0f0c]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col hover:border-white/10 transition-colors">
              <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp size={18} className={accentColor} />
                Live Animal Activity
              </h3>
              <div className="space-y-6 flex-grow">
                {[
                  { animal: '🐘 Elephant', act: isNightMode ? 'HIGH' : 'LOW', color: isNightMode ? 'text-red-400' : 'text-green-400', p: isNightMode ? 80 : 20 },
                  { animal: '🦌 Deer', act: isNightMode ? 'VERY HIGH' : 'MODERATE', color: isNightMode ? 'text-red-500' : 'text-yellow-400', p: isNightMode ? 95 : 50 },
                  { animal: '🐆 Leopard', act: isNightMode ? 'HIGH' : 'LOW', color: isNightMode ? 'text-orange-400' : 'text-green-400', p: isNightMode ? 75 : 15 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-200 font-bold tracking-wide">{item.animal}</span>
                      <span className={`font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5 shadow-inner ${item.color}`}>{item.act}</span>
                    </div>
                    <div className="h-2.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.p}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.2 }}
                        className={`h-full rounded-full ${isNightMode ? 'bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-gradient-to-r from-yellow-500 to-green-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* 5️⃣ SEASONAL PATTERN PREDICTOR                      */}
        {/* ================================================== */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <Calendar size={32} className={accentColor} />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-white">Seasonal Pattern Predictor</h2>
          </div>

          <div className={`p-5 rounded-2xl border flex items-center gap-4 backdrop-blur-md shadow-xl ${isNightMode ? 'bg-red-500/20 border-red-500/50' : 'bg-yellow-500/20 border-yellow-500/50'}`}>
            <AlertOctagon size={32} className={`${isNightMode ? 'text-red-400' : 'text-yellow-400'} animate-pulse flex-shrink-0`} />
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-widest mb-1 ${isNightMode ? 'text-red-300' : 'text-yellow-300'}`}>Prediction Alert</h4>
              <p className="text-white font-medium text-sm md:text-base">March is approaching — <strong className={isNightMode ? 'text-red-400' : 'text-yellow-400'}>Leopard mating season risk</strong> on NH-52 is ELEVATED. Expect higher sudden crossings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEASONAL_DATA.map((season, idx) => (
              <div key={idx} className="bg-[#0a0f0c]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-colors group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${season.bg}`}>
                  <Wind size={24} className={season.color} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{season.species}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Peak Season</span>
                    <span className="text-white font-medium">{season.peak}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-400">Risk Level</span>
                    <span className={`font-bold tracking-widest ${season.color}`}>{season.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* 6️⃣ NEARBY HOTSPOT INTELLIGENCE                     */}
        {/* ================================================== */}
        <div id="nearby-hotspots" className="space-y-8 scroll-mt-32">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <MapPin size={32} className={accentColor} />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-white">Nearby Hotspot Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOTSPOTS.map((hotspot) => (
              <div key={hotspot.id} className="bg-[#0a0f0c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                {hotspot.riskLevel === 'Extreme' && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 blur-2xl rounded-full"></div>
                )}
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="text-lg font-bold text-white leading-tight w-2/3">{hotspot.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-lg ${
                    hotspot.riskLevel === 'Extreme' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    hotspot.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {hotspot.riskLevel}
                  </span>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                    <Eye size={18} className="text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Species Recorded</p>
                      <p className="text-sm font-bold text-gray-200">{hotspot.species}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <AlertOctagon size={16} className="text-red-400" /> Past Incidents
                    </div>
                    <span className="font-bold text-white bg-red-500/20 px-2 py-0.5 rounded text-sm border border-red-500/30">{hotspot.incidents}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-gray-400">Recommended</span>
                    <span className={`font-bold tracking-widest ${accentColor}`}>{hotspot.recommendedSpeed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* 7️⃣ EMERGENCY SAFETY GUIDELINES                     */}
        {/* ================================================== */}
        <div className="space-y-8 pb-10">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <Info size={32} className={accentColor} />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-white">Emergency Safety Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Reduce Speed in Forest Corridors", desc: "Always adhere to recommended speed limits (usually 30-40 km/h) in marked wildlife zones. Reaction time is severely reduced at night." },
              { title: "Use Low-Beam Lights", desc: "High beams can blind animals like deer, causing them to freeze in the middle of the road. Switch to low beams when wildlife is spotted." },
              { title: "Avoid Honking", desc: "Loud noises can startle large animals like elephants or rhinos, causing them to charge the vehicle. Remain quiet and wait." },
              { title: "Do Not Approach Wildlife", desc: "If you encounter an injured animal, do not step out of the vehicle. Note the GPS location and report it via the WILDMAP Contact portal." }
            ].map((guide, idx) => (
              <div 
                key={idx} 
                onClick={() => setExpandedGuideline(expandedGuideline === idx ? null : idx)}
                className="bg-[#0a0f0c]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/5 transition-colors shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-white">{guide.title}</h4>
                  {expandedGuideline === idx ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
                <AnimatePresence>
                  {expandedGuideline === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-gray-400 text-sm leading-relaxed">{guide.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DriverSafety;
