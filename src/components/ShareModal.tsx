import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

// 공유 옵션 타입 정의
type ShareOption = {
  id: string;
  name: string;
  icon: string;
  action: (url: string) => void;
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
  const { t } = useTranslation();

  // 클립보드에 URL 복사 함수
  const copyToClipboard = async (url: string) => {
    try {
      // 최신 Clipboard API 사용 시도
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        alert(t('shareModal.copied'));
        onClose(); // 복사 후 모달 닫기
        return;
      } 
      // 레거시 방식 사용 (일부 브라우저에서만 작동)
      else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          alert(t('shareModal.copied'));
          onClose(); // 복사 후 모달 닫기
        } else {
          alert(`${t('shareModal.copyFailed')}\n${url}`);
        }
      }
    } catch (err) {
      alert(`${t('shareModal.copyFailed')}\n${url}`);
    }
  };

  // 공유 옵션 정의 - 현재는 링크 복사만 표시
  const shareOptions: ShareOption[] = [
    {
      id: 'copy',
      name: t('shareModal.copyLink'),
      icon: '📋',
      action: copyToClipboard
    }
    // 아래 옵션들은 임시로 제거됨 (추후 다시 활성화 가능)
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 모달 */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-space-blue-900 rounded-t-2xl p-6 z-50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">
                {t('shareModal.title')}
              </h3>
              <button 
                onClick={onClose}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="flex justify-center items-center">
              {shareOptions.map(option => (
                <button
                  key={option.id}
                  className="flex flex-col items-center"
                  onClick={() => option.action(shareUrl)}
                >
                  <div className="w-16 h-16 rounded-full bg-purple-700/30 flex items-center justify-center text-3xl mb-3">
                    {option.icon}
                  </div>
                  <span className="text-sm text-white/90">{option.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 카카오톡 SDK 타입 정의
declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      Link: {
        sendDefault: (options: any) => void;
      };
    };
  }
}

export default ShareModal;
