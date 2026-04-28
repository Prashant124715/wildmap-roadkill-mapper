

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-brand-dark py-8 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 tracking-widest font-mono">
        
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-brand-orange transition-colors">GH</a>
          <a href="#" className="hover:text-brand-orange transition-colors">LI</a>
          <a href="#" className="hover:text-brand-orange transition-colors">TW</a>
          <a href="#" className="hover:text-brand-orange transition-colors">IG</a>
        </div>
        
        <div className="text-center md:text-left mb-4 md:mb-0">
          Follow the conservation mission on social media.
        </div>
        
        <div>
          &copy; {new Date().getFullYear()} WILDMAP. ALL RIGHTS RESERVED.
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
