import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, HelpCircle, UserCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const ContactUs = () => {
  const { user, openAuthModal } = useAuth();
  
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
            Please log in to contact our support teams or NGOs.
          </p>
          <Button onClick={openAuthModal} variant="primary" className="w-full py-4">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative bg-brand-dark overflow-hidden">
      {/* Realistic Cinematic Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-30 transition-opacity duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920')` }}></div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-brand-dark/95 via-brand-dark/70 to-brand-dark/95"></div>
      
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-cinematic font-bold text-white uppercase tracking-widest">Contact Us</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            General support, NGO inquiries, and emergency helpline contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#0a0f0c]/80 backdrop-blur border-white/10 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-lightGreen/10 border border-brand-lightGreen/30 flex items-center justify-center">
              <Phone className="text-brand-lightGreen" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">Emergency Hotline</h4>
              <p className="text-gray-400 text-sm">1800-11-2233 (Toll Free)</p>
            </div>
          </Card>
          <Card className="bg-[#0a0f0c]/80 backdrop-blur border-white/10 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center">
              <Mail className="text-brand-orange" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">Email Support</h4>
              <p className="text-gray-400 text-sm">support@wildmap.in</p>
            </div>
          </Card>
          <Card className="bg-[#0a0f0c]/80 backdrop-blur border-white/10 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <MapPin className="text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">Headquarters</h4>
              <p className="text-gray-400 text-sm">Bangalore, India</p>
            </div>
          </Card>
        </div>

        <Card className="bg-[#0a0f0c]/90 backdrop-blur border-white/10 p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-brand-orange" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Email</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-brand-orange" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Subject Category</label>
              <select className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-brand-orange">
                <option>General Inquiry</option>
                <option>NGO Collaboration</option>
                <option>App Feedback</option>
                <option>Account Support</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Message</label>
              <textarea rows="5" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-brand-orange" required />
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 text-sm tracking-widest"><Send size={18} className="mr-2 inline" /> Send Message</Button>
          </form>
        </Card>

      </div>
    </div>
  );
};

export default ContactUs;
