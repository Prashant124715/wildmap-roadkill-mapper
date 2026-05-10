import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Custom icons based on status
const createIcon = (color) => new Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  Pending: createIcon('yellow'),
  Verified: createIcon('green'),
  Rejected: createIcon('red')
};

import { db } from '../../lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

const AdminMap = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([
    { id: 'map001', location: '19.0760, 72.8777', species: 'Leopard', status: 'Verified', timestamp: '2026-04-21T10:00:00Z' },
    { id: 'map002', location: '18.5204, 73.8567', species: 'Deer', status: 'Pending', timestamp: '2026-04-22T11:30:00Z' },
    { id: 'map003', location: '19.2183, 72.9781', species: 'Snake', status: 'Verified', timestamp: '2026-04-23T14:20:00Z' },
    { id: 'map004', location: '21.1458, 79.0882', species: 'Tiger', status: 'Verified', timestamp: '2026-04-24T09:15:00Z' },
    { id: 'map005', location: '19.9975, 73.7898', species: 'Monkey', status: 'Pending', timestamp: '2026-04-25T16:45:00Z' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reports'));
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (fetched.length > 0) {
          setReports([...fetched, ...reports.filter(dr => !fetched.some(fr => fr.id === dr.id))]);
        }
      } catch (error) {
        console.error("Error fetching reports for map:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] lg:h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1">{t('adminMap.globalTitle')}</h2>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">{t('adminMap.spatialOverview')}</p>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t('admin.pending')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t('admin.verified')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t('admin.rejected')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black border border-white/10 rounded-xl overflow-hidden relative min-h-[400px]">
        <MapContainer 
          center={[22.5937, 78.9629]} // Center of India
          zoom={5} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {reports.map((report) => {
            if (!report.location) return null;
            
            // Extract lat/lng from string like "19.076000, 72.877700"
            const coords = report.location.split(',').map(coord => parseFloat(coord.trim()));
            if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;

            return (
              <Marker key={report.id} position={coords} icon={icons[report.status] || icons.Pending}>
                <Popup className="admin-popup">
                  <div className="p-1">
                    <h3 className="font-bold text-sm mb-1">{report.species}</h3>
                    <p className="text-xs text-gray-600 mb-2">{t('admin.status')}: <strong className={
                      report.status === 'Verified' ? 'text-green-600' :
                      report.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                    }>{t(`admin.${report.status.toLowerCase()}`)}</strong></p>
                    <p className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] bg-black/80 backdrop-blur border border-white/10 p-3 sm:p-4 rounded-xl">
          <h4 className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2 sm:mb-3 flex items-center gap-2">
            <Layers size={14} className="text-brand-orange"/> {t('adminMap.mapLayers')}
          </h4>
          <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-gray-300">
            <p>{t('adminMap.totalMarkers')}: {reports.length}</p>
            <p>{t('adminMap.activeZones')}: {new Set(reports.map(r => r.location)).size}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminMap;
