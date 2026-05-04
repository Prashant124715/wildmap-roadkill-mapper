import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProjectInfoSection from '../components/sections/ProjectInfoSection';

const Home = () => {
  // Simple particle generation
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
  }));

  // Tree generation for background
  const trees = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    height: `${Math.random() * 20 + 40}%`,
    delay: Math.random() * 2,
    zIndex: Math.floor(Math.random() * 10),
    opacity: Math.random() * 0.5 + 0.3,
  }));

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center">
        
        {/* Background Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bg-brand-lightGreen rounded-sm opacity-20"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Abstract Trees overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none flex items-end">
            {trees.map((tree) => (
              <motion.div
                key={tree.id}
                className="absolute bottom-0 border-solid"
                style={{
                  left: tree.left,
                  height: tree.height,
                  width: 0,
                  borderLeft: '40px solid transparent',
                  borderRight: '40px solid transparent',
                  borderBottom: `200px solid #1a4225`,
                  zIndex: tree.zIndex,
                  opacity: tree.opacity,
                  filter: 'blur(2px)'
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: tree.opacity }}
                transition={{ duration: 1.5, delay: tree.delay }}
              />
            ))}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-brand-dark to-transparent z-20" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center space-x-2 border border-brand-orange/30 px-3 py-1 rounded-full mb-6 sm:mb-8 bg-brand-orange/5">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-brand-lightGreen" />
                  <span className="text-[9px] sm:text-[10px] text-brand-orange uppercase tracking-[0.2em] ml-2">Live Incident Tracking – India</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-8xl font-hero font-black leading-[0.9] tracking-tight mb-6">
                  <span className="text-white block">WILDLIFE</span>
                  <span className="text-brand-orange block text-glow">ROADKILL</span>
                  <span className="text-brand-lightGreen block">MAPPER</span>
                </h1>

                <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed font-light">
                  Discover wildlife roadkill hotspots across India. We map, cluster, and rank danger zones to drive smarter conservation action — before more lives are lost.
                </p>

                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link to="/map" className="w-full sm:w-auto">
                    <Button variant="primary" icon={Play} className="w-full sm:w-auto px-10">
                      EXPLORE MAP
                    </Button>
                  </Link>
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button variant="outline" icon={ArrowRight} className="w-full sm:w-auto px-10">
                      LEARN MORE
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Content / Stats */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:justify-end items-center lg:items-end h-full mt-8 lg:mt-0 lg:absolute right-8 bottom-12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center lg:text-right space-y-6 sm:space-y-8"
              >
                <div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-hero font-black text-white"
                  >
                    40
                  </motion.div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-1">Incidents</div>
                </div>

                <div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-hero font-black text-white"
                  >
                    18
                  </motion.div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-1">Species</div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Project & Team Info Section */}
      <ProjectInfoSection />
    </div>
  );
};

export default Home;

