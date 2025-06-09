import React from 'react';
import { motion } from 'framer-motion';

// Import all zodiac sign icons
import { AriesIcon } from './icons/AriseIcon';
import { TaurusIcon } from './icons/TaurusIcon';
import { GeminiIcon } from './icons/GeminiIcon';
import { CancerIcon } from './icons/CancerIcon';
import { LeoIcon } from './icons/LeoIcon';
import { VirgoIcon } from './icons/VirgoIcon';
import { LibraIcon } from './icons/LibraIcon';
import { ScorpioIcon } from './icons/ScorpioIcon';
import { SagittariusIcon } from './icons/SagittariusIcon';
import { CapricornIcon } from './icons/CapricornIcon';
import { AquariusIcon } from './icons/AquariusIcon';
import { PiscesIcon } from './icons/PiscesIcon';

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type ZodiacType = 'sun' | 'moon' | 'rising';

interface ZodiacIconProps {
  sign: ZodiacSign;
  type: ZodiacType;
  size?: number;
  className?: string;
}

const ZodiacIcon: React.FC<ZodiacIconProps> = ({ sign, type, size = 64, className = '' }) => {
  // Define colors based on type
  const colors = {
    sun: 'bg-sky-500/30 border-sky-400/50',
    moon: 'bg-indigo-700/30 border-indigo-500/50',
    rising: 'bg-purple-600/30 border-purple-400/50'
  };

  // Define animations based on type
  const animations = {
    sun: {
      initial: { scale: 0.8, opacity: 0.5 },
      animate: { 
        scale: 1, 
        opacity: 1,
        boxShadow: ['0px 0px 0px rgba(56, 189, 248, 0)', '0px 0px 20px rgba(56, 189, 248, 0.6)', '0px 0px 0px rgba(56, 189, 248, 0)'],
      },
      transition: { 
        duration: 2,
        boxShadow: {
          repeat: Infinity,
          duration: 3
        }
      }
    },
    moon: {
      initial: { opacity: 0.3 },
      animate: { 
        opacity: [0.3, 1, 0.3],
      },
      transition: { 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    rising: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { 
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  // Get the correct icon component based on sign
  const getZodiacIcon = () => {
    switch (sign) {
      case 'aries': return <AriesIcon width={size} height={size} />;
      case 'taurus': return <TaurusIcon width={size} height={size} />;
      case 'gemini': return <GeminiIcon width={size} height={size} />;
      case 'cancer': return <CancerIcon width={size} height={size} />;
      case 'leo': return <LeoIcon width={size} height={size} />;
      case 'virgo': return <VirgoIcon width={size} height={size} />;
      case 'libra': return <LibraIcon width={size} height={size} />;
      case 'scorpio': return <ScorpioIcon width={size} height={size} />;
      case 'sagittarius': return <SagittariusIcon width={size} height={size} />;
      case 'capricorn': return <CapricornIcon width={size} height={size} />;
      case 'aquarius': return <AquariusIcon width={size} height={size} />;
      case 'pisces': return <PiscesIcon width={size} height={size} />;
      default: return <div>Invalid Sign</div>;
    }
  };

  return (
    <motion.div
      className={`rounded-full flex items-center justify-center border ${colors[type]} p-4 ${className}`}
      style={{ width: size * 1.5, height: size * 1.5 }}
      initial={animations[type].initial}
      animate={animations[type].animate}
      transition={animations[type].transition}
    >
      {getZodiacIcon()}
    </motion.div>
  );
};

export default ZodiacIcon;
