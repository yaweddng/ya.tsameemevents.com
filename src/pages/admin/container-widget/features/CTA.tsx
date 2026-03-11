import React from 'react';
import { MousePointer2 } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const CTA = (props: any) => {
  const availableTypes = [
    { id: 'cta_button', label: 'CTA Button' },
  ];

  return (
    <WidgetItemList 
      title="CTA Widgets" 
      description="Manage call-to-action buttons and banners." 
      icon={MousePointer2} 
      availableTypes={availableTypes}
      {...props}
    />
  );
};
