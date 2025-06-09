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

  return (
    <motion.div
      className={`rounded-xl ${colors[type]} backdrop-blur-sm border p-5 h-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <h3 className="text-lg font-medium text-white/90 mb-3 flex items-center">
        {title}
      </h3>
      <p className={`text-white/80 ${isGenderSpecific ? 'italic' : ''}`}>
        {content}
      </p>
    </motion.div>
  );
};

export default InterpretationCard;
