import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, AlertTriangle, Camera, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Firebase imports
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useAuth } from '../contexts/AuthContext';

import { analyzeImage } from '../lib/aiValidation';

const Contact = () => {
  const { t } = useTranslation();
  const { user, openAuthModal } = useAuth();
  const [formType, setFormType] = useState('general'); // 'general' or 'report'
  
  // Report Form State
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(t('common.errorTitle') + ': Geolocation is not supported');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(t('alerts.error') + ': Unable to retrieve your location.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImage({ file, previewUrl });
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!location) {
      alert(t('alerts.warning') + ": Please auto-detect the incident location.");
      return;
    }
    if (!details) {
      alert(t('alerts.warning') + ": Please provide details.");
      return;
    }

    setIsSubmitting(true);
    
    const submissionTimeout = setTimeout(() => {
      if (isSubmitting) {
        setIsSubmitting(false);
        alert(t('alerts.info') + ": Submission is taking longer. Saved locally.");
        setSubmitSuccess(true);
      }
    }, 20000);

    try {
      const reportId = Date.now().toString();
      
      let aiResult;
      try {
        aiResult = await analyzeImage(image?.previewUrl || null, details);
      } catch (aiErr) {
        aiResult = { aiScore: 50, confidence: 'Medium', explanation: 'AI validation skipped' };
      }

      const reportData = {
        userId: user ? user.name : 'Anonymous',
        userEmail: user ? user.email : 'anonymous@wildmap.in',
        species: species || 'Unknown',
        date: date || new Date().toISOString().split('T')[0],
        location,
        details,
        imageUrl: null,
        timestamp: new Date().toISOString(),
        status: 'Pending',
        aiScore: aiResult.aiScore || 50,
        confidence: aiResult.confidence || 'Medium',
        explanation: aiResult.explanation || 'Analyzed by System',
        isFlagged: aiResult.isFlagged || false
      };

      const savedReports = JSON.parse(localStorage.getItem('wildmap_reports') || '[]');
      savedReports.push({ id: reportId, ...reportData });
      localStorage.setItem('wildmap_reports', JSON.stringify(savedReports));

      if (navigator.onLine) {
        let currentImageUrl = null;
        if (image?.file) {
          try {
            const fileExtension = image.file.name.split('.').pop();
            const fileName = `reports/${reportId}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, image.file);
            currentImageUrl = await getDownloadURL(storageRef);
          } catch (uploadErr) {
            console.error("Image upload failed:", uploadErr);
          }
        }

        try {
          await addDoc(collection(db, 'reports'), {
            ...reportData,
            id: reportId,
            imageUrl: currentImageUrl,
            timestamp: serverTimestamp(),
          });
        } catch (dbErr) {
          console.error("Firestore sync failed:", dbErr);
        }
      }

      clearTimeout(submissionTimeout);
      setSubmitSuccess(true);
      setSpecies('');
      setDate('');
      setLocation('');
      setDetails('');
      setImage(null);

    } catch (error) {
      console.error("Critical submission error:", error);
      alert(t('alerts.error') + ": " + (error.message || "Unknown error"));
    } finally {
      clearTimeout(submissionTimeout);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-lightGreen/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl md:text-5xl font-hero font-bold mb-4 text-white uppercase">{t('reporting.title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            {t('reporting.subtitle')}
          </p>
        </motion.div>
        
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setFormType('general')}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
              formType === 'general' 
                ? 'bg-white text-brand-dark shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                : 'border border-white/20 text-gray-400 hover:text-white hover:border-white/50'
            }`}
          >
            {t('reporting.contactUs')}
          </button>
          <button
            onClick={() => {
              setFormType('report');
              setSubmitSuccess(false);
            }}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
              formType === 'report' 
                ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(255,92,0,0.4)]' 
                : 'border border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10'
            }`}
          >
            {t('reporting.reportIncident')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        <div className="lg:col-span-5 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="text-brand-lightGreen" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 tracking-widest uppercase text-sm">{t('reporting.emailUs')}</h4>
                  <p className="text-gray-400 text-sm">contact@wildmap.in</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-orange" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 tracking-widest uppercase text-sm">{t('reporting.hqLocation')}</h4>
                  <p className="text-gray-400 text-sm">Conservation Center,<br/>Bangalore, India</p>
                </div>
              </div>
            </Card>

            {formType === 'report' && (
              <Card className="mt-6 border-brand-orange/30 bg-brand-orange/5">
                <div className="flex gap-3">
                  <AlertTriangle className="text-brand-orange shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">{t('reporting.whyReport')}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {t('reporting.whyReportDesc')}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card hover={false} className="bg-brand-dark/80 backdrop-blur-xl border-white/10">
              
              {formType === 'general' ? (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">{t('reporting.name')}</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" placeholder={t('reporting.namePlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">{t('reporting.email')}</label>
                      <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" placeholder={t('reporting.emailPlaceholder')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">{t('reporting.message')}</label>
                    <textarea rows="5" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" placeholder={t('reporting.messagePlaceholder')} />
                  </div>
                  <Button type="submit" variant="primary" icon={Send} className="w-full">
                    {t('reporting.sendMessage')}
                  </Button>
                </form>
              ) : !user ? (
                <div className="py-16 text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-brand-orange w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-widest uppercase">{t('reporting.authRequired')}</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    {t('reporting.authRequiredDesc')}
                  </p>
                  <Button onClick={openAuthModal} variant="primary">
                    {t('reporting.signInToReport')}
                  </Button>
                </div>
              ) : submitSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-lightGreen/20 rounded-full flex items-center justify-center">
                    <Send className="text-brand-lightGreen w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-widest mb-2 uppercase">{t('reporting.reportSubmitted')}</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      {t('reporting.reportSubmittedDesc')}
                    </p>
                  </div>
                  <Button onClick={() => setSubmitSuccess(false)} variant="outline">
                    {t('reporting.submitAnother')}
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmitReport}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">{t('reporting.speciesLabel')}</label>
                      <input 
                        type="text" 
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        className="w-full bg-black/50 border border-brand-orange/20 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" 
                        placeholder={t('reporting.speciesPlaceholder')} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">{t('reporting.dateLabel')}</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-black/50 border border-brand-orange/20 rounded-lg p-3 text-gray-300 outline-none focus:border-brand-orange transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">{t('reporting.locationLabel')}</label>
                    <div 
                      onClick={!location && !isLocating ? handleGetLocation : undefined}
                      className={`border rounded-lg p-5 flex flex-col items-center justify-center transition-all duration-300 ${
                        location 
                          ? 'border-brand-lightGreen/40 bg-brand-lightGreen/10 text-brand-lightGreen cursor-default'
                          : 'border-brand-orange/30 border-dashed bg-black/30 hover:bg-black/50 cursor-pointer text-brand-orange hover:border-brand-orange/50'
                      }`}
                    >
                      {isLocating ? (
                        <div className="flex items-center gap-3">
                          <Loader2 size={24} className="animate-spin" />
                          <span className="text-sm font-bold tracking-widest uppercase">{t('reporting.locating')}</span>
                        </div>
                      ) : location ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-lightGreen/20 flex items-center justify-center">
                            <MapPin size={20} className="text-brand-lightGreen" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold tracking-widest text-white uppercase">{t('reporting.locationCaptured')}</span>
                            <span className="block text-xs font-mono text-brand-lightGreen/80 mt-1">{location}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-2">
                          <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                            <MapPin size={24} className="text-brand-orange animate-bounce" />
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-bold tracking-widest text-white uppercase">{t('reporting.autoDetect')}</span>
                            <span className="block text-xs text-gray-400 mt-1 uppercase">{t('reporting.autoDetectDesc')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">{t('reporting.visualEvidence')}</label>
                    <div 
                      className="border border-brand-orange/20 border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-black/30 hover:bg-black/50 transition-colors cursor-pointer" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {image ? (
                        <div className="relative w-full sm:w-1/2 mx-auto aspect-video rounded overflow-hidden">
                          <img src={image.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-bold uppercase">{t('reporting.changeImage')}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Camera className="mx-auto text-brand-orange mb-2" size={24} />
                          <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">{t('reporting.uploadPhoto')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">{t('reporting.detailsLabel')}</label>
                    <textarea 
                      rows="4" 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full bg-black/50 border border-brand-orange/20 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" 
                      placeholder={t('reporting.detailsPlaceholder')} 
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> {t('reporting.submitting')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <AlertTriangle size={16} /> {t('reporting.submitReport')}
                      </span>
                    )}
                  </Button>
                </form>
              )}
              
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
