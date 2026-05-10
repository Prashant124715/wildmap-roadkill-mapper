import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, BarChart3, Trees, Eye, VolumeX, CameraOff, ShieldCheck, Ruler, Leaf, TrendingUp, Filter, ChevronDown, AlertTriangle, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { animalData, ethicalGuidelines, habitatTypes, frequencyLevels, timeOptions } from '../data/biodiversityData';

const iconMap = { Eye, VolumeX, CameraOff, ShieldCheck, Ruler, Leaf };

const frequencyColor = { 'Very High': 'text-green-400 bg-green-400/15', 'High': 'text-emerald-400 bg-emerald-400/15', 'Medium': 'text-yellow-400 bg-yellow-400/15', 'Low': 'text-orange-400 bg-orange-400/15' };
const statusColor = { 'Endangered': 'text-red-400 border-red-400/30', 'Vulnerable': 'text-amber-400 border-amber-400/30', 'Least Concern': 'text-green-400 border-green-400/30' };

// Heatmap bar component
const HeatBar = ({ value }) => (
  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
    <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: 'easeOut' }}
      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #166534 0%, #22c55e ${value < 50 ? '100%' : '50%'}, #f97316 100%)` }} />
  </div>
);

// Animal Insight Card
const AnimalCard = ({ animal, index }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-brand-lightGreen/40 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(59,139,84,0.15)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Image */}
        <div className="lg:col-span-4 relative overflow-hidden h-64 sm:h-80 lg:h-auto bg-brand-dark">
          <img 
            src={animal.image} 
            alt={animal.name} 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80'; }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6">
            <h3 className="text-2xl md:text-3xl font-hero font-bold text-white leading-tight">{animal.name}</h3>
            <p className="text-xs md:text-sm text-gray-300 italic mb-3">{animal.scientificName}</p>
            <div className="flex flex-wrap gap-2">
              <span className={`text-[10px] md:text-[11px] px-3 py-1 rounded-full border backdrop-blur-md ${statusColor[animal.conservationStatus] || ''}`}>{animal.conservationStatus}</span>
              <span className={`text-[10px] md:text-[11px] px-3 py-1 rounded-full backdrop-blur-md ${frequencyColor[animal.frequency] || ''}`}>{animal.frequency} {t('biodiversity.frequencySuffix')}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-8 p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoBlock icon={MapPin} label={t('biodiversity.observationZones')} color="text-brand-lightGreen">
              <ul className="grid grid-cols-1 xs:grid-cols-2 gap-y-1 gap-x-4">{animal.observationZones.map((z, i) => <li key={i} className="text-xs text-gray-300 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-brand-lightGreen" />{z}</li>)}</ul>
            </InfoBlock>
            <InfoBlock icon={Calendar} label={t('biodiversity.bestMonths')} color="text-brand-orange"><p className="text-sm text-gray-300 font-medium">{animal.bestMonths}</p></InfoBlock>
            <InfoBlock icon={Clock} label={t('biodiversity.bestTime')} color="text-sky-400"><p className="text-sm text-gray-300 font-medium">{animal.bestTime}</p></InfoBlock>
            <InfoBlock icon={Trees} label={t('biodiversity.habitat')} color="text-emerald-400"><p className="text-sm text-gray-300 font-medium">{animal.habitat}</p></InfoBlock>
          </div>

          {/* Ethical Tip */}
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div><p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-0.5">{t('biodiversity.ethicalTip')}</p><p className="text-xs text-gray-300">{animal.ethicalTip}</p></div>
          </div>

          {/* Activity Trend Chart */}
          <div>
            <div className="flex items-center gap-2 mb-2"><TrendingUp size={14} className="text-brand-lightGreen" /><span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{t('biodiversity.activityTrend')}</span></div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={animal.activityTrend}>
                  <defs><linearGradient id={`grad-${animal.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b8b54" stopOpacity={0.4} /><stop offset="100%" stopColor="#3b8b54" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#0a190f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#3b8b54' }} />
                  <Area type="monotone" dataKey="activity" stroke="#3b8b54" strokeWidth={2} fill={`url(#grad-${animal.id})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Heatmap intensity bar */}
            <div className="mt-2"><p className="text-[10px] text-gray-500 mb-1">{t('biodiversity.intensity')}</p><HeatBar value={animal.activityTrend.reduce((a, b) => a + b.activity, 0) / animal.activityTrend.length} /></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InfoBlock = ({ icon: Icon, label, color, children }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1.5"><Icon size={14} className={color} /><span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</span></div>
    {children}
  </div>
);

const BiodiversityInsights = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [habitat, setHabitat] = useState('All Habitats');
  const [frequency, setFrequency] = useState('All Levels');
  const [time, setTime] = useState('All Times');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return animalData.filter(a => {
      const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.scientificName.toLowerCase().includes(search.toLowerCase());
      const matchHabitat = habitat === 'All Habitats' || a.habitat === habitat;
      const matchFreq = frequency === 'All Levels' || a.frequency === frequency;
      const matchTime = time === 'All Times' || a.bestTime.toLowerCase().includes(time.toLowerCase());
      return matchSearch && matchHabitat && matchFreq && matchTime;
    });
  }, [search, habitat, frequency, time]);

  // Floating particles
  const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1, dur: Math.random() * 15 + 10 })), []);

  return (
    <div className="flex flex-col w-full">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-green/80 to-brand-dark" />
        </div>
        {/* Particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {particles.map(p => (
            <motion.div key={p.id} className="absolute rounded-full bg-brand-lightGreen/30" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -80, 0], opacity: [0.2, 0.7, 0.2] }} transition={{ duration: p.dur, repeat: Infinity, ease: 'linear' }} />
          ))}
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center space-x-2 border border-brand-lightGreen/30 px-4 py-1.5 rounded-full mb-6 bg-brand-lightGreen/5">
              <Sparkles size={14} className="text-brand-lightGreen" />
              <span className="text-[10px] text-brand-lightGreen uppercase tracking-[0.2em]">{t('biodiversity.badge')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-hero font-black text-white mb-4 leading-tight">
              {t('biodiversity.title')}<br /><span className="text-brand-lightGreen">{t('biodiversity.insights')}</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {t('biodiversity.subtitle')}
            </p>
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('biodiversity.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-brand-lightGreen/50 focus:shadow-[0_0_30px_rgba(59,139,84,0.15)] transition-all duration-300"
                id="biodiversity-search" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Filters Toggle */}
        <div className="mb-8">
          <button onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white uppercase tracking-widest font-bold transition-colors cursor-pointer"
            id="filter-toggle">
            <Filter size={14} /> {t('biodiversity.filters')} <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <SelectFilter label={t('biodiversity.habitatType')} value={habitat} options={habitatTypes} onChange={setHabitat} id="filter-habitat" />
                  <SelectFilter label={t('biodiversity.frequencyLevel')} value={frequency} options={frequencyLevels} onChange={setFrequency} id="filter-frequency" />
                  <SelectFilter label={t('biodiversity.observationTime')} value={time} options={timeOptions} onChange={setTime} id="filter-time" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">
          {filtered.length} {t('biodiversity.speciesFound')} {search && <span>{t('biodiversity.for')} "<span className="text-brand-lightGreen">{search}</span>"</span>}
        </p>

        {/* Animal Cards */}
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? filtered.map((animal, i) => <AnimalCard key={animal.id} animal={animal} index={i} />) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Search size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">{t('biodiversity.noSpeciesFound')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ETHICAL GUIDELINES */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-[#0d2818] to-brand-dark" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 border border-brand-lightGreen/30 px-4 py-1.5 rounded-full mb-4 bg-brand-lightGreen/5">
              <Leaf size={14} className="text-brand-lightGreen" />
              <span className="text-[10px] text-brand-lightGreen uppercase tracking-[0.2em]">{t('biodiversity.conservationEthics')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-hero font-bold text-white mb-3">{t('biodiversity.ethicalGuidelines')}</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">{t('biodiversity.ethicalSubtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ethicalGuidelines.map((g, i) => {
              const Icon = iconMap[g.icon] || Eye;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="glass-panel rounded-xl p-6 hover:border-brand-lightGreen/30 transition-all duration-300 group hover:shadow-[0_4px_20px_rgba(59,139,84,0.1)]">
                  <div className="w-10 h-10 rounded-full bg-brand-lightGreen/10 flex items-center justify-center mb-4 group-hover:bg-brand-lightGreen/20 transition-colors">
                    <Icon size={20} className="text-brand-lightGreen" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">{g.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{g.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-panel rounded-xl p-4 border-brand-lightGreen/20 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            {t('biodiversity.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};

const SelectFilter = ({ label, value, options, onChange, id }) => (
  <div>
    <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-bold">{label}</label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} id={id}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-lightGreen/50 transition-colors cursor-pointer">
        {options.map(o => <option key={o} value={o} className="bg-brand-dark">{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

export default BiodiversityInsights;
