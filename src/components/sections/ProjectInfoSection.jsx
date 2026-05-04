import { motion } from 'framer-motion';
import { User, Users, Database, Leaf } from 'lucide-react';

const ProjectInfoSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const members = [
    { name: "Prashant Ghuge", roll: "11" },
    { name: "Disha Chaurasia", roll: "01" },
    { name: "Vedika Kandalkar", roll: "16" },
    { name: "Raina Dsouza", roll: "8" }
  ];

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-lightGreen/20 to-transparent" />
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-brand-lightGreen/5 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="inline-block px-4 py-1 rounded-full border border-brand-lightGreen/30 bg-brand-lightGreen/5 mb-2">
              <span className="text-[10px] text-brand-lightGreen uppercase tracking-[0.3em] font-bold">Submission Details</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-hero font-black text-white tracking-tight uppercase">
              Project <span className="text-brand-orange text-glow">Information</span>
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-brand-orange to-brand-lightGreen mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Project Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-brand-green/30 border border-white/5 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] backdrop-blur-xl hover:border-brand-orange/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database size={80} className="text-brand-orange" />
              </div>
              
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500 border border-brand-orange/20">
                <Database className="text-brand-orange" size={24} sm:size={28} />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 tracking-tight uppercase">Project Details</h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Title</p>
                  <p className="text-white text-base sm:text-lg font-bold leading-tight">WILDMAP – Wildlife Roadkill Hotspot Mapper</p>
                </div>
                
                <div className="flex gap-8">
                  <div>
                    <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Division</p>
                    <p className="text-brand-orange font-black text-xl">D</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Batch</p>
                    <p className="text-brand-lightGreen font-black text-xl">A</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Team Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-brand-green/30 border border-white/5 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] backdrop-blur-xl hover:border-brand-lightGreen/30 transition-all duration-500 group relative overflow-hidden lg:scale-105 shadow-2xl shadow-black/50"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} className="text-brand-lightGreen" />
              </div>
              
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-lightGreen/10 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500 border border-brand-lightGreen/20">
                <Users className="text-brand-lightGreen" size={24} sm:size={28} />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 tracking-tight uppercase">Group Members</h3>
              
              <div className="space-y-2 sm:space-y-3">
                {members.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-brand-lightGreen/10 border border-transparent hover:border-brand-lightGreen/20 transition-all duration-300 group/item">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center border border-white/10 group-hover/item:border-brand-lightGreen/30">
                        <User size={14} className="text-gray-400 group-hover/item:text-brand-lightGreen" />
                      </div>
                      <span className="text-sm font-bold text-gray-200 group-hover/item:text-white">{member.name}</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black text-brand-orange px-2 py-1 bg-brand-orange/10 rounded-md">#{member.roll}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SDG Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-brand-green/30 border border-white/5 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] backdrop-blur-xl hover:border-brand-orange/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Leaf size={80} className="text-brand-orange" />
              </div>
              
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500 border border-brand-orange/20">
                <Leaf className="text-brand-orange" size={24} sm:size={28} />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 tracking-tight uppercase">Global Goals</h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] bg-gradient-to-br from-brand-orange/20 to-brand-green/40 border border-brand-orange/30 relative overflow-hidden group-hover:from-brand-orange/30 transition-all duration-500">
                  <div className="relative z-10">
                    <p className="text-brand-orange font-black text-xl sm:text-2xl mb-1">SDG 15</p>
                    <p className="text-white font-black text-base sm:text-lg uppercase tracking-tight">Life on Land</p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl" />
                </div>
                
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
                  Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, and halt biodiversity loss.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectInfoSection;
