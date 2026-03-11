import React from 'react';

interface AdvancedTitleProps {
  text1?: string;
  highlightText?: string;
  text2?: string;
  textColor?: string;
  highlightColor?: string;
  className?: string;
}

export const AdvancedTitle: React.FC<AdvancedTitleProps> = ({
  text1 = '',
  highlightText = '',
  text2 = '',
  textColor = '#FFFFFF',
  highlightColor = '#F27D26',
  className = ''
}) => {
  return (
    <h1 
      className={`text-4xl md:text-6xl font-bold leading-tight ${className}`}
      style={{ color: textColor }}
    >
      {text1}
      {highlightText && (
        <span className="mx-2" style={{ color: highlightColor }}>
          {highlightText}
        </span>
      )}
      {text2}
    </h1>
  );
};
