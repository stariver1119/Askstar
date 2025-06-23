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
              🌟 별에 묻다(Askstar)를 소개합니다
            </h1>
            <p className="text-lg mb-4">안녕하세요, 개발자입니다</p>
            <p className="mb-4">
              '별에 묻다'는 한국의 한 TV프로그램에서 점성술사가 '어센던트'를 언급하는 것을 보고 시작된 프로젝트입니다.
            </p>
            <p className="mb-4">
              어센던트란 태어난 순간 동쪽 지평선에서 떠오르던 별자리로, 하늘과 땅의 기운을 모두 받는 특별한 의미를 가집니다. 
              이는 우리가 일반적으로 알고 있던 생일 기준의 별자리와는 완전히 다른 해석이었습니다.
            </p>
            <p className="text-xl font-medium mt-6 mb-4 text-center italic">
              "그렇다면 내 별자리에도 여러 해석이 존재할 수 있겠다?"
            </p>
            <p className="mb-4">
              이런 호기심에서 시작해 알아보니, 단 3개의 기준만 추가해도 별자리로 보는 나에 대한 설명이 훨씬 풍부해진다는 점에 매료되어 이 사이트를 만들게 되었습니다.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-200">
              🌙 Big 3: 나를 이해하는 세 가지 별자리
            </h2>
            
            <div className="bg-white/5 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-yellow-300">
                ☀️ 태양궁 - 우리의 중심, 외적인 성격
              </h3>
              <p className="mb-4">
                태양궁은 우리가 태어난 날, 태양이 하늘에서 위치한 별자리입니다. 흔히 말하는 별자리 운세에서 "내 별자리"가 바로 태양궁을 의미해요. 
                태양궁은 우리의 외적인 성격과 인생의 큰 방향성을 보여줍니다.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-300">
                🌙 달궁 - 내면의 나, 감정과 감수성
              </h3>
              <p className="mb-4">
                달궁은 태어난 순간 하늘에서 "달"이 위치한 별자리입니다. 태양궁이 외적인 성격을 나타낸다면, 
                달궁은 우리가 숨기고 있는 내면의 감정을 나타내요. 쉽게 말해, "내가 혼자 있을 때, 또는 친한 사람들 앞에서만 드러나는 진짜 모습"이 
                바로 달궁과 관련이 있습니다.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-purple-300">
                ⭐ 어센던트(상승궁) - 남들이 보는 나의 모습
              </h3>
              <p className="mb-4">
                어센던트는 당신이 태어난 순간 동쪽 지평선에서 떠오르던 별자리입니다. 하늘과 땅의 기운을 모두 받게 되는 상승궁은 
                요즘 특히 중요하게 여겨지는 별자리예요. 태양궁으로 나타나는 자아 위에 덧씌워지는 가면, 나의 겉모습과도 같은 별자리이기 때문입니다. 
                즉, 남들이 보는 나의 첫인상과 외적 이미지를 의미합니다.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-200">
              ✨ 별에게 묻는 듯한 신비로운 경험
            </h2>
            <p className="mb-4">
              '별에 묻다'는 단순한 점성술 분석을 넘어, 마치 실제로 별에게 이야기를 듣는 것 같은 신비한 경험을 제공합니다. 
              우주의 신비로움과 점성술의 깊이를 담은 UI와 브랜딩으로, 여러분만의 특별한 별자리 이야기를 들려드려요.
            </p>
            <p className="mb-8">
              당신의 Big 3를 통해 더 깊고 풍부한 자신의 모습을 발견해보세요. 별들이 들려주는 당신만의 이야기가 기다리고 있습니다.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <button 
              onClick={() => navigate('/input')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white font-bold text-lg hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              🌟 지금 바로 시작해서 당신만의 별자리 이야기를 들어보세요
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
