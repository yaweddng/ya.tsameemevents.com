import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Link as LinkIcon, ExternalLink, RefreshCw, Search, Filter } from 'lucide-react';

interface Redirection {
  id: string;
  from: string;
  to: string;
  type: '301' | '302' | 'shortcode';
  status: 'Active' | 'Inactive';
  hits: number;
  createdAt: string;
}

export const RedirectionsTab = () => {
  const [redirections, setRedirections] = React.useState<Redirection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newRedir, setNewRedir] = React.useState<Partial<Redirection>>({
    from: '',
    to: '',
    type: '301',
    status: 'Active'
  });

  React.useEffect(() => {
    fetchRedirections();
  }, []);

  const fetchRedirections = async () => {
    try {
      const res = await fetch('/api/redirections');
      const data = await res.json();
      setRedirections(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newRedir.from || !newRedir.to) return;

    const redirection: Redirection = {
      id: Math.random().toString(36).substr(2, 9),
      from: newRedir.from!,
      to: newRedir.to!,
      type: newRedir.type as any || '301',
      status: 'Active',
      hits: 0,
      createdAt: new Date().toISOString(),
      ...newRedir
    };

    const updated = [...redirections, redirection];
    try {
      const res = await fetch('/api/redirections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ya-token')}`
        },
        body: JSON.stringify({ redirections: updated })
      });
      if (res.ok) {
        setRedirections(updated);
        setIsAdding(false);
        setNewRedir({ from: '', to: '', type: '301', status: 'Active' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this redirection?')) return;
    const updated = redirections.filter(r => r.id !== id);
    try {
      const res = await fetch('/api/redirections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ya-token')}`
        },
        body: JSON.stringify({ redirections: updated })
      });
      if (res.ok) {
        setRedirections(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-brand">Loading Redirections...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Redirections & Shortcodes</h2>
          <p className="text-gray-400">Manage URL redirects and shortcode mappings.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-brand text-dark px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Add Redirection
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl border border-brand/20 flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">From URL / Slug</label>
            <input
              type="text"
              value={newRedir.from}
              onChange={e => setNewRedir({ ...newRedir, from: e.target.value })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand"
              placeholder="/old-page or short-slug"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">To URL / Destination</label>
            <input
              type="text"
              value={newRedir.to}
              onChange={e => setNewRedir({ ...newRedir, to: e.target.value })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand"
              placeholder="https://example.com or /new-page"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Type</label>
            <select
              value={newRedir.type}
              onChange={e => setNewRedir({ ...newRedir, type: e.target.value as any })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand"
            >
              <option value="301">301 (Perm)</option>
              <option value="302">302 (Temp)</option>
              <option value="shortcode">Shortcode</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 font-bold">Cancel</button>
            <button onClick={handleSave} className="bg-brand text-dark px-6 py-2 rounded-xl font-bold">Save</button>
          </div>
        </motion.div>
      )}

      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">From Path</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Destination</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Hits</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {redirections.map((redir) => (
              <tr key={redir.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <LinkIcon size={14} className="text-brand" />
                    <span className="text-white font-mono text-sm">{redir.from}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ExternalLink size={14} className="text-gray-500" />
                    <span className="text-gray-400 text-sm truncate max-w-[200px]">{redir.to}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    redir.type === 'shortcode' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {redir.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <RefreshCw size={12} /> {redir.hits}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(redir.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {redirections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                  No redirections configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
