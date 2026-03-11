import React from 'react';
import { FileText } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const PDF = ({ items, onEdit, onDelete, onAdd }: any) => {
  return (
    <WidgetItemList 
      title="PDF Generator" 
      description="Manage PDF document layouts and generation logic." 
      icon={FileText} 
      items={items} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
