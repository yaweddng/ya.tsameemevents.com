import React from 'react';
import { 
  Grid, 
  Layout, 
  Sliders, 
  MousePointer2, 
  Settings, 
  Database,
  ChevronRight,
  Plus,
  Trash2,
  Columns,
  Maximize
} from 'lucide-react';

interface DynamicWidgetBuilderProps {
  config: any;
  onChange: (config: any) => void;
}

export const DynamicWidgetBuilder: React.FC<DynamicWidgetBuilderProps> = ({ config, onChange }) => {
  const [postTypes, setPostTypes] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/custom-post-types')
      .then(res => res.json())
      .then(data => setPostTypes(data));
  }, []);

  const widgetConfig = config || {
    postType: '',
    displayType: 'grid', // grid, slider, carousel
    columns: 3,
    limit: 6,
    sortBy: 'createdAt',
    order: 'desc',
    cardTemplateId: '',
    spacing: '24px',
    showPagination: true,
    filters: []
  };

  const updateConfig = (updates: any) => {
    onChange({ ...widgetConfig, ...updates });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Data Source */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider flex items-center gap-2">
            <Database size={16} /> Data Source
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Select Post Type</label>
              <select
                value={widgetConfig.postType}
                onChange={(e) => updateConfig({ postType: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand appearance-none"
              >
                <option value="">Select a post type...</option>
                <option value="services">Services (System)</option>
                <option value="blogs">Blogs (System)</option>
                {postTypes.map(type => (
                  <option key={type.id} value={type.slug}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Sort By</label>
                <select
                  value={widgetConfig.sortBy}
                  onChange={(e) => updateConfig({ sortBy: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand appearance-none"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Order</label>
                <select
                  value={widgetConfig.order}
                  onChange={(e) => updateConfig({ order: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand appearance-none"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider flex items-center gap-2">
            <Layout size={16} /> Display Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Display Type</label>
              <div className="flex gap-2">
                {[
                  { id: 'grid', icon: Grid, label: 'Grid' },
                  { id: 'slider', icon: Sliders, label: 'Slider' },
                  { id: 'carousel', icon: Layout, label: 'Carousel' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateConfig({ displayType: type.id })}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      widgetConfig.displayType === type.id 
                        ? 'border-brand bg-brand/10 text-brand' 
                        : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <type.icon size={20} />
                    <span className="text-[10px] font-bold uppercase">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Columns</label>
                <input
                  type="number"
                  value={widgetConfig.columns}
                  onChange={(e) => updateConfig({ columns: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  min="1"
                  max="6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Items Limit</label>
                <input
                  type="number"
                  value={widgetConfig.limit}
                  onChange={(e) => updateConfig({ limit: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="space-y-4 pt-8 border-t border-white/10">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Query Filters</h3>
          <button className="text-xs text-brand hover:underline font-bold uppercase flex items-center gap-1">
            <Plus size={14} /> Add Filter
          </button>
        </div>
        <div className="p-6 bg-white/5 rounded-[32px] border border-dashed border-white/10 text-center">
          <p className="text-gray-500 text-xs italic">Advanced query filters (by category, tag, or custom field) will be available here.</p>
        </div>
      </div>
    </div>
  );
};
