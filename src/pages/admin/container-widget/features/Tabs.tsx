import React from 'react';
import { Layout } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const Tabs = ({ items, onEdit, onDelete, onAdd }: any) => {
  return (
    <WidgetItemList 
      title="Tabs Widgets" 
      description="Manage tabbed content layouts and navigation." 
      icon={Layout} 
      items={items} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
