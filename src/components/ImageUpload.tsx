import React from 'react';
import { Upload, RefreshCw, X, Check } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  name?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, className = "", name }) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // In a real app, we'd send the actual file. 
      // Our server simulation expects name, type, size in body for now, 
      // but let's make it look real.
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ya-token')}`
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type.split('/')[0],
          size: file.size
        })
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>}
      <div className="flex gap-4 items-start">
        <div className="flex-1 space-y-2">
          <div className="relative">
            <input
              name={name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand pr-12 text-sm"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-lg text-brand transition-all disabled:opacity-50"
              title="Upload Image"
            >
              {isUploading ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
            </button>
          </div>
          {error && <p className="text-rose-500 text-[10px] font-bold">{error}</p>}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        {value && (
          <div className="relative group">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 p-1">
              <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
