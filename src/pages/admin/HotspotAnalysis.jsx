import { useState, useEffect } from 'react';
import { Flame, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const HotspotAnalysis = () => {
  const [reports, setReports] = useState([]);
  const [hotspotData, setHotspotData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVerifiedReports = async () => {
      try {
        const q = query(collection(db, 'reports'), where('status', '==', 'Verified'));
        const querySnapshot = await getDocs(q);
        const verified = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(verified);

        // Group by location (mock clustering)
        const clusters = {};
        verified.forEach(r => {
          if (!r.location) return;
          const locKey = r.location.substring(0, 5); // crude grouping
          if (!clusters[locKey]) {
            clusters[locKey] = {
              id: locKey,
              center: r.location,
              count: 0,
              species: new Set()
            };
          }
          clusters[locKey].count += 1;
          clusters[locKey].species.add(r.species);
        });

        const formattedData = Object.values(clusters).map(c => ({
          name: `Zone ${c.id}`,
          incidents: c.count,
          speciesCount: c.species.size,
          riskLevel: c.count > 5 ? 'Critical' : c.count > 2 ? 'High' : 'Medium'
        })).sort((a, b) => b.incidents - a.incidents);

        setHotspotData(formattedData);
      } catch (error) {
        console.error("Error fetching hotspot data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiedReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-hero font-bold text-white uppercase tracking-wider mb-1">Hotspot Analysis</h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase">Spatial Risk Clustering</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-black/40 border border-white/10 rounded-xl p-12 text-center backdrop-blur-sm">
          <ShieldCheck size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Insufficient Data</h3>
          <p className="text-gray-400">Analysis requires verified reports. Currently, there are no verified incidents to analyze.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Hotspots List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Priority Intervention Zones</h3>
            
            {hotspotData.slice(0, 5).map((zone, idx) => (
              <div key={zone.name} className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    idx === 1 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-white/5 text-gray-400 border border-white/10'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{zone.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{zone.incidents} Incidents</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                    zone.riskLevel === 'Critical' ? 'bg-red-500 text-white' :
                    zone.riskLevel === 'High' ? 'bg-brand-orange text-white' : 'bg-yellow-500 text-black'
                  }`}>
                    {zone.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Flame size={18} className="text-brand-orange" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Incident Density by Zone</h3>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hotspotData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" />
                  <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#ff5c00' }}
                  />
                  <Bar dataKey="incidents" fill="#ff5c00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-brand-orange/5 border border-brand-orange/20 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle size={18} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300 leading-relaxed">
                Analysis is generated using verified incident data. Clusters marked as <strong className="text-red-400">Critical</strong> indicate immediate need for structural mitigation such as underpasses or strict speed enforcement.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default HotspotAnalysis;
