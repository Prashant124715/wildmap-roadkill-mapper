import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Heart, MapPin, Mail, Globe, Code, Briefcase, Camera } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-dark pt-16 pb-8 border-t border-white/5 overflow-hidden">
      {/* Ambient Background Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="WILDMAP Logo" className="h-10 w-auto group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h2 className="text-xl font-cinematic font-bold tracking-widest text-white leading-none">WILDMAP</h2>
                <span className="text-[10px] text-brand-orange tracking-widest uppercase font-bold">{t('navbar.conservationIntelligence')}</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex items-center gap-4">
              <SocialLink icon={Code} href="#" />
              <SocialLink icon={Briefcase} href="#" />
              <SocialLink icon={Globe} href="#" />
              <SocialLink icon={Camera} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">{t('navbar.explore')}</h3>
            <ul className="space-y-4">
              <FooterLink to="/map" label={t('navbar.wildlifeRiskMap')} />
              <FooterLink to="/biodiversity" label={t('navbar.biodiversityInsights')} />
              <FooterLink to="/gallery" label={t('navbar.wildlifeGallery')} />
              <FooterLink to="/resources" label={t('navbar.conservationResources')} />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">{t('navbar.reports')}</h3>
            <ul className="space-y-4">
              <FooterLink to="/reports/incident" label={t('navbar.reportIncident')} />
              <FooterLink to="/reports/conflict-support" label={t('navbar.conflictSupport')} />
              <FooterLink to="/reports/contact" label={t('navbar.contactSupport')} />
              <FooterLink to="/about" label={t('navbar.about')} />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">{t('reporting.contactUs')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-400 group">
                <MapPin size={18} className="text-brand-orange shrink-0 mt-0.5" />
                <span className="text-sm group-hover:text-white transition-colors">India Conservation Hub, Maharashtra</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 group">
                <Mail size={18} className="text-brand-orange shrink-0" />
                <span className="text-sm group-hover:text-white transition-colors">support@wildmap.org</span>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-lightGreen/10 flex items-center justify-center border border-brand-lightGreen/20">
                  <Shield size={18} className="text-brand-lightGreen" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Secure Platform</p>
                  <p className="text-[11px] text-white font-medium">SSL Encrypted Hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
            © {currentYear} WILDMAP. {t('footer.allRightsReserved')}
          </p>
          
          <div className="flex items-center gap-6 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
            <Link to="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-orange">
              <Heart size={10} fill="currentColor" />
              <span>For Wildlife</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon: Icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);

const FooterLink = ({ to, label }) => (
  <li>
    <Link 
      to={to} 
      className="text-sm text-gray-400 hover:text-brand-orange hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-300"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/40 scale-0 group-hover:scale-100 transition-transform" />
      {label}
    </Link>
  </li>
);

export default Footer;
