import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import StarryBackground from '../components/common/StarryBackground';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <StarryBackground scrollable={true}>
      <div className="flex flex-col min-h-screen w-full overflow-auto">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 bg-black/20 backdrop-blur-sm">
          <div className="w-32">
            <button 
              onClick={handleBackClick}
              className="text-white hover:text-purple-300 transition-colors"
            >
              ← {t('main.navHome')}
            </button>
          </div>
          <div className="text-center text-white text-lg font-medium">
            {t('main.navAbout')}
          </div>
          <div className="w-32"></div>
        </nav>

        {/* Main content */}
        <motion.div 
          className="container mx-auto px-4 pt-24 pb-16 text-white max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-purple-200">
              {t('about.title')}
            </h1>
            <p className="text-lg mb-4">{t('about.greeting')}</p>
            <p className="mb-4">
              {t('about.intro')}
            </p>
            <p className="mb-4">
              {t('about.ascendantExplanation')}
            </p>
            <p className="text-xl font-medium mt-6 mb-4 text-center italic">
              {t('about.question')}
            </p>
            <p className="mb-4">
              {t('about.motivation')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-200">
              {t('about.big3Title')}
            </h2>
            
            <div className="bg-white/5 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-yellow-300">
                {t('about.sunSignTitle')}
              </h3>
              <p className="mb-4">
                {t('about.sunSignDesc')}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-300">
                {t('about.moonSignTitle')}
              </h3>
              <p className="mb-4">
                {t('about.moonSignDesc')}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-purple-300">
                {t('about.ascendantTitle')}
              </h3>
              <p className="mb-4">
                {t('about.ascendantDesc')}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-200">
              {t('about.experienceTitle')}
            </h2>
            <p className="mb-4">
              {t('about.experienceDesc1')}
            </p>
            <p className="mb-8">
              {t('about.experienceDesc2')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <button 
              onClick={() => navigate('/input')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white font-bold text-lg hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              {t('about.startButton')}
            </button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-white/60 text-sm">
          {t('main.footer')}
        </footer>
      </div>
    </StarryBackground>
  );
};

export default AboutPage;
