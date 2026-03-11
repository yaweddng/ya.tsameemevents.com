import React from 'react';
import { FormInput } from 'lucide-react';
import { WidgetItemList } from '../components/WidgetItemList';

export const Forms = ({ items, onEdit, onDelete, onAdd }: any) => {
  const availableTypes = [
    { id: 'form', label: 'Form Widget' },
  ];

  return (
    <WidgetItemList 
      title="Forms Widgets" 
      description="Manage custom form builders and input widgets." 
      icon={FormInput} 
      items={items} 
      availableTypes={availableTypes}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
    />
  );
};
