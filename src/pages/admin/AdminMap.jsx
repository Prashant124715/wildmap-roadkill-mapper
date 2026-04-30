import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers } from 'lucide-react';

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
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reports'));
        const allReports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(allReports);
      } catch (error) {
        console.error("Error fetching reports for map:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReports();
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1">Global Incident Map</h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Admin Spatial Overview</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Rejected</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black border border-white/10 rounded-xl overflow-hidden relative">
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
                    <p className="text-xs text-gray-600 mb-2">Status: <strong className={
                      report.status === 'Verified' ? 'text-green-600' :
                      report.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                    }>{report.status}</strong></p>
                    <p className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 right-6 z-[1000] bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl">
          <h4 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
            <Layers size={14} className="text-brand-orange"/> Map Layers
          </h4>
          <div className="space-y-2 text-xs text-gray-300">
            <p>Total Markers: {reports.length}</p>
            <p>Active Zones: {new Set(reports.map(r => r.location)).size}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminMap;
