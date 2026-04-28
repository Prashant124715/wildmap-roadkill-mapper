import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Search, Filter, ShieldAlert } from 'lucide-react';
import galleryData from '../data/galleryData.json';
import GalleryCard from '../components/gallery/GalleryCard';
import GalleryModal from '../components/gallery/GalleryModal';

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');

  // Extract unique categories and states for filters
  const categories = ['All', ...new Set(galleryData.map(item => item.category))];
  const states = ['All', ...new Set(galleryData.map(item => item.state))];

  // Filter and search logic
  const filteredData = useMemo(() => {
    return galleryData.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.animal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesState = stateFilter === 'All' || item.state === stateFilter;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [searchQuery, categoryFilter, stateFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-screen">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header & Awareness Section */}
      <div className="text-center mb-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center space-x-2 border border-brand-orange/30 px-4 py-1.5 rounded-full mb-6 bg-brand-orange/10 backdrop-blur">
            <Camera size={14} className="text-brand-orange" />
            <span className="text-[10px] text-brand-orange font-bold uppercase tracking-[0.2em]">Verified Visual Evidence</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-hero font-bold mb-6 text-white uppercase tracking-tight">
            Impact <span className="text-brand-orange">Gallery</span>
          </h2>
          
          <div className="max-w-3xl mx-auto bg-black/40 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
            <div className="flex items-start gap-4 text-left">
              <ShieldAlert size={32} className="text-brand-orange shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold tracking-widest uppercase mb-2">Every Image Tells a Story</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Each image below represents a real environmental impact on our infrastructure. We document these incidents not for spectacle, but to connect raw data with the reality of human-wildlife conflict. <strong className="text-white">Awareness is the first step toward systemic prevention.</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="mb-10 relative z-10">
        <div className="bg-brand-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by animal, location, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-gray-500" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-48 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-brand-orange transition-colors appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
            
            <select 
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full sm:w-48 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-brand-orange transition-colors appearance-none"
            >
              {states.map(state => (
                <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Grid Results count */}
      <div className="mb-6 text-xs text-gray-500 font-bold tracking-widest uppercase">
        Showing {filteredData.length} Documented Incident{filteredData.length !== 1 ? 's' : ''}
      </div>

      {/* Image Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence mode='popLayout'>
          {filteredData.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            filteredData.map(item => (
              <GalleryCard 
                key={item.id} 
                item={item} 
                onClick={setSelectedItem} 
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal View */}
      <GalleryModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

    </div>
  );
};

export default Gallery;
