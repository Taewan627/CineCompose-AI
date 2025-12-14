import React from 'react';
import { BatchResult } from '../types';

interface GalleryStripProps {
  results: BatchResult[];
  onSelect: (imageUrl: string) => void;
  selectedUrl: string | null;
}

export const GalleryStrip: React.FC<GalleryStripProps> = ({ results, onSelect, selectedUrl }) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-6 border-t border-slate-800 pt-6">
      <div className="flex items-center gap-3 mb-3">
         <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">Render History</span>
         <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">{results.length}</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {[...results].reverse().map((result) => (
          <div 
            key={result.id} 
            className={`
                flex-shrink-0 w-32 cursor-pointer group relative rounded-md overflow-hidden border-2 transition-all
                ${selectedUrl === result.imageUrl ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}
            `}
            onClick={() => onSelect(result.imageUrl)}
          >
            <img 
                src={result.imageUrl} 
                alt={result.sourceSceneName} 
                className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-2">
                <p className="text-[10px] text-white font-bold truncate">{result.sourceSceneName}</p>
                <p className="text-[9px] text-slate-400">{new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};