import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, AlertCircle, PhoneCall, ShieldAlert, Heart, Car, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import emergencyContacts from '../data/emergencyContacts.json';

const Resources = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center space-x-2 border border-brand-orange/30 px-3 py-1 rounded-full mb-6 bg-brand-orange/5">
            <ShieldAlert size={14} className="text-brand-orange" />
            <span className="text-[10px] text-brand-orange uppercase tracking-[0.2em]">{t('resources.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-hero font-bold mb-4 text-white uppercase">{t('resources.title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            {t('resources.subtitle')}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Laws & Penalties */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <Scale className="text-brand-orange" size={20} />
                </div>
                <h3 className="text-lg font-hero font-bold text-white uppercase tracking-widest">{t('resources.lawsTitle')}</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">{t('resources.act1972')}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t('resources.actDesc')}
                  </p>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} /> {t('resources.penaltiesTitle')}
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{t('resources.penalty1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{t('resources.penalty2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{t('resources.penalty3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Middle Column: Action Plan */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10 h-full border-t-4 border-t-brand-orange">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <AlertCircle className="text-brand-orange" size={20} />
                </div>
                <h3 className="text-lg font-hero font-bold text-white uppercase tracking-widest">{t('resources.actionTitle')}</h3>
              </div>
              
              <p className="text-xs text-gray-400 mb-6 italic">{t('resources.actionSubtitle')}</p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-xs font-bold text-brand-orange shrink-0">1</div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('resources.step1Title')}</h4>
                    <p className="text-xs text-gray-400">{t('resources.step1Desc')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-xs font-bold text-brand-orange shrink-0">2</div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('resources.step2Title')}</h4>
                    <p className="text-xs text-gray-400">{t('resources.step2Desc')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-xs font-bold text-brand-orange shrink-0">3</div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('resources.step3Title')}</h4>
                    <p className="text-xs text-gray-400">{t('resources.step3Desc')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-xs font-bold text-brand-orange shrink-0">4</div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('resources.step4Title')}</h4>
                    <p className="text-xs text-gray-400">{t('resources.step4Desc')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link to="/contact">
                  <Button variant="primary" icon={ArrowRight} className="w-full text-xs">
                    {t('hero.reportIncident').toUpperCase()}
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Helplines & Prevention */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            
            {/* Helplines */}
            <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-lightGreen/20 flex items-center justify-center">
                  <PhoneCall className="text-brand-lightGreen" size={20} />
                </div>
                <h3 className="text-lg font-hero font-bold text-white uppercase tracking-widest">{t('resources.emergencyTitle')}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/40 p-3 rounded border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">{t('resources.nationalEmergency')}</h4>
                    <p className="text-[10px] text-gray-500">{t('alerts.info')}</p>
                  </div>
                  <span className="text-lg font-mono text-brand-orange font-bold">{emergencyContacts.national_emergency}</span>
                </div>
                
                <div className="bg-black/40 p-3 rounded border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <h4 className="text-xs font-bold text-white uppercase">{t('resources.wildlifeBureau')}</h4>
                    <span className="text-xs font-mono text-brand-orange font-bold">{emergencyContacts.wildlife_crime_control_bureau}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{t('mission.drivePolicy.desc')}</p>
                </div>
                
                <div className="bg-black/40 p-3 rounded border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <h4 className="text-xs font-bold text-white uppercase">{t('resources.animalBoard')}</h4>
                    <span className="text-xs font-mono text-brand-orange font-bold">{emergencyContacts.animal_welfare_board}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{t('mission.saveLives.desc')}</p>
                </div>

                <div className="bg-black/40 p-3 rounded border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <h4 className="text-xs font-bold text-white uppercase">{t('resources.forestDept')}</h4>
                    <span className="text-xs font-mono text-brand-orange font-bold text-right w-1/2">{emergencyContacts.local_forest_department}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{t('common.search')}</p>
                </div>
              </div>
            </Card>

            {/* Prevention */}
            <Card className="bg-brand-dark/80 backdrop-blur-xl border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Car className="text-blue-500" size={20} />
                </div>
                <h3 className="text-lg font-hero font-bold text-white uppercase tracking-widest">{t('resources.preventionTitle')}</h3>
              </div>
              
              <ul className="text-xs text-gray-400 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>{t('resources.preventionTip1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>{t('resources.preventionTip2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>{t('resources.preventionTip3')}</span>
                </li>
              </ul>
            </Card>

          </motion.div>
        </div>

      </div>

      {/* Footer Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-r from-brand-dark via-[#1a4225] to-brand-dark border-y border-white/10 py-12 text-center"
      >
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
          <Heart size={32} className="text-brand-lightGreen mb-4" />
          <h3 className="text-2xl font-hero font-bold text-white uppercase mb-4">{t('resources.footerTitle')}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {t('resources.footerDesc')}
          </p>
        </div>
      </motion.div>

    </div>
  );
};

export default Resources;
