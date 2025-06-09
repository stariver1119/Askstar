import React from 'react';

// A simple component to render zodiac icons
// In a real application, you would have individual SVG files for each sign
// This is a simplified version that uses text representation

interface ZodiacIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const AriesIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♈</div>
);

export const TaurusIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♉</div>
);

export const GeminiIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♊</div>
);

export const CancerIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♋</div>
);

export const LeoIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♌</div>
);

export const VirgoIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♍</div>
);

export const LibraIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♎</div>
);

export const ScorpioIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♏</div>
);

export const SagittariusIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♐</div>
);

export const CapricornIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♑</div>
);

export const AquariusIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♒</div>
);

export const PiscesIcon: React.FC<ZodiacIconProps> = ({ width = 24, height = 24, className = '' }) => (
  <div className={`flex items-center justify-center text-white ${className}`} style={{ width, height }}>♓</div>
);
