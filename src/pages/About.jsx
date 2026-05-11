import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative bg-brand-dark">
      {/* Realistic Cinematic Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-40 transition-opacity duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1920')` }}></div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-brand-dark/90 via-brand-dark/60 to-brand-dark/95"></div>
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-cinematic font-bold text-white uppercase tracking-widest mb-6">
            About WILDMAP
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            WILDMAP is an AI-powered wildlife intelligence and conservation platform. Our mission is to mitigate human-wildlife conflict, prevent highway accidents, and accelerate biodiversity research using real-time data and community empowerment.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-3">AI Intelligence</h3>
            <p className="text-sm text-gray-400">Leveraging machine learning to predict wildlife movement and verify community reports in real-time.</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-3">Road Safety</h3>
            <p className="text-sm text-gray-400">Dynamic Driver Safety Mode alerting vehicles of nearby active wildlife crossing hotspots.</p>
          </div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-3">Conservation</h3>
            <p className="text-sm text-gray-400">Empowering NGOs and Forest Departments with rapid-response workflows and ethical observation rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
