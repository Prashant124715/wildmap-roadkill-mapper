import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-white/10 bg-brand-dark py-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 tracking-widest font-mono">
        
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-brand-orange transition-colors">GH</a>
          <a href="#" className="hover:text-brand-orange transition-colors">LI</a>
          <a href="#" className="hover:text-brand-orange transition-colors">TW</a>
          <a href="#" className="hover:text-brand-orange transition-colors">IG</a>
        </div>
        
        <div className="text-center md:text-left mb-4 md:mb-0 uppercase">
          {t('footer.followMission')}
        </div>
        
        <div className="uppercase">
          &copy; {new Date().getFullYear()} WILDMAP. {t('footer.allRightsReserved')}
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
