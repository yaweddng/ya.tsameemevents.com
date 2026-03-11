import React from 'react';
import { CreditCard } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const Cards = ({ items, onEdit, onDelete, onAdd, onDuplicate }: any) => {
  return (
    <WidgetItemList 
      title="Cards Widgets" 
      description="Manage information cards and content grids." 
      icon={CreditCard} 
      items={items} 
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
