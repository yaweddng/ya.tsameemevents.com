import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Database, Settings, Layout, Type, Hash, Image as ImageIcon, List, Star, DollarSign, CheckSquare } from 'lucide-react';
import { CustomPostType, CustomPostField } from '../../types';

export const CustomPostTypesTab = () => {
  const [postTypes, setPostTypes] = React.useState<CustomPostType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeType, setActiveType] = React.useState<CustomPostType | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    fetchPostTypes();
  }, []);

  const fetchPostTypes = async () => {
    try {
      const res = await fetch('/api/custom-post-types');
      const data = await res.json();
      setPostTypes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: CustomPostType) => {
    const newTypes = postTypes.map(t => t.id === type.id ? type : t);
    if (!postTypes.find(t => t.id === type.id)) {
      newTypes.push(type);
    }

    try {
      const res = await fetch('/api/custom-post-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ya-token')}`
        },
        body: JSON.stringify({ postTypes: newTypes })
      });
      if (res.ok) {
        setPostTypes(newTypes);
        setIsEditing(false);
        setActiveType(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post type? All associated data will be lost.')) return;
    const newTypes = postTypes.filter(t => t.id !== id);
    try {
      const res = await fetch('/api/custom-post-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ya-token')}`
        },
        body: JSON.stringify({ postTypes: newTypes })
      });
      if (res.ok) {
        setPostTypes(newTypes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-brand">Loading Post Types...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Custom Post Types</h2>
          <p className="text-gray-400">Define custom data structures for your platform.</p>
        </div>
        <button
          onClick={() => {
            setActiveType({
              id: Math.random().toString(36).substr(2, 9),
              name: 'New Post Type',
              slug: 'new-post-type',
              icon: 'Database',
              description: '',
              fields: [],
              hasArchive: true,
              menuPosition: 5,
              createdAt: new Date().toISOString()
            });
            setIsEditing(true);
          }}
          className="bg-brand text-dark px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Add Post Type
        </button>
      </div>

      {isEditing && activeType ? (
        <PostTypeEditor 
          postType={activeType} 
          onSave={handleSave} 
          onCancel={() => {
            setIsEditing(false);
            setActiveType(null);
          }} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postTypes.map((type) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-white/5 hover:border-brand/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand/10 rounded-xl text-brand">
                  <Database size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActiveType(type);
                      setIsEditing(true);
                    }}
                    className="p-2 text-gray-400 hover:text-brand transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{type.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{type.description || 'No description provided.'}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Slug: <span className="text-brand">/{type.slug}</span></span>
                <span className="text-gray-500">{type.fields.length} Custom Fields</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const PostTypeEditor = ({ postType, onSave, onCancel }: { postType: CustomPostType, onSave: (t: CustomPostType) => void, onCancel: () => void }) => {
  const [edited, setEdited] = React.useState<CustomPostType>(postType);

  const addField = () => {
    const newField: CustomPostField = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'new_field',
      label: 'New Field',
      type: 'text',
      required: false
    };
    setEdited({ ...edited, fields: [...edited.fields, newField] });
  };

  const updateField = (id: string, updates: Partial<CustomPostField>) => {
    setEdited({
      ...edited,
      fields: edited.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeField = (id: string) => {
    setEdited({
      ...edited,
      fields: edited.fields.filter(f => f.id !== id)
    });
  };

  return (
    <div className="glass-card p-8 rounded-3xl border border-brand/20">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-white">Editing Post Type: {edited.name}</h3>
        <div className="flex gap-4">
          <button onClick={onCancel} className="text-gray-400 font-bold hover:text-white transition-colors">Cancel</button>
          <button
            onClick={() => onSave(edited)}
            className="bg-brand text-dark px-8 py-2 rounded-full font-bold flex items-center gap-2"
          >
            <Save size={20} /> Save Post Type
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-lg font-bold text-white border-b border-white/5 pb-2">General Settings</h4>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Name (Plural)</label>
            <input
              type="text"
              value={edited.name}
              onChange={e => setEdited({ ...edited, name: e.target.value })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none transition-all"
              placeholder="e.g. Services"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Slug</label>
            <input
              type="text"
              value={edited.slug}
              onChange={e => setEdited({ ...edited, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none transition-all"
              placeholder="e.g. service"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
            <textarea
              value={edited.description}
              onChange={e => setEdited({ ...edited, description: e.target.value })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none transition-all"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasArchive"
              checked={edited.hasArchive}
              onChange={e => setEdited({ ...edited, hasArchive: e.target.checked })}
              className="w-5 h-5 rounded border-white/10 bg-dark text-brand focus:ring-brand"
            />
            <label htmlFor="hasArchive" className="text-white font-bold">Enable Archive Page</label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h4 className="text-lg font-bold text-white">Custom Fields</h4>
            <button
              onClick={addField}
              className="text-brand text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              <Plus size={16} /> Add Field
            </button>
          </div>

          <div className="space-y-4">
            {edited.fields.map((field) => (
              <div key={field.id} className="p-4 bg-dark/50 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Field Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={e => updateField(field.id, { label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="w-40">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Field Type</label>
                  <select
                    value={field.type}
                    onChange={e => updateField(field.id, { type: e.target.value as any })}
                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="number">Number</option>
                    <option value="image">Image</option>
                    <option value="gallery">Gallery</option>
                    <option value="select">Select</option>
                    <option value="rating">Rating</option>
                    <option value="price">Price</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={e => updateField(field.id, { required: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-dark text-brand"
                  />
                  <span className="text-xs text-gray-400">Required</span>
                </div>
                <button
                  onClick={() => removeField(field.id)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {edited.fields.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-gray-500">No custom fields added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
