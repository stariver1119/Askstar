import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import shareTranslations from '../data/sharePageTranslations.json';
import StarryBackground from '../components/common/StarryBackground';
import SharedInterpretationCard from '../components/SharedInterpretationCard';
import { getShareableResultById } from '../utils/shareUtils';
import type { ShareableResult } from '../utils/shareUtils';
import type { ZodiacSign } from '../components/ZodiacIcon';

// ZodiacType 타입 정의
type ZodiacType = 'sun' | 'moon' | 'rising';

const SharePage = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const [sharedResult, setSharedResult] = useState<ShareableResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 결과 로드
  useEffect(() => {
    if (!resultId) {
      setError('Invalid result ID');
      setLoading(false);
      return;
    }

    const result = getShareableResultById(resultId);
    if (!result) {
      setError('Result not found or expired');
      setLoading(false);
      return;
    }

    setSharedResult(result);
    setLoading(false);
  }, [resultId]);

  // 별자리 이름 가져오기
  const getZodiacName = (sign: ZodiacSign): string => {
    const zodiacMap: Record<ZodiacSign, { en: string, ko: string }> = {
      aries: { en: 'Aries', ko: '양자리' },
      taurus: { en: 'Taurus', ko: '황소자리' },
      gemini: { en: 'Gemini', ko: '쌍둥이자리' },
      cancer: { en: 'Cancer', ko: '게자리' },
      leo: { en: 'Leo', ko: '사자자리' },
      virgo: { en: 'Virgo', ko: '처녀자리' },
      libra: { en: 'Libra', ko: '천칭자리' },
      scorpio: { en: 'Scorpio', ko: '전갈자리' },
      sagittarius: { en: 'Sagittarius', ko: '궁수자리' },
      capricorn: { en: 'Capricorn', ko: '염소자리' },
      aquarius: { en: 'Aquarius', ko: '물병자리' },
      pisces: { en: 'Pisces', ko: '물고기자리' }
    };
    
    return currentLanguage === 'ko' ? zodiacMap[sign].ko : zodiacMap[sign].en;
  };
  
  // 공유 페이지 번역 가져오기
  const getShareTranslation = (key: string): string => {
    const translations = shareTranslations[currentLanguage as keyof typeof shareTranslations] || shareTranslations.en;
    return (translations as any)[key] || '';
  };
  
  // 별자리 설명 가져오기
  const getZodiacDescription = (type: ZodiacType): string => {
    const descKeys: Record<ZodiacType, string> = {
      sun: 'sunDesc',
      moon: 'moonDesc',
      rising: 'risingDesc'
    };
    
    return getShareTranslation(descKeys[type]);
  };
  
  // 별자리 타입 제목 가져오기
  const getZodiacTypeTitle = (type: ZodiacType): string => {
    const titleKeys: Record<ZodiacType, string> = {
      sun: 'sunTitle',
      moon: 'moonTitle',
      rising: 'risingTitle'
    };
    
    return getShareTranslation(titleKeys[type]);
  };

  // 테스트 시작 핸들러
  const handleStartTest = () => {
    navigate('/input');
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // 에러 발생
  if (error || !sharedResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-900 p-6 text-center">
        <h1 className="text-2xl text-white mb-6">{getShareTranslation('expired')}</h1>
        <Link to="/input" className="px-8 py-3 bg-star-gold/20 hover:bg-star-gold/30 text-white/90 rounded-full border border-star-gold/30 hover:border-star-gold/50 hover:scale-105 transition-all duration-300 transform inline-block">
          {getShareTranslation('startTest')}
        </Link>
      </div>
    );
  }

  return (
    <StarryBackground scrollable={true}>
      <div className="min-h-screen flex flex-col py-8 px-4">
        <div className="max-w-md mx-auto w-full">
          <motion.h1 
            className="text-2xl text-white text-center mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getShareTranslation('title').replace('{name}', sharedResult.userData.name)}
          </motion.h1>
          
          <motion.p 
            className="text-white/70 text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {getShareTranslation('subtitle')}
          </motion.p>

          {/* 공유된 해석 카드 */}
          <div className="mb-6 space-y-6">
            <SharedInterpretationCard
              type="sun"
              sign={sharedResult.userData.sunSign}
              signName={getZodiacName(sharedResult.userData.sunSign)}
              description={getZodiacDescription('sun')}
              title={getZodiacTypeTitle('sun')}
              summary={sharedResult.interpretations.sun}
              delay={0.3}
            />
            
            <SharedInterpretationCard
              type="moon"
              sign={sharedResult.userData.moonSign}
              signName={getZodiacName(sharedResult.userData.moonSign)}
              description={getZodiacDescription('moon')}
              title={getZodiacTypeTitle('moon')}
              summary={sharedResult.interpretations.moon}
              delay={0.5}
            />
            
            <SharedInterpretationCard
              type="rising"
              sign={sharedResult.userData.risingSign}
              signName={getZodiacName(sharedResult.userData.risingSign)}
              description={getZodiacDescription('rising')}
              title={getZodiacTypeTitle('rising')}
              summary={sharedResult.interpretations.rising}
              delay={0.7}
            />
          </div>

          <motion.div
            className="mt-10 mb-10 p-6 bg-purple-800/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h3 className="text-xl text-white mb-3">{getShareTranslation('curious')}</h3>
            <p className="text-white/80 mb-4">
              {getShareTranslation('curiousDesc')}
            </p>
            <Link to="/input" className="px-8 py-3 bg-star-gold/20 hover:bg-star-gold/30 text-white/90 rounded-full border border-star-gold/30 hover:border-star-gold/50 hover:scale-105 transition-all duration-300 transform inline-block">
              {getShareTranslation('discover')}
            </Link>
          </motion.div>
          
          <footer className="text-center py-4 text-white/25 font-extralight text-xs tracking-widest w-full">
            <p>© 2025 askstar. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </StarryBackground>
  );
};

export default SharePage;
