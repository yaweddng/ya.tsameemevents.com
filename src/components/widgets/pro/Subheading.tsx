import React from 'react';

interface SubheadingProps {
  text: string;
  color?: string;
  className?: string;
}

export const Subheading: React.FC<SubheadingProps> = ({
  text,
  color = '#8E9299',
  className = ''
}) => {
  return (
    <p 
      className={`text-lg md:text-xl font-medium leading-relaxed ${className}`}
      style={{ color }}
    >
      {text}
    </p>
  );
};
