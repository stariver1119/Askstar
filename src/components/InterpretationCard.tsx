import React from 'react';
import { motion } from 'framer-motion';
import type { ZodiacSign, ZodiacType } from './ZodiacIcon';

interface InterpretationCardProps {
  type: ZodiacType;
  sign: ZodiacSign;
  title: string;
  content: string;
  isGenderSpecific?: boolean;
  delay?: number;
}

const InterpretationCard: React.FC<InterpretationCardProps> = ({
  type,
  title,
  content,
  isGenderSpecific = false,
  delay = 0
}) => {
  // Define colors based on type
  const colors = {
    sun: 'bg-sky-500/10 border-sky-400/30',
    moon: 'bg-indigo-700/10 border-indigo-500/30',
    rising: 'bg-purple-600/10 border-purple-400/30'
  };

  // Split content into sentences for better readability
  const sentences = content
    .split(/(?<=\.)\s+/) // Split by period followed by whitespace
    .filter(sentence => sentence.trim().length > 0); // Remove empty sentences

  return (
    <motion.div
      className={`rounded-xl ${colors[type]} backdrop-blur-sm border p-5 h-auto min-h-[200px] flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <h3 className="text-lg font-medium text-white/90 mb-3 flex items-center">
        {title}
      </h3>
      <div className="flex-1 overflow-y-auto">
        <ul className={`text-white/80 ${isGenderSpecific ? 'italic' : ''} space-y-2 list-none pl-1`}>
          {sentences.map((sentence, index) => (
            <li key={index} className="leading-relaxed flex items-start">
              <svg className="w-2.5 h-2.5 mt-1.5 mr-1.5 text-white/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>{sentence.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default InterpretationCard;
