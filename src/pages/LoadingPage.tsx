import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageContext } from '../contexts/LanguageContext';
import StarryBackground from '../components/common/StarryBackground';
import '../styles/LoadingPage.css';

const LoadingPage = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  
  // Get user data from location state
  const userData = location.state?.userData;
  
  // Progress bar duration in milliseconds
  const totalDuration = 8000; // 8 seconds
  const updateInterval = 16; // Update progress every 16ms (60fps)
  
  // Messages to display at different time points
  const messages = [
    { text: t('loading.analyzing'), emoji: '⭐' }, // 1s: "별자리 데이터를 분석하고 있어요..."
    { text: t('loading.reading'), emoji: '🔮' },   // 2-3s: "당신의 운명을 읽고 있어요..."
    { text: t('loading.completing'), emoji: '✨' } // 4-5s: "해석을 완성하고 있어요..."
  ];

  useEffect(() => {
    let timer: number | undefined;
    let startTime = Date.now();
    
    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      // Update message based on elapsed time
      if (elapsedTime < 2500) {
        setCurrentMessage(0);
      } else if (elapsedTime < 5000) {
        setCurrentMessage(1);
      } else {
        setCurrentMessage(2);
      }
      
      if (elapsedTime < totalDuration) {
        timer = window.setTimeout(updateProgress, updateInterval);
      } else {
        // Navigate to result page after loading completes with user data
        navigate('/result', {
          state: {
            userData: userData
          }
        });
      }
    };
    
    timer = window.setTimeout(updateProgress, updateInterval);
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [navigate]);
  
  return (
    <StarryBackground>
      <div className="loading-container">
        <div className="loading-title">
          <h5>{t('loading.title')}</h5>
        </div>
        
        {/* Progress bar container with messages inside */}
        <div className="progress-container">
          {/* Progress bar - The width is controlled by the progress state */}
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Message inside progress bar */}
          <div className="message-inside-bar">
            <p>{messages[currentMessage].text} {messages[currentMessage].emoji}</p>
          </div>
        </div>
      </div>
    </StarryBackground>
  );
};

export default LoadingPage;
