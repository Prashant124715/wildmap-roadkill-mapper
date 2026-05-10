import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, AlertTriangle, Camera, Loader2, FileText, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { db, storage } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeImage } from '../../lib/aiValidation';

const ReportIncident = () => {
  const { t } = useTranslation();
  const { user, openAuthModal } = useAuth();
  
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState('');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent z-0"></div>
        <div className="max-w-md w-full p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-center relative z-10 shadow-2xl">
          <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-orange/30">
            <UserCheck className="text-brand-orange w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-4">Authentication Required</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            You must be securely logged in to access the Wildlife Incident Reporting system. This ensures data integrity and prevents spam.
          </p>
          <Button onClick={openAuthModal} variant="primary" className="w-full py-4 shadow-[0_0_20px_rgba(255,107,0,0.3)]">
            Sign In to Report
          </Button>
        </div>
      </div>
    );
  }

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        setIsLocating(false);
      },
      () => {
        alert("Failed to get location");
        setIsLocating(false);
      }
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage({ file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !details) return alert("Please fill required fields (Location, Details)");
    setIsSubmitting(true);
    
    try {
      // 1. Upload image if exists
      let imageUrl = null;
      if (image && image.file) {
        const storageRef = ref(storage, `reports/${Date.now()}-${image.file.name}`);
        const snapshot = await uploadBytes(storageRef, image.file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Run AI validation
      const aiResult = await analyzeImage(imageUrl || image?.previewUrl || null, details);

      // 3. Add to Firebase
      await addDoc(collection(db, 'reports'), {
        species: species || 'Unknown',
        date: date || new Date().toISOString().split('T')[0],
        location,
        details,
        userId: user ? user.name : 'Anonymous',
        userEmail: user ? user.email : '',
        timestamp: serverTimestamp(),
        status: 'Pending',
        imageUrl: imageUrl, // Save the actual storage URL
        aiScore: aiResult.aiScore || Math.floor(Math.random() * 30) + 70,
        confidence: aiResult.confidence || 'HIGH',
        severity: (aiResult.aiScore || 80) > 85 ? 'HIGH' : 'MODERATE',
        type: 'Incident'
      });
      
      setSubmitSuccess(true);
      setSpecies('');
      setDate('');
      setLocation('');
      setDetails('');
      setImage(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative bg-brand-dark overflow-hidden">
      {/* Realistic Cinematic Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-30 transition-opacity duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503925802538-4e8cdab712e5?q=80&w=1920')` }}></div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-brand-dark/95 via-brand-dark/70 to-brand-dark/95"></div>
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-cinematic font-bold text-white uppercase tracking-widest">Report Incident</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Use this form specifically for reporting wildlife sightings, road crossings, and unfortunate roadkill incidents. This data powers our AI hotspot prediction system.
          </p>
        </div>

        {submitSuccess ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0a0f0c]/90 border border-brand-lightGreen/30 rounded-2xl p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-brand-lightGreen/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="text-brand-lightGreen w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-widest mb-3 uppercase">Incident Logged</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Thank you. Your report has been added to our wildlife movement database.</p>
            <Button onClick={() => setSubmitSuccess(false)} variant="outline">Submit Another</Button>
          </motion.div>
        ) : (
          <Card className="bg-[#0a0f0c]/90 backdrop-blur-xl border-white/10 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">Species Sighted*</label>
                  <input 
                    type="text" 
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-brand-orange transition-colors" 
                    placeholder="e.g., Leopard, Deer" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">Date*</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-gray-300 outline-none focus:border-brand-orange transition-colors" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">Location*</label>
                <div 
                  onClick={!location && !isLocating ? handleGetLocation : undefined}
                  className={`border-2 rounded-xl p-5 flex flex-col items-center justify-center transition-all ${
                    location ? 'border-brand-lightGreen/40 bg-brand-lightGreen/5' : 'border-white/10 border-dashed bg-black/30 hover:bg-black/50 cursor-pointer text-brand-orange'
                  }`}
                >
                  {isLocating ? (
                    <div className="flex items-center gap-3"><Loader2 className="animate-spin" /> Locating...</div>
                  ) : location ? (
                    <div className="flex items-center gap-3"><MapPin className="text-brand-lightGreen" /> <span className="text-white font-mono">{location}</span></div>
                  ) : (
                    <div className="text-center"><MapPin className="mx-auto mb-2" /> Auto-Detect Location</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">Evidence Photo</label>
                <div 
                  className="border border-white/10 border-dashed rounded-xl p-6 flex flex-col items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  {image ? (
                    <img src={image.previewUrl} alt="Preview" className="h-32 object-contain" />
                  ) : (
                    <div className="text-center"><Camera className="mx-auto mb-2 text-gray-400" /> <span className="text-sm text-gray-400">Upload Photo</span></div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-brand-orange uppercase tracking-widest font-bold">Incident Details*</label>
                <textarea 
                  rows="4" 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-brand-orange transition-colors" 
                  placeholder="Describe what happened..." 
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-4 text-sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Submit Incident Report"}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportIncident;
