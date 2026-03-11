import React from 'react';
import { ToggleLeft } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const Toggle = ({ items, onEdit, onDelete, onAdd }: any) => {
  return (
    <WidgetItemList 
      title="Toggle Widgets" 
      description="Manage interactive toggle and switch elements." 
      icon={ToggleLeft} 
      items={items} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
