import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';

import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const MyReports = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserReports = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const q = query(
          collection(db, 'reports'), 
          where('userId', '==', user.id),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userReports = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Handle potential serverTimestamp issues during initial fetch
          timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp
        }));
        setReports(userReports);
      } catch (error) {
        console.error("Error fetching user reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReports();
  }, [user]);

  if (!user) {
    return <Navigate to="/contact" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-screen">
      
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-lightGreen/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-hero font-bold mb-4 text-white uppercase">{t('myReports.title')}</h2>
        <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
          {t('myReports.subtitle')}
        </p>
      </div>

      <div className="relative z-10">
        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-2 border-brand-orange border-t-transparent rounded-full mx-auto mb-4"
            />
            {t('common.loading')}
          </div>
        ) : reports.length === 0 ? (
          <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10 text-center py-16">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-gray-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('myReports.noReports')}</h3>
            <p className="text-gray-400 text-sm">{t('myReports.noReportsDesc')}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                      report.status === 'Pending' ? 'bg-orange-500/20 text-orange-500' :
                      report.status === 'Verified' ? 'bg-green-500/20 text-green-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {report.status === 'Pending' ? t('status.pending') : 
                       report.status === 'Verified' ? t('status.verified') : 
                       t('status.rejected')}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-brand-orange font-bold mb-2">{report.species || t('status.unknownSpecies')}</h4>
                  
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex items-start gap-2 text-xs text-gray-300">
                      <MapPin size={14} className="shrink-0 mt-0.5 text-gray-500" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-300">
                      <Calendar size={14} className="shrink-0 mt-0.5 text-gray-500" />
                      <span>{report.date}</span>
                    </div>
                  </div>

                  <div className="bg-black/50 p-3 rounded border border-white/5 text-[11px] text-gray-400 italic line-clamp-3">
                    "{report.details}"
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
