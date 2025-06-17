import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StarryBackground from './common/StarryBackground';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const handleAskButtonClick = () => {
    navigate('/input');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <StarryBackground>
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-4 bg-space-blue/50 backdrop-blur-sm relative z-20">
          <div className="w-32">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-2xl font-extralight text-white/90 typing-animation logo-text"
            >
              Askstar
            </motion.div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <a href="#" className="nav-link">{t('main.navHome')}</a>
            <a href="#" className="nav-link">{t('main.navAbout')}</a>
            <a href="#" className="nav-link">{t('main.navGetStarted')}</a>
          </div>
          
          {/* Mobile Menu Toggle Button */}
          {isMobile && (
            <button 
              onClick={toggleMobileMenu} 
              className="md:hidden text-white/90 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-center items-center"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 2 }
                  }}
                  className="w-5 h-0.5 bg-white/90 block mb-1 transform origin-center"
                ></motion.span>
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="w-5 h-0.5 bg-white/90 block mb-1"
                ></motion.span>
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -2 }
                  }}
                  className="w-5 h-0.5 bg-white/90 block transform origin-center"
                ></motion.span>
              </motion.div>
            </button>
          )}
        </nav>
        
        {/* Mobile Menu Overlay */}
        {isMobile && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMobileMenuOpen ? 1 : 0,
              height: isMobileMenuOpen ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-space-blue/90 backdrop-blur-md w-full overflow-hidden z-10 relative"
          >
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col items-center py-4 gap-4"
              >
                <a href="#" className="nav-link text-lg py-2">{t('main.navHome')}</a>
                <a href="#" className="nav-link text-lg py-2">{t('main.navAbout')}</a>
                <a href="#" className="nav-link text-lg py-2">{t('main.navGetStarted')}</a>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-light mb-10 text-center tracking-wider leading-relaxed text-white/90"
            >
              {t('main.title')}
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-lg font-light mb-10 text-center tracking-wider leading-relaxed text-white/90"
            >
              {t('main.description')}
            </motion.p>

            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleAskButtonClick}
              className="px-8 py-3 bg-star-gold/20 hover:bg-star-gold/30 rounded-full transition-colors duration-300 text-white/90 border border-star-gold/30 hover:border-star-gold/50 text-lg"
            >
              {t('main.askButton')}
            </motion.button>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-white/25 font-extralight text-xs tracking-widest w-full">
          <p>{t('main.footer')}</p>
        </footer>
      </div>
    </StarryBackground>
  );
};

export default Home;
