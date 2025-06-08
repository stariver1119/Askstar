import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import StarryBackground from './common/StarryBackground';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleAskButtonClick = () => {
    navigate('/input');
  };

  return (
    <StarryBackground>
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-4 bg-space-blue/50 backdrop-blur-sm">
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
          <div className="flex gap-6">
            <a href="#" className="nav-link">{t('main.navHome')}</a>
            <a href="#" className="nav-link">{t('main.navAbout')}</a>
            <a href="#" className="nav-link">{t('main.navGetStarted')}</a>
          </div>
        </nav>

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
