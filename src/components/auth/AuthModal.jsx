import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const AuthModal = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [authType, setAuthType] = useState('user'); // 'user' or 'admin'
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    let result;
    if (isLogin) {
      result = login(formData.email, formData.password);
    } else {
      if (!formData.name) {
        setError('Name is required');
        return;
      }
      result = signup(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      closeAuthModal();
      setFormData({ name: '', email: '', password: '' });
      
      // Auto-redirect to admin panel if logging in as admin
      if (formData.email === 'admin@wildmap.in') {
        navigate('/admin');
      }
    } else {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-orange/20 rounded-full blur-[50px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-lightGreen/20 rounded-full blur-[50px]" />

          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="relative z-10">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
              <button
                onClick={() => { setAuthType('user'); setIsLogin(true); }}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${authType === 'user' ? 'text-brand-orange' : 'text-gray-500 hover:text-white'}`}
              >
                Citizen Portal
              </button>
              <button
                onClick={() => { 
                  setAuthType('admin'); 
                  setIsLogin(true); 
                  setFormData({ name: '', email: 'admin@wildmap.in', password: 'admin123' });
                }}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${authType === 'admin' ? 'text-brand-orange' : 'text-gray-500 hover:text-white'}`}
              >
                Admin Portal
              </button>
            </div>

            <h2 className="text-2xl font-hero font-bold text-white mb-2 uppercase tracking-wide">
              {authType === 'admin' ? 'Admin Access' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {authType === 'admin' 
                ? 'Sign in to access the verification dashboard and analytics.' 
                : isLogin 
                  ? 'Sign in to report incidents and track your submissions.' 
                  : 'Join the conservation network and start reporting.'}
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs px-3 py-2 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && authType === 'user' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-brand-orange transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-brand-orange transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-brand-orange transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full">
                  {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                </Button>
              </div>
            </form>

            {authType === 'user' && (
              <div className="mt-6 text-center">
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
