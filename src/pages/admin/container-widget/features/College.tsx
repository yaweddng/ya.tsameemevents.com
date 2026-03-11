import React from 'react';
import { GraduationCap } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const College = ({ items, onEdit, onDelete, onAdd }: any) => {
  return (
    <WidgetItemList 
      title="College Widgets" 
      description="Manage educational and institutional content widgets." 
      icon={GraduationCap} 
      items={items} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
