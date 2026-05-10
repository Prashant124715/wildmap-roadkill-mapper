import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldAlert, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { stateRiskData, verifiedIncidents } from '../data/realIncidents';
import 'leaflet/dist/leaflet.css';

import { useNetwork } from '../hooks/useNetwork';

const StateAnalysis = () => {
  const { t } = useTranslation();
  const isOnline = useNetwork();
  const [geoData, setGeoData] = useState(null);
  const [selectedState, setSelectedState] = useState(stateRiskData[0]);

  // Fetch India States GeoJSON
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error fetching GeoJSON:", err));
  }, []);

  const getStyle = (feature) => {
    const stateName = feature.properties.NAME_1;
    const data = stateRiskData.find(s => s.state === stateName);
    
    let fillColor = '#1a4225'; // Default dark green (Low risk/No data)
    if (data) {
      if (data.level === 'High Risk') fillColor = '#ef4444'; // Red
      else if (data.level === 'Medium Risk') fillColor = '#f97316'; // Orange
      else fillColor = '#22c55e'; // Green
    }

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: 'rgba(255,255,255,0.2)',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.NAME_1;
    const data = stateRiskData.find(s => s.state === stateName);
    
    if (data) {
      layer.bindTooltip(`${data.state}: ${data.incidents} Incidents`, { sticky: true });
      layer.on({
        click: () => setSelectedState(data),
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({ fillOpacity: 1, weight: 2 });
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle({ fillOpacity: 0.7, weight: 1 });
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center space-x-2 border border-brand-orange/30 px-3 py-1 rounded-full mb-4 bg-brand-orange/5">
          <ShieldAlert size={14} className="text-brand-orange" />
          <span className="text-[10px] text-brand-orange uppercase tracking-[0.2em]">{t('hotspots.badge')}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-hero font-bold text-white uppercase mb-4">{t('hotspots.title')}</h2>
        <p className="text-gray-400 max-w-3xl text-sm leading-relaxed">
          {t('hotspots.subtitle')} {t('hotspots.riskInfo')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Map & Charts */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10 p-0 overflow-hidden relative">
            {/* Improved Legend for Mobile */}
            <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-auto z-[400] bg-black/80 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-white/10 pointer-events-none">
              <h3 className="text-white font-bold text-[10px] sm:text-sm tracking-widest uppercase mb-1.5 sm:mb-2">{t('hotspots.mapTitle')}</h3>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[9px] sm:text-xs text-gray-300">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-sm"></span> {t('hotspots.highRisk')}</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-sm"></span> {t('hotspots.mediumRisk')}</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-sm"></span> {t('hotspots.lowRisk')}</div>
              </div>
            </div>
            
            <div className="h-[350px] xs:h-[400px] sm:h-[500px] w-full bg-[#0a0a0a]">
              {!isOnline ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#0a0a0a]">
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Map Unavailable</h3>
                  <p className="text-gray-400 text-sm">Please connect to the internet to view the interactive choropleth map.</p>
                </div>
              ) : (
                <MapContainer 
                  center={[22.5937, 78.9629]} 
                  zoom={window.innerWidth < 640 ? 3.5 : 4.5} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  attributionControl={false}
                >
                  {/* Dark matter tile layer for base map */}
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
                  {geoData && (
                    <GeoJSON 
                      data={geoData} 
                      style={getStyle} 
                      onEachFeature={onEachFeature}
                    />
                  )}
                </MapContainer>
              )}
            </div>
          </Card>

          <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10 p-5 sm:p-8">
            <h3 className="text-white font-bold text-xs sm:text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-orange" />
              {t('hotspots.incidentVolume')}
            </h3>
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateRiskData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                  <XAxis dataKey="id" stroke="#525252" tick={{fill: '#9ca3af', fontSize: 10}} />
                  <YAxis stroke="#525252" tick={{fill: '#9ca3af', fontSize: 10}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                  />
                  <Bar dataKey="incidents" radius={[4, 4, 0, 0]}>
                    {stateRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.level === 'High Risk' ? '#ef4444' : entry.level === 'Medium Risk' ? '#f97316' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* Right: Data Panel */}
        <div className="lg:col-span-4 space-y-8">
          
          <motion.div 
            key={selectedState.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-t-4 ${selectedState.level === 'High Risk' ? 'border-t-red-500' : selectedState.level === 'Medium Risk' ? 'border-t-orange-500' : 'border-t-green-500'} bg-brand-dark/80`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white font-hero">{selectedState.state}</h3>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">{t('hotspots.nationalRank')}: #{selectedState.rank}</span>
                </div>
                <div className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${selectedState.level === 'High Risk' ? 'bg-red-500/20 text-red-500' : selectedState.level === 'Medium Risk' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                  {selectedState.level === 'High Risk' ? t('hotspots.highRisk') : selectedState.level === 'Medium Risk' ? t('hotspots.mediumRisk') : t('hotspots.lowRisk')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('hotspots.totalIncidents')}</span>
                  <span className="text-3xl font-hero font-bold text-white">{selectedState.incidents}</span>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('hotspots.riskScore')}</span>
                  <span className="text-3xl font-hero font-bold text-brand-orange">{selectedState.riskScore}/100</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('hotspots.hotspotHighlight')}</span>
                  <p className="text-sm text-gray-300 border-l-2 border-brand-orange pl-3 py-1">{selectedState.highlight}</p>
                </div>
                <div className="bg-brand-orange/5 border border-brand-orange/20 rounded p-3 flex items-start gap-2">
                  <Info size={14} className="text-brand-orange shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-orange/80">
                    {t('hotspots.riskInfo')}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Verified Case Studies Section */}
          <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10">
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              {t('hotspots.caseStudies')}
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {verifiedIncidents.map(incident => (
                <div key={incident.id} className="bg-black/40 border border-white/5 rounded-lg p-4 hover:border-brand-orange/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded">{incident.state}</span>
                    <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">{incident.severity}</span>
                  </div>
                  <h4 className="text-brand-orange font-bold text-sm mb-1">{incident.location}</h4>
                  <p className="text-xs text-gray-300 mb-2">{t('hotspots.species')}: <span className="text-white">{incident.species}</span></p>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-2">{incident.description}</p>
                  <span className="text-[9px] text-gray-500 uppercase">{t('hotspots.source')}: {incident.source}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default StateAnalysis;
