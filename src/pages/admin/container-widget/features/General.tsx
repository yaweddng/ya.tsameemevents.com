import React from 'react';
import { Type } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const General = (props: any) => {
  const availableTypes = [
    { id: 'badge_title', label: 'Badge Title' },
    { id: 'advanced_title', label: 'Advanced Title' },
    { id: 'subheading', label: 'Subheading' },
    { id: 'cta_button', label: 'CTA Button' },
    { id: 'carousel', label: 'Carousel' },
    { id: 'icon_list', label: 'Icon List' },
    { id: 'custom_code', label: 'Custom Code / HTML' },
    { id: 'map', label: 'Google Map' },
    { id: 'image', label: 'Single Image' },
    { id: 'card', label: 'Simple Card' },
    { id: 'faq', label: 'FAQ Widget' },
    { id: 'tabs', label: 'Tabs Widget' },
    { id: 'toggle', label: 'Toggle Widget' },
  ];

  return (
    <WidgetItemList 
      title="General Widgets" 
      description="Manage general UI elements and basic content widgets." 
      icon={Type} 
      availableTypes={availableTypes}
      {...props}
    />
  );
};
