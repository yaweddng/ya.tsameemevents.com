import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Type, 
  Hash, 
  Image as ImageIcon, 
  Star, 
  DollarSign, 
  CheckSquare, 
  Layout,
  Save,
  X,
  ChevronRight,
  Database
} from 'lucide-react';
import { CustomPostType, CustomPostField } from '../../../types';

export const PostTypeManager = () => {
  const [postTypes, setPostTypes] = React.useState<CustomPostType[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingType, setEditingType] = React.useState<CustomPostType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchPostTypes = async () => {
    try {
      const res = await fetch('/api/custom-post-types');
      const data = await res.json();
      setPostTypes(data);
    } catch (error) {
      console.error('Error fetching post types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPostTypes();
  }, []);

  const handleSave = async (type: CustomPostType) => {
    const updated = editingType?.id 
      ? postTypes.map(t => t.id === type.id ? type : t)
      : [...postTypes, { ...type, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }];

    try {
      const res = await fetch('/api/custom-post-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ postTypes: updated })
      });

      if (res.ok) {
        setPostTypes(updated);
        setIsEditing(false);
        setEditingType(null);
      }
    } catch (error) {
      console.error('Error saving post type:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post type? This will affect all content of this type.')) return;
    const updated = postTypes.filter(t => t.id !== id);
    try {
      const res = await fetch('/api/custom-post-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ postTypes: updated })
      });
      if (res.ok) setPostTypes(updated);
    } catch (error) {
      console.error('Error deleting post type:', error);
    }
  };

  const addField = () => {
    if (!editingType) return;
    const newField: CustomPostField = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      label: '',
      type: 'text',
      required: false
    };
    setEditingType({ ...editingType, fields: [...editingType.fields, newField] });
  };

  const removeField = (id: string) => {
    if (!editingType) return;
    setEditingType({ ...editingType, fields: editingType.fields.filter(f => f.id !== id) });
  };

  const updateField = (id: string, updates: Partial<CustomPostField>) => {
    if (!editingType) return;
    setEditingType({
      ...editingType,
      fields: editingType.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="text-brand" /> Custom Post Types
          </h2>
          <p className="text-gray-400 text-sm">Create and manage custom content structures</p>
        </div>
        <button 
          onClick={() => {
            setEditingType({
              id: '',
              name: '',
              slug: '',
              icon: 'Layout',
              description: '',
              fields: [],
              hasArchive: true,
              menuPosition: 5,
              createdAt: ''
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-brand text-dark px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <Plus size={20} /> Add New Post Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postTypes.map((type) => (
          <motion.div
            key={type.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-3xl border border-white/5 hover:border-brand/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                <Layout size={24} />
              </div>
              <div className="text-xs text-gray-500 font-mono">{type.slug}</div>
            </div>

            <h3 className="text-lg font-bold mb-1">{type.name}</h3>
            <p className="text-gray-400 text-xs mb-4 line-clamp-2">{type.description || 'No description provided'}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Settings size={14} />
                <span>{type.fields.length} Fields</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckSquare size={14} />
                <span>{type.hasArchive ? 'Has Archive' : 'No Archive'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingType(type);
                  setIsEditing(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all"
              >
                <Settings size={16} /> Configure
              </button>
              <button 
                onClick={() => handleDelete(type.id)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {postTypes.length === 0 && (
          <div className="col-span-full py-24 text-center glass-card rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
              <Database size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-400">No custom post types</h3>
            <p className="text-gray-500 text-sm">Start by defining your first content structure</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isEditing && editingType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-dark border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Database className="text-brand" size={24} />
                    {editingType.id ? 'Configure Post Type' : 'Create Post Type'}
                  </h3>
                  <p className="text-gray-400 text-sm">Define structure and fields for your custom content</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name (Plural)</label>
                      <input
                        value={editingType.name}
                        onChange={(e) => setEditingType({...editingType, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all"
                        placeholder="e.g. Services"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Slug</label>
                      <input
                        value={editingType.slug}
                        onChange={(e) => setEditingType({...editingType, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all font-mono"
                        placeholder="e.g. service"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                      <textarea
                        value={editingType.description}
                        onChange={(e) => setEditingType({...editingType, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all h-[124px] resize-none"
                        placeholder="What is this content type for?"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-wider">Custom Fields</h4>
                    <button 
                      onClick={addField}
                      className="flex items-center gap-2 text-xs text-brand hover:underline font-bold uppercase"
                    >
                      <Plus size={14} /> Add Field
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingType.fields.map((field, idx) => (
                      <div key={field.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Label</label>
                              <input
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                                placeholder="Field Label"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
                              <select
                                value={field.type}
                                onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand appearance-none"
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
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Required</label>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateField(field.id, { required: true })}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${field.required ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => updateField(field.id, { required: false })}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!field.required ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeField(field.id)}
                            className="ml-4 p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        {field.type === 'select' && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Options (Comma separated)</label>
                            <input
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                              placeholder="Option 1, Option 2, Option 3"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {editingType.fields.length === 0 && (
                      <p className="text-center text-gray-500 text-xs py-8 italic border border-dashed border-white/10 rounded-3xl">
                        No custom fields defined yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/10 bg-white/5 flex justify-end gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSave(editingType)}
                  className="flex items-center gap-2 bg-brand text-dark px-10 py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  <Save size={20} /> Save Post Type
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
