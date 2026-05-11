import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Compass, AlertTriangle, Leaf, Shield, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProjectInfoSection from '../components/sections/ProjectInfoSection';

const Home = () => {
  const { t } = useTranslation();
  // Floating firefly particles
  const particles = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 18 + 8,
      delay: Math.random() * 5,
    })), []
  );

  // Parallax scroll
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 150]);
  const textY = useTransform(scrollY, [0, 400], [0, -60]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="flex flex-col w-full">
      {/* ======== CINEMATIC HERO ======== */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">

        {/* Background Image with slow zoom */}
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          <div
            className="absolute inset-0 hero-zoom-bg"
            role="img"
            aria-label="Tiger in dramatic lighting"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=1920&h=1080&fit=crop&crop=entropy&q=80')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </motion.div>

        {/* Cinematic overlays — balanced for face visibility + text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-brand-dark/50 via-transparent to-brand-dark pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-brand-dark/50 via-transparent to-brand-dark/40 pointer-events-none" />
        <div className="absolute inset-0 z-[3] hero-vignette pointer-events-none" />

        {/* Floating firefly particles */}
        <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: p.id % 3 === 0
                  ? 'radial-gradient(circle, rgba(212,175,55,0.8), transparent)'
                  : 'radial-gradient(circle, rgba(59,139,84,0.6), transparent)',
                boxShadow: p.id % 3 === 0
                  ? '0 0 6px rgba(212,175,55,0.4)'
                  : '0 0 4px rgba(59,139,84,0.3)',
              }}
              animate={{
                y: [0, -(30 + Math.random() * 60), 0],
                x: [0, (Math.random() - 0.5) * 40, 0],
                opacity: [0, 0.9, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
            />
          ))}
        </div>

        {/* Bottom gradient for seamless blend */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent z-[5] pointer-events-none" />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 w-full max-w-5xl mx-auto pt-16 sm:pt-0"
          style={{ y: textY, opacity }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-4 sm:mb-8 md:mb-10"
          >
            <div className="inline-flex items-center space-x-2 sm:space-x-3 border border-white/15 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-white/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[8px] sm:text-[11px] text-gray-300 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold">{t('hero.badge')}</span>
            </div>
          </motion.div>

          {/* Title - Using clamp for perfect responsive scaling */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="font-cinematic font-bold tracking-[0.05em] sm:tracking-[0.1em] leading-[1] sm:leading-[0.9] mb-6 sm:mb-8"
          >
            <span className="block text-[clamp(2.2rem,10vw,8rem)] text-white text-glow-gold drop-shadow-2xl">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
          >
            <div className="h-px w-8 sm:w-24 bg-gradient-to-r from-transparent to-brand-orange/50" />
            <Leaf size={12} className="text-brand-orange/70 sm:w-[14px] sm:h-[14px]" />
            <div className="h-px w-8 sm:w-24 bg-gradient-to-l from-transparent to-brand-orange/50" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="font-serif-elegant text-gray-300 text-xs sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed italic px-2 sm:px-0"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-6 px-4 sm:px-0"
          >
            <Link to="/analysis" className="w-full xs:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-full inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-brand-orange text-white font-bold uppercase tracking-[0.2em] text-[9px] sm:text-xs rounded overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(255,92,0,0.25)]"
              >
                <Compass size={16} className="sm:w-[18px] sm:h-[18px]" />
                {t('hero.exploreHotspots')}
              </motion.button>
            </Link>
            <Link to="/reports/incident" className="w-full xs:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-[9px] sm:text-xs rounded transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              >
                <AlertTriangle size={16} className="sm:w-[18px] sm:h-[18px]" />
                {t('hero.reportIncident')}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom stats strip - Improved for mobile stacking */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-10 px-4"
        >
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-16 items-center">
            <StatItem value="40+" label={t('hero.incidentsMapped')} />
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <StatItem value="18" label={t('hero.speciesTracked')} />
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <StatItem value="12" label={t('hero.activeHotspots')} />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-brand-orange/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ======== MISSION STRIP ======== */}
      <section className="relative py-20 bg-brand-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <span className="text-[10px] text-brand-orange uppercase tracking-[0.3em] font-bold">{t('mission.badge')}</span>
            <h2 className="font-cinematic text-3xl sm:text-4xl text-white mt-3 tracking-wide">{t('mission.title')}</h2>
            <div className="flex justify-center mt-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: t('mission.mapHotspots.title'), desc: t('mission.mapHotspots.desc') },
              { icon: Shield, title: t('mission.drivePolicy.title'), desc: t('mission.drivePolicy.desc') },
              { icon: Leaf, title: t('mission.saveLives.title'), desc: t('mission.saveLives.desc') },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-panel rounded-xl p-6 text-center hover:border-brand-orange/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-orange/10 flex items-center justify-center mb-4 group-hover:bg-brand-orange/20 transition-colors">
                  <item.icon size={22} className="text-brand-orange" />
                </div>
                <h3 className="font-cinematic text-sm text-white tracking-widest uppercase mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project & Team Info Section (preserved) */}
      <ProjectInfoSection />
    </div>
  );
};

const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="font-cinematic text-2xl sm:text-3xl font-bold text-white">{value}</div>
    <div className="text-[9px] sm:text-[10px] text-gray-500 tracking-[0.2em] uppercase mt-1">{label}</div>
  </div>
);

export default Home;
