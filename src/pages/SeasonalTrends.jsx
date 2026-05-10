import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, BrainCircuit, Activity, CloudRain, Sun, 
  Snowflake, Map, CalendarDays, TrendingUp, AlertTriangle 
} from 'lucide-react';
import Card from '../components/ui/Card';

const SeasonalTrends = () => {
  
  // Dummy data for sections
  const seasonalOverview = [
    { title: "Spring Activity", icon: Sun, score: "HIGH", color: "text-brand-lightGreen", bg: "bg-brand-lightGreen/10", border: "border-brand-lightGreen/30", text: "Increased movement for foraging.", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80" },
    { title: "Summer Migration", icon: Activity, score: "VERY HIGH", color: "text-brand-orange", bg: "bg-brand-orange/10", border: "border-brand-orange/30", text: "Mass migration toward water sources.", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
    { title: "Monsoon Movement", icon: CloudRain, score: "MODERATE", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", text: "Restricted movement due to flooded corridors.", img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&q=80" },
    { title: "Winter Crossings", icon: Snowflake, score: "CRITICAL", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30", text: "High nocturnal highway crossing risk.", img: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=600&q=80" }
  ];

  const speciesActivity = [
    { name: "Leopard", season: "Jan–March", level: "HIGH", risk: "Nocturnal Crossings", img: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400&q=80" },
    { name: "Asian Elephant", season: "July–September", level: "VERY HIGH", risk: "Corridor Flooding", img: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80" },
    { name: "Spotted Deer", season: "October–December", level: "MODERATE", risk: "Highway Foraging", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=80" }
  ];

  const heatmapData = [
    { month: "Jan", risk: 80 }, { month: "Feb", risk: 90 }, { month: "Mar", risk: 65 },
    { month: "Apr", risk: 40 }, { month: "May", risk: 55 }, { month: "Jun", risk: 70 },
    { month: "Jul", risk: 95 }, { month: "Aug", risk: 85 }, { month: "Sep", risk: 60 },
    { month: "Oct", risk: 45 }, { month: "Nov", risk: 50 }, { month: "Dec", risk: 75 }
  ];

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden pt-20 pb-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1920&q=80')`, opacity: 0.15 }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-brand-dark/90 z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none z-[2]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* 1. Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-center pt-10 pb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(255,107,0,0.2)]">
            <LineChart size={14} /> Analytics Dashboard
          </div>
          <h1 className="text-4xl md:text-6xl font-cinematic font-bold text-white tracking-[0.1em] mb-6 drop-shadow-lg">
            SEASONAL <span className="text-brand-orange">TRENDS</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Analyze wildlife movement, migration patterns, and seasonal hotspot activity using AI-powered conservation intelligence.
          </p>
        </motion.div>

        {/* 2. Seasonal Wildlife Overview */}
        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Seasonal Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalOverview.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className={`bg-[#0a0f0c]/80 backdrop-blur-xl border ${item.border} p-6 relative overflow-hidden group min-h-[220px] flex flex-col justify-end`}>
                  <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundImage: `url(${item.img})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <div className={`absolute -right-6 -top-6 w-24 h-24 ${item.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                  
                  <div className="relative z-10">
                    <item.icon size={28} className={`${item.color} mb-4`} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{item.title}</h3>
                    <div className={`text-[10px] font-bold ${item.color} mb-3`}>RISK: {item.score}</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.text}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Species Seasonal Activity */}
        <section>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Species Activity Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {speciesActivity.map((species, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + (idx * 0.1) }}>
                <Card className="bg-black/40 backdrop-blur border-white/10 overflow-hidden p-0 group">
                  <div className="h-40 relative overflow-hidden">
                    <img src={species.img} alt={species.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white font-bold tracking-wider">{species.name}</div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Peak Season</span>
                      <span className="text-white font-mono">{species.season}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Activity Level</span>
                      <span className={`font-bold ${species.level === 'VERY HIGH' ? 'text-red-400' : species.level === 'HIGH' ? 'text-brand-orange' : 'text-brand-lightGreen'}`}>{species.level}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3 mt-3">
                      <span className="text-gray-400">Primary Risk</span>
                      <span className="text-gray-300">{species.risk}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4 & 5. Migration Analytics & Incident Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <motion.section initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Monthly Incident Heatmap</h2>
            <Card className="bg-[#0a0f0c]/90 backdrop-blur border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays size={18} className="text-brand-orange" />
                <span className="text-sm font-bold text-gray-300">Highway Crossings Intensity</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {heatmapData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-md transition-all duration-300 hover:scale-110 cursor-pointer"
                      style={{ 
                        height: `${data.risk}px`, 
                        backgroundColor: `rgba(255, 107, 0, ${data.risk / 100})`,
                        boxShadow: `0 0 ${data.risk / 5}px rgba(255,107,0, ${data.risk / 200})`
                      }}
                    />
                    <span className="text-[10px] text-gray-400 font-mono">{data.month}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Migration Analytics</h2>
            <Card className="bg-[#0a0f0c]/90 backdrop-blur border-white/10 p-6 space-y-5 h-full">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <Map size={24} className="text-brand-lightGreen shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Corridor Usage Trends</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">During monsoon, usage of elevated forest corridors increases by 65% as lowlands flood.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <TrendingUp size={24} className="text-blue-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Seasonal Movement Intensity</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Winter foraging drives a 40% spike in nocturnal road crossings for herbivores.</p>
                </div>
              </div>
            </Card>
          </motion.section>
        </div>

        {/* 6. AI Seasonal Predictions & 7. Research Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <motion.section className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
              <BrainCircuit className="text-brand-orange" /> AI Predictions
            </h2>
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-l-red-500 border-y-white/5 border-r-white/5 p-5">
                <div className="flex gap-4">
                  <AlertTriangle className="text-red-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-1">⚠ March Approaching Alert</h4>
                    <p className="text-xs text-gray-300">Leopard crossing activity expected to increase by 28% on NH-52 due to mating season. Suggest enabling strict Driver Safety Mode geofencing.</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-l-blue-500 border-y-white/5 border-r-white/5 p-5">
                <div className="flex gap-4">
                  <CloudRain className="text-blue-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">⚠ Early Monsoon Forecast</h4>
                    <p className="text-xs text-gray-300">Elephant movement corridor risk elevated in southern forest regions starting mid-June. Expected herd migrations across main state highways.</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.section>

          <motion.section className="lg:col-span-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Key Insights</h2>
            <Card className="bg-black/60 backdrop-blur border-brand-lightGreen/20 p-6 h-full flex flex-col justify-center space-y-6">
              <div className="text-center">
                <div className="text-4xl font-cinematic font-bold text-brand-lightGreen mb-2">78%</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Of crossings occur 7PM–4AM</div>
              </div>
              <div className="w-full h-px bg-white/10" />
              <div className="text-center">
                <div className="text-4xl font-cinematic font-bold text-brand-orange mb-2">42%</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Monsoon Movement Spike</div>
              </div>
            </Card>
          </motion.section>

        </div>

      </div>
    </div>
  );
};

export default SeasonalTrends;
