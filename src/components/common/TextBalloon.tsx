import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextBalloonProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  offset?: number;
  className?: string;
}

/**
 * TextBalloon component - A reusable tooltip/balloon component that appears on hover
 * 
 * @param text - The text to display in the balloon
 * @param children - The element that triggers the balloon on hover
 * @param position - Position of the balloon relative to the children (default: 'top')
 * @param delay - Delay in milliseconds before showing the balloon (default: 200ms)
 * @param offset - Distance in pixels from the trigger element (default: 10px)
 * @param className - Additional CSS classes for the balloon
 */
const TextBalloon: React.FC<TextBalloonProps> = ({
  text,
  children,
  position = 'top',
  delay = 200,
  offset = 10,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // Position styles based on the position prop
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      zIndex: 50,
      whiteSpace: 'nowrap' as const,
    };
    
    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: offset,
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: offset,
        };
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: offset,
        };
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: offset,
        };
      default:
        return baseStyles;
    }
  };

  // Animation variants based on position
  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: {
        opacity: 0,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.2,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.1,
        },
      },
    };

    switch (position) {
      case 'top':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: 10 },
          visible: { ...baseVariants.visible, y: 0 },
          exit: { ...baseVariants.exit, y: 10 },
        };
      case 'bottom':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: -10 },
          visible: { ...baseVariants.visible, y: 0 },
          exit: { ...baseVariants.exit, y: -10 },
        };
      case 'left':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: 10 },
          visible: { ...baseVariants.visible, x: 0 },
          exit: { ...baseVariants.exit, x: 10 },
        };
      case 'right':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: -10 },
          visible: { ...baseVariants.visible, x: 0 },
          exit: { ...baseVariants.exit, x: -10 },
        };
      default:
        return baseVariants;
    }
  };

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    if (delayHandler) clearTimeout(delayHandler);
    const handler = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setDelayHandler(handler);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (delayHandler) clearTimeout(delayHandler);
    setIsVisible(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (delayHandler) clearTimeout(delayHandler);
    };
  }, [delayHandler]);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`px-3 py-1.5 bg-black/80 backdrop-blur-md text-white/90 text-sm rounded-lg shadow-lg ${className}`}
            style={getPositionStyles()}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={getAnimationVariants()}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextBalloon;
