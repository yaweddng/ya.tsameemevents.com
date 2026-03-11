import React from 'react';
import * as LucideIcons from 'lucide-react';

type ButtonStyle = 'solid' | 'transparent' | 'glassmorphism' | 'border' | 'inline' | 'floating' | 'advanced';

interface CTAButtonProps {
  style?: ButtonStyle;
  text?: string;
  url?: string;
  bgColor?: string;
  textColor?: string;
  icon1?: string;
  icon2?: string;
  iconColor?: string;
  className?: string;
  responsivePosition?: {
    desktop: 'center' | 'left' | 'right';
    tablet: 'center' | 'left' | 'right';
    mobile: 'center' | 'left' | 'right';
  };
  floatingPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'bottom-center' | 'top-center';
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  style = 'solid',
  text = 'Click Here',
  url = '#',
  bgColor = '#F27D26',
  textColor = '#141414',
  icon1 = '',
  icon2 = '',
  iconColor = '#141414',
  className = '',
  responsivePosition = { desktop: 'center', tablet: 'left', mobile: 'left' },
  floatingPosition = 'bottom-left'
}) => {
  const Icon1 = icon1 ? (LucideIcons as any)[icon1] : null;
  const Icon2 = icon2 ? (LucideIcons as any)[icon2] : null;

  const getStyleClasses = () => {
    switch (style) {
      case 'solid':
        return 'px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand/20';
      case 'transparent':
        return 'px-8 py-4 rounded-2xl font-bold transition-all hover:bg-white/5';
      case 'glassmorphism':
        return 'px-8 py-4 rounded-2xl font-bold transition-all backdrop-blur-md border border-white/10 hover:bg-white/10';
      case 'border':
        return 'px-8 py-4 rounded-2xl font-bold transition-all border-2 border-brand hover:bg-brand hover:text-dark';
      case 'inline':
        return 'font-bold transition-all hover:opacity-80 flex items-center gap-2 underline underline-offset-4';
      case 'floating':
        return 'fixed z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90';
      case 'advanced':
        return 'px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 hover:scale-105 active:scale-95';
      default:
        return '';
    }
  };

  const getPositionClasses = () => {
    if (style === 'floating') {
      switch (floatingPosition) {
        case 'bottom-left': return 'bottom-8 left-8';
        case 'bottom-right': return 'bottom-8 right-8';
        case 'top-left': return 'top-8 left-8';
        case 'top-right': return 'top-8 right-8';
        case 'bottom-center': return 'bottom-8 left-1/2 -translate-x-1/2';
        case 'top-center': return 'top-8 left-1/2 -translate-x-1/2';
        default: return 'bottom-8 left-8';
      }
    }

    const desktop = responsivePosition.desktop === 'center' ? 'justify-center' : responsivePosition.desktop === 'left' ? 'justify-start' : 'justify-end';
    const tablet = responsivePosition.tablet === 'center' ? 'md:justify-center' : responsivePosition.tablet === 'left' ? 'md:justify-start' : 'md:justify-end';
    const mobile = responsivePosition.mobile === 'center' ? 'max-sm:justify-center' : responsivePosition.mobile === 'left' ? 'max-sm:justify-start' : 'max-sm:justify-end';

    return `flex w-full ${desktop} ${tablet} ${mobile}`;
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: style === 'solid' || style === 'floating' || style === 'advanced' ? bgColor : 'transparent',
    color: textColor,
    borderColor: style === 'border' ? bgColor : 'transparent'
  };

  const content = (
    <a 
      href={url}
      className={`${getStyleClasses()} ${className} flex items-center gap-2`}
      style={buttonStyle}
    >
      {Icon1 && <Icon1 size={20} style={{ color: iconColor }} />}
      <span>{text}</span>
      {Icon2 && <Icon2 size={20} style={{ color: iconColor }} />}
    </a>
  );

  if (style === 'floating') {
    return (
      <div className={`fixed ${getPositionClasses()}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={getPositionClasses()}>
      {content}
    </div>
  );
};
