import React from 'react';

interface FormWidgetProps {
  formUrl: string;
  position?: 'left' | 'right' | 'center';
  className?: string;
}

export const FormWidget: React.FC<FormWidgetProps> = ({
  formUrl,
  position = 'center',
  className = ''
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      case 'center': return 'justify-center';
      default: return 'justify-center';
    }
  };

  return (
    <div className={`flex w-full ${getPositionClasses()} ${className}`}>
      <div className="w-full max-w-2xl glass-card p-8 rounded-3xl border border-white/5 shadow-2xl">
        <iframe 
          src={formUrl} 
          className="w-full min-h-[500px] border-none"
          title="Embedded Form"
        />
      </div>
    </div>
  );
};
