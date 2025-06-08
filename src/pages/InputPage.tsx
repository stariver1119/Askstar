import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import StarryBackground from '../components/common/StarryBackground';
import CustomSelect from '../components/CustomSelect';

// Define zodiac signs
const zodiacSigns = [
  { value: 'aries', labelEn: 'Aries', labelKo: '양자리' },
  { value: 'taurus', labelEn: 'Taurus', labelKo: '황소자리' },
  { value: 'gemini', labelEn: 'Gemini', labelKo: '쌍둥이자리' },
  { value: 'cancer', labelEn: 'Cancer', labelKo: '게자리' },
  { value: 'leo', labelEn: 'Leo', labelKo: '사자자리' },
  { value: 'virgo', labelEn: 'Virgo', labelKo: '처녀자리' },
  { value: 'libra', labelEn: 'Libra', labelKo: '천칭자리' },
  { value: 'scorpio', labelEn: 'Scorpio', labelKo: '전갈자리' },
  { value: 'sagittarius', labelEn: 'Sagittarius', labelKo: '궁수자리' },
  { value: 'capricorn', labelEn: 'Capricorn', labelKo: '염소자리' },
  { value: 'aquarius', labelEn: 'Aquarius', labelKo: '물병자리' },
  { value: 'pisces', labelEn: 'Pisces', labelKo: '물고기자리' }
];

const InputPage = () => {
  const { t, currentLanguage } = useTranslation();
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    sunSign: '',
    moonSign: '',
    risingSign: ''
  });
  
  // Form validation
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Check form validity whenever form data changes
  useEffect(() => {
    const { name, gender, sunSign, moonSign, risingSign } = formData;
    setIsFormValid(
      name.trim() !== '' && 
      gender !== '' && 
      sunSign !== '' && 
      moonSign !== '' && 
      risingSign !== ''
    );
  }, [formData]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log('Form submitted:', formData);
      // Here you would typically navigate to the next page or process the data
    }
  };
  
  // Get zodiac options with proper language labels
  const getZodiacOptions = () => {
    return zodiacSigns.map(sign => ({
      value: sign.value,
      label: currentLanguage === 'ko' ? sign.labelKo : sign.labelEn
    }));
  };
  
  // Gender options
  const genderOptions = [
    { value: 'male', label: t('input.gender.male') },
    { value: 'female', label: t('input.gender.female') },
    { value: 'other', label: t('input.gender.other') }
  ];

  return (
    <StarryBackground>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 bg-black/20 backdrop-blur-sm">
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
          <div className="flex gap-2">
            {/* Progress dots */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl relative z-30"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-visible">
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-light text-white/90 mb-2">
                  {t('input.title')}
                </h1>
                <p className="text-white/70 mb-6">
                  {t('input.subtitle')}
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-4">
                    {/* Name input */}
                    <div className="mb-4">
                      <label className="block text-white/90 text-sm mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        {t('input.name.label')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('input.name.placeholder')}
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 text-white/90 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>

                    {/* Gender select */}
                    <CustomSelect
                      label={t('input.gender.label')}
                      placeholder={t('input.gender.placeholder')}
                      options={genderOptions}
                      value={formData.gender}
                      onChange={(value) => handleSelectChange('gender', value)}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      }
                    />

                    {/* Sun sign select */}
                    <CustomSelect
                      label={t('input.sun.label')}
                      placeholder={t('input.sun.placeholder')}
                      options={getZodiacOptions()}
                      value={formData.sunSign}
                      onChange={(value) => handleSelectChange('sunSign', value)}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      }
                    />
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    {/* Moon sign select */}
                    <CustomSelect
                      label={t('input.moon.label')}
                      placeholder={t('input.moon.placeholder')}
                      options={getZodiacOptions()}
                      value={formData.moonSign}
                      onChange={(value) => handleSelectChange('moonSign', value)}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                      }
                    />

                    {/* Rising sign select */}
                    <CustomSelect
                      label={t('input.rising.label')}
                      placeholder={t('input.rising.placeholder')}
                      options={getZodiacOptions()}
                      value={formData.risingSign}
                      onChange={(value) => handleSelectChange('risingSign', value)}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                        </svg>
                      }
                    />

                    {/* Submit button - positioned at the bottom of the right column */}
                    <div className="pt-8 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={handleBackClick}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80"
                      >
                        {t('input.back')}
                      </button>
                      
                      <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`
                          px-8 py-3 rounded-full transition-all duration-300 transform
                          ${isFormValid 
                            ? 'bg-star-gold/20 hover:bg-star-gold/30 text-white/90 border border-star-gold/30 hover:border-star-gold/50 hover:scale-105' 
                            : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'}
                        `}
                      >
                        {t('input.submit')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-1 text-white/25 font-extralight text-xs tracking-widest">
          <p>{t('main.footer')}</p>
        </footer>
      </div>
    </StarryBackground>
  );
};

export default InputPage;
