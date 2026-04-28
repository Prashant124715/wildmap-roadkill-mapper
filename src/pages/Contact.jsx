import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, AlertTriangle, Camera, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Firebase imports
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useAuth } from '../contexts/AuthContext';

const Contact = () => {
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
      alert('Geolocation is not supported by your browser');
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
        alert('Unable to retrieve your location');
        setIsLocating(false);
      }
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
      alert("Please auto-detect the incident location before submitting.");
      return;
    }
    if (!details) {
      alert("Please provide the incident details.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      const reportId = Date.now().toString();

      // Create base report data
      const reportData = {
        userId: user ? user.id : 'anonymous',
        species: species || 'Unknown',
        date: date || new Date().toISOString().split('T')[0],
        location,
        details,
        imageUrl: null, // will update if upload succeeds
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };

      // 1. ALWAYS store locally first so the user's data isn't lost if Firebase hangs
      const savedReports = JSON.parse(localStorage.getItem('wildmap_reports') || '[]');
      savedReports.push({ id: reportId, ...reportData });
      localStorage.setItem('wildmap_reports', JSON.stringify(savedReports));

      // 2. Attempt Firebase save in the background (fire and forget with timeout)
      if (navigator.onLine) {
        // We do not await this, so the UI can proceed immediately.
        // It will sync to Firebase in the background.
        (async () => {
          try {
            if (image?.file) {
              const fileExtension = image.file.name.split('.').pop();
              const fileName = `reports/${reportId}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
              const storageRef = ref(storage, fileName);
              
              await uploadBytes(storageRef, image.file);
              reportData.imageUrl = await getDownloadURL(storageRef);
              
              // Update local storage with image URL
              const updatedReports = JSON.parse(localStorage.getItem('wildmap_reports') || '[]');
              const reportIndex = updatedReports.findIndex(r => r.id === reportId);
              if (reportIndex !== -1) {
                updatedReports[reportIndex].imageUrl = reportData.imageUrl;
                localStorage.setItem('wildmap_reports', JSON.stringify(updatedReports));
              }
            }

            await addDoc(collection(db, 'reports'), {
              ...reportData,
              timestamp: serverTimestamp(),
            });
          } catch (err) {
            console.error("Background Firebase sync failed:", err);
          }
        })();
      }

      setSubmitSuccess(true);
      
      // Reset form fields
      setSpecies('');
      setDate('');
      setLocation('');
      setDetails('');
      setImage(null);

    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to save report locally.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-lightGreen/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl md:text-5xl font-hero font-bold mb-4 text-white">GET INVOLVED</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Whether you want to partner with us or report a recent wildlife incident, your voice matters.
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
            Contact Us
          </button>
          <button
            onClick={() => {
              setFormType('report');
              setSubmitSuccess(false); // Reset success state when switching
            }}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
              formType === 'report' 
                ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(255,92,0,0.4)]' 
                : 'border border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10'
            }`}
          >
            Report Incident
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Left Column: Info */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="text-brand-lightGreen" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 tracking-widest uppercase text-sm">Email Us</h4>
                  <p className="text-gray-400 text-sm">contact@wildmap.in</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-orange" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 tracking-widest uppercase text-sm">HQ Location</h4>
                  <p className="text-gray-400 text-sm">Conservation Center,<br/>Bangalore, India</p>
                </div>
              </div>
            </Card>

            {formType === 'report' && (
              <Card className="mt-6 border-brand-orange/30 bg-brand-orange/5">
                <div className="flex gap-3">
                  <AlertTriangle className="text-brand-orange shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-2">Why Report?</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Citizen reports help identify hidden hotspots. Your data directly influences where we propose wildlife crossings and speed enforcement.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card hover={false} className="bg-brand-dark/80 backdrop-blur-xl border-white/10">
              
              {formType === 'general' ? (
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Name</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
                      <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Message</label>
                    <textarea rows="5" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" placeholder="How can we help?" />
                  </div>
                  <Button type="submit" variant="primary" icon={Send} className="w-full">
                    SEND MESSAGE
                  </Button>
                </form>
              ) : !user ? (
                <div className="py-16 text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-brand-orange w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-widest">AUTHENTICATION REQUIRED</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Please sign in to report a wildlife incident. This ensures data credibility and allows you to track the status of your reports.
                  </p>
                  <Button onClick={openAuthModal} variant="primary">
                    SIGN IN TO REPORT
                  </Button>
                </div>
              ) : submitSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-lightGreen/20 rounded-full flex items-center justify-center">
                    <Send className="text-brand-lightGreen w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-widest mb-2">REPORT SUBMITTED</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Thank you for contributing to wildlife conservation. Your report has been securely saved to our database.
                    </p>
                  </div>
                  <Button onClick={() => setSubmitSuccess(false)} variant="outline">
                    SUBMIT ANOTHER REPORT
                  </Button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmitReport}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs text-brand-orange uppercase tracking-widest">Species (if known)</label>
                      <input 
                        type="text" 
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        className="w-full bg-black/50 border border-brand-orange/20 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" 
                        placeholder="e.g. Leopard, Macaque" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-brand-orange uppercase tracking-widest">Date of Sighting</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-black/50 border border-brand-orange/20 rounded-lg p-3 text-gray-300 outline-none focus:border-brand-orange transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-brand-orange uppercase tracking-widest">Incident Location *</label>
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
                          <span className="text-sm font-bold tracking-widest">ACQUIRING SATELLITE LOCK...</span>
                        </div>
                      ) : location ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-lightGreen/20 flex items-center justify-center">
                            <MapPin size={20} className="text-brand-lightGreen" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold tracking-widest text-white">LOCATION CAPTURED</span>
                            <span className="block text-xs font-mono text-brand-lightGreen/80 mt-1">{location}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-2">
                          <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                            <MapPin size={24} className="text-brand-orange animate-bounce" />
                          </div>
                          <div className="text-center">
                            <span className="block text-sm font-bold tracking-widest text-white">AUTO-DETECT GPS</span>
                            <span className="block text-xs text-gray-400 mt-1">Tap here to lock your precise coordinates</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-brand-orange uppercase tracking-widest">Visual Evidence</label>
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
                            <span className="text-white text-sm font-bold">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Camera className="mx-auto text-brand-orange mb-2" size={24} />
                          <p className="text-sm text-gray-400">Click to upload photo from device</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-brand-orange uppercase tracking-widest">Incident Details *</label>
                    <textarea 
                      rows="4" 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full bg-black/50 border border-brand-orange/20 rounded-lg p-3 text-white outline-none focus:border-brand-orange transition-colors" 
                      placeholder="Describe the severity, condition of the animal, etc." 
                      required
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> SUBMITTING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <AlertTriangle size={16} /> SUBMIT REPORT
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
