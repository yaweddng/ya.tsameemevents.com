import React from 'react';

interface BadgeTitleProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export const BadgeTitle: React.FC<BadgeTitleProps> = ({ 
  text, 
  bgColor = '#F27D26', 
  textColor = '#141414',
  className = ''
}) => {
  return (
    <div 
      className={`inline-block px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {text}
    </div>
  );
};
