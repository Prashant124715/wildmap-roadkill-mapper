import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { Filter, Layers, AlertCircle, ChevronRight, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockIncidents } from '../data/mockData';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Custom Marker
const createCustomIcon = (severity) => {
  const colors = {
    Low: '#3b8b54',
    Medium: '#eab308',
    High: '#ff5c00',
    Critical: '#ef4444'
  };
  const color = colors[severity] || '#ff5c00';

  return divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px ${color}80;
      ">
        <div style="width: 0.5rem; height: 0.5rem; background-color: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

import { useNetwork } from '../hooks/useNetwork';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const MapPage = () => {
  const { t } = useTranslation();
  const isOnline = useNetwork();
  const [activeIncident, setActiveIncident] = useState(null);
  const [filter, setFilter] = useState('All');
  const [realIncidents, setRealIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealIncidents = async () => {
      try {
        const q = query(collection(db, 'reports'), where('status', '==', 'Verified'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Map Firestore data to the format expected by the Map component
          return {
            id: doc.id,
            species: data.species,
            severity: data.aiScore >= 70 ? 'Critical' : data.aiScore >= 40 ? 'High' : 'Medium',
            location: data.location.split(',').map(c => parseFloat(c.trim())),
            description: data.details,
            date: data.date,
            time: 'N/A',
            category: 'Citizen Report',
            action: 'Report verified by wildlife authorities.'
          };
        });
        setRealIncidents(fetched);
      } catch (error) {
        console.error("Error fetching incidents for map:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOnline) {
      fetchRealIncidents();
    }
  }, [isOnline]);

  // Merge mock data with real data for better demonstration if needed, 
  // or just use real data. Here we merge them.
  const allIncidents = [...mockIncidents, ...realIncidents];

  const filteredIncidents = filter === 'All' 
    ? allIncidents 
    : allIncidents.filter(inc => inc.severity === filter);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 glass-panel border-r border-white/10 flex flex-col z-20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-hero font-bold tracking-widest text-white mb-4 flex items-center gap-2">
            <Filter size={20} className="text-brand-orange" />
            {t('map.filters')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">{t('map.severity')}</label>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-brand-dark/50 border border-white/20 rounded p-2 text-sm text-white outline-none focus:border-brand-orange transition-colors"
              >
                <option value="All">{t('map.allIncidents')}</option>
                <option value="Critical">{t('map.allIncidents') === 'All Incidents' ? 'Critical' : 'गंभीर (Critical)'}</option>
                <option value="High">{t('map.allIncidents') === 'All Incidents' ? 'High' : 'उच्च (High)'}</option>
                <option value="Medium">{t('map.allIncidents') === 'All Incidents' ? 'Medium' : 'मध्यम (Medium)'}</option>
                <option value="Low">{t('map.allIncidents') === 'All Incidents' ? 'Low' : 'कमी (Low)'}</option>
              </select>
            </div>
            
            <div className="pt-4 flex items-center justify-between text-sm text-gray-300">
              <span className="flex items-center gap-2"><Layers size={16}/> {t('map.clustering')}</span>
              <div className="w-10 h-5 bg-brand-orange rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Details Panel */}
        <div className="flex-grow p-6 overflow-y-auto">
          {activeIncident ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <div className="inline-flex items-center space-x-2 border border-brand-orange/30 px-2 py-1 rounded-full mb-3 bg-brand-orange/5">
                  <span className="text-[10px] text-brand-orange uppercase tracking-[0.2em]">{activeIncident.severity} Severity</span>
                </div>
                <h3 className="text-2xl font-hero font-bold text-white">{activeIncident.species}</h3>
                <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">{activeIncident.date} • {activeIncident.time}</p>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <strong className="block text-white mb-1">{t('map.locationDetails')}</strong>
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="text-brand-lightGreen shrink-0 mt-0.5" />
                    {t('map.coordinates')}: {activeIncident.location.join(', ')}
                  </p>
                </div>
                <div>
                  <strong className="block text-white mb-1">{t('map.description')}</strong>
                  <p className="leading-relaxed">{activeIncident.description}</p>
                </div>
                <div className="p-4 bg-brand-dark/50 rounded-lg border border-brand-lightGreen/30">
                  <strong className="flex items-center gap-2 text-brand-lightGreen mb-2">
                    <AlertCircle size={16} /> {t('map.suggestedAction')}
                  </strong>
                  <p className="text-xs">{activeIncident.action}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4 opacity-50">
              <MapPin size={48} className="mb-2" />
              <p className="text-sm tracking-widest uppercase">{t('map.selectMarker')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-grow relative z-0">
        {!isOnline ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#050a06] text-center p-6">
            <MapPin size={48} className="text-gray-600 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">{t('map.unavailable')}</h3>
            <p className="text-gray-400 text-sm">{t('map.offlineDesc')}</p>
          </div>
        ) : (
          <MapContainer 
            center={[20.5937, 78.9629]} // Center of India
            zoom={5} 
            style={{ height: '100%', width: '100%', background: '#050a06' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            {filteredIncidents.map(incident => (
              <Marker 
                key={incident.id} 
                position={incident.location}
                icon={createCustomIcon(incident.severity)}
                eventHandlers={{
                  click: () => setActiveIncident(incident),
                }}
              >
                <Popup className="custom-popup">
                  <div className="font-sans">
                    <h4 className="font-bold text-gray-900">{incident.species}</h4>
                    <p className="text-xs text-gray-500">{incident.category}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

    </div>
  );
};

export default MapPage;
