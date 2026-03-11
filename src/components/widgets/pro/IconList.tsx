import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CTAButton } from './CTAButton';

interface IconListItem {
  id: string;
  icon: string;
  url: string;
  label?: string;
  color?: string;
}

interface IconListProps {
  items: IconListItem[];
  direction?: 'horizontal' | 'vertical';
  position?: 'left' | 'right' | 'center';
  extraFields?: {
    title?: string;
    subtitle?: string;
    cta?: {
      text: string;
      url: string;
      style: any;
    };
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
  className?: string;
}

export const IconList: React.FC<IconListProps> = ({
  items = [],
  direction = 'horizontal',
  position = 'center',
  extraFields,
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

  const renderIcon = (item: IconListItem) => {
    const Icon = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
    return (
      <a 
        key={item.id}
        href={item.url}
        className="p-3 bg-white/5 rounded-xl hover:bg-brand hover:text-dark transition-all group"
        title={item.label}
      >
        <Icon size={20} style={{ color: item.color }} className="group-hover:text-dark transition-colors" />
      </a>
    );
  };

  const listContent = (
    <div className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} gap-4 ${getPositionClasses()}`}>
      {items.map(renderIcon)}
    </div>
  );

  if (extraFields) {
    const { title, subtitle, cta, position: extraPos = 'top' } = extraFields;
    const isVertical = extraPos === 'left' || extraPos === 'right';

    return (
      <div className={`flex ${isVertical ? 'flex-row' : 'flex-col'} gap-8 items-center ${getPositionClasses()} ${className}`}>
        {(extraPos === 'top' || extraPos === 'left') && (
          <div className="space-y-4 max-w-md">
            {title && <h3 className="text-2xl font-bold">{title}</h3>}
            {subtitle && <p className="text-gray-400">{subtitle}</p>}
            {cta && <CTAButton {...cta} />}
          </div>
        )}
        
        {listContent}

        {(extraPos === 'bottom' || extraPos === 'right') && (
          <div className="space-y-4 max-w-md">
            {title && <h3 className="text-2xl font-bold">{title}</h3>}
            {subtitle && <p className="text-gray-400">{subtitle}</p>}
            {cta && <CTAButton {...cta} />}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full flex ${getPositionClasses()} ${className}`}>
      {listContent}
    </div>
  );
};
