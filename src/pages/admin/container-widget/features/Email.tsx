import React from 'react';
import { Mail } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const Email = ({ items, onEdit, onDelete, onAdd }: any) => {
  return (
    <WidgetItemList 
      title="Email Templates" 
      description="Manage email notification templates and layouts." 
      icon={Mail} 
      items={items} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
