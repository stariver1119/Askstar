import React from 'react';
import { motion } from 'framer-motion';
import type { ZodiacSign, ZodiacType } from './ZodiacIcon';
import ZodiacIcon from './ZodiacIcon';

interface SharedInterpretationCardProps {
  type: ZodiacType;
  sign: ZodiacSign;
  title: string;
  summary: string;
  signName?: string; // 별자리 이름 (선택적)
  description?: string; // 별자리 설명 (선택적)
  delay?: number;
}

const SharedInterpretationCard: React.FC<SharedInterpretationCardProps> = ({
  type,
  sign,
  title,
  summary,
  signName,
  description,
  delay = 0
}) => {
  // 타입에 따른 색상 정의
  const colors = {
    sun: 'bg-sky-500/10 border-sky-400/30',
    moon: 'bg-indigo-700/10 border-indigo-500/30',
    rising: 'bg-purple-600/10 border-purple-400/30'
  };

  // 요약 문장을 1-2개로 제한
  const limitedSummary = summary
    .split(/(?<=\.)\s+/) // 마침표 뒤 공백으로 분리
    .filter(sentence => sentence.trim().length > 0) // 빈 문장 제거
    .slice(0, 2) // 처음 2개 문장만 사용
    .join(' '); // 다시 합치기
    
  // 별자리 이름이 없으면 sign 값을 사용
  const displaySignName = signName || sign;

  return (
    <motion.div
      className={`rounded-xl ${colors[type]} backdrop-blur-sm border p-4 mb-4 w-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-lg font-medium text-white/90 mb-4 text-center">
        {title}
      </h3>
      
      <div className="flex flex-col items-center space-y-6">
        {/* 일러스트레이션 영역 */}
        <div className="flex justify-center mb-2">
          <ZodiacIcon 
            type={type} 
            sign={sign} 
            className="mx-auto" 
          />
        </div>
        
        {/* 별자리 이름 및 설명 영역 */}
        <div className="text-center">
          <div className="text-md text-white/80 font-medium">
            {displaySignName}
          </div>
          {description && (
            <div className="text-xs text-white/60 mt-1">
              {description}
            </div>
          )}
        </div>
        
        {/* 요약 텍스트 영역 */}
        <div className="w-full mt-4">
          <p className="text-white/80 text-sm leading-relaxed text-left">
            {limitedSummary}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SharedInterpretationCard;
