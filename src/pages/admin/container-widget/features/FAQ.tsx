import React from 'react';
import { HelpCircle } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const FAQ = ({ items, onEdit, onDelete, onAdd }: any) => {
  return (
    <WidgetItemList 
      title="FAQ Widgets" 
      description="Manage frequently asked questions and accordions." 
      icon={HelpCircle} 
      items={items} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
