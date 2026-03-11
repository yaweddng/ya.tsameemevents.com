import React from 'react';
import { Sparkles } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const Pro = (props: any) => {
  const availableTypes = [
    { id: 'badge_title', label: 'Badge Title' },
    { id: 'advanced_title', label: 'Advanced Title' },
    { id: 'subheading', label: 'Subheading' },
    { id: 'cta_button', label: 'CTA Button' },
    { id: 'carousel', label: 'Advanced Carousel' },
    { id: 'form', label: 'Pro Form' },
    { id: 'icon_list', label: 'Icon List' },
    { id: 'custom_code', label: 'Advanced HTML/JS' },
    { id: 'map', label: 'Google Map' },
    { id: 'image', label: 'Single Image' },
    { id: 'card', label: 'Simple Card' },
    { id: 'faq', label: 'FAQ Widget' },
    { id: 'tabs', label: 'Tabs Widget' },
    { id: 'toggle', label: 'Toggle Widget' },
  ];

  return (
    <WidgetItemList 
      title="Pro Widgets" 
      description="Manage advanced professional-grade widgets." 
      icon={Sparkles} 
      availableTypes={availableTypes}
      {...props}
    />
  );
};
