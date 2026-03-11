import React from 'react';
import { Plus, Edit2, Trash2, Eye, LucideIcon, Search, Copy, Check } from 'lucide-react';

interface WidgetItem {
  id: string;
  name: string;
  type: string;
  slug?: string;
  status: 'Active' | 'Draft' | 'Archived';
}

interface WidgetItemListProps {
  title: string;
  description: string;
  icon: LucideIcon;
  items: WidgetItem[];
  availableTypes?: { id: string; label: string }[];
  onAdd?: (type: string) => void;
  onAddClick?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const WidgetItemList: React.FC<WidgetItemListProps> = ({
  title,
  description,
  icon: Icon,
  items,
  availableTypes = [],
  onAdd,
  onAddClick,
  onEdit,
  onDelete,
  onView,
  onDuplicate
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopySlug = (slug: string, id: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-brand flex items-center gap-2">
            <Icon size={24} />
            {title}
          </h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-sm outline-none focus:border-brand transition-all"
            />
          </div>
          <button 
            onClick={() => onAddClick ? onAddClick() : (availableTypes.length > 1 ? onAdd?.('') : onAdd?.(availableTypes[0]?.id || ''))}
            className="flex items-center justify-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all shrink-0"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-brand/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white group-hover:text-brand transition-colors truncate">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{item.type}</span>
                  {item.slug && (
                    <button 
                      onClick={() => handleCopySlug(item.slug!, item.id)}
                      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-brand transition-colors"
                    >
                      {copiedId === item.id ? <Check size={10} /> : <Copy size={10} />}
                      <span className="font-mono truncate max-w-[100px]">{item.slug}</span>
                    </button>
                  )}
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                item.status === 'Active' ? 'bg-green-500/10 text-green-500' : 
                item.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-500' : 
                'bg-red-500/10 text-red-500'
              }`}>
                {item.status}
              </span>
            </div>
            
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
              <button 
                onClick={() => onView?.(item.id)}
                title="View Preview"
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={() => onDuplicate?.(item.id)}
                title="Duplicate Item"
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand transition-all"
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={() => onEdit?.(item.id)}
                title="Edit Item"
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete?.(item.id)}
                title="Delete Item"
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 italic">No widgets found matching your search.</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => onAddClick ? onAddClick() : (availableTypes.length > 1 ? onAdd?.('') : onAdd?.(availableTypes[0]?.id || ''))}
        className="w-full p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-500 gap-4 hover:border-brand/30 hover:bg-brand/5 transition-all group"
      >
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-brand group-hover:text-dark transition-all">
          <Plus size={32} />
        </div>
        <p className="italic group-hover:text-brand transition-all">Click to add more {title} items</p>
      </button>
    </div>
  );
};
