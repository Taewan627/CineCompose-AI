import React, { useState } from 'react';
import { SavedEnvironment, SavedCast } from '../types';

interface SceneLibraryProps {
  environments: SavedEnvironment[];
  casts: SavedCast[];
  onLoadEnvironment: (env: SavedEnvironment) => void;
  onLoadCast: (cast: SavedCast) => void;
  onDeleteEnvironment: (id: string) => void;
  onDeleteCast: (id: string) => void;
  isGenerating: boolean;
}

export const SceneLibrary: React.FC<SceneLibraryProps> = ({ 
  environments, 
  casts,
  onLoadEnvironment, 
  onLoadCast, 
  onDeleteEnvironment, 
  onDeleteCast,
  isGenerating 
}) => {
  const [activeTab, setActiveTab] = useState<'scenes' | 'casts'>('scenes');

  const isEmpty = activeTab === 'scenes' ? environments.length === 0 : casts.length === 0;

  return (
    <div className="flex flex-col h-full max-h-[400px]">
      {/* Tabs */}
      <div className="flex mb-2 bg-slate-900 rounded p-1 border border-slate-800">
        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${activeTab === 'scenes' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Scenes ({environments.length})
        </button>
        <button
          onClick={() => setActiveTab('casts')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${activeTab === 'casts' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Casts ({casts.length})
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-800 rounded-lg text-slate-600 bg-slate-900/30 h-full">
            <p className="text-center text-xs">
              No saved {activeTab}.
            </p>
            <p className="text-center text-[10px] opacity-60 mt-1">
              {activeTab === 'scenes' ? "Press Enter in Scene Config." : "Press Enter in Casting."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTab === 'scenes' && [...environments].reverse().map((env) => (
              <div 
                key={env.id} 
                className="group flex items-center justify-between p-3 rounded-md border bg-slate-900 border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
                onClick={() => onLoadEnvironment(env)}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <h3 className="text-xs font-bold truncate text-slate-300 group-hover:text-amber-500 transition-colors">
                    {env.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate">{env.config.filmStyle}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteEnvironment(env.id); }}
                  disabled={isGenerating}
                  className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}

            {activeTab === 'casts' && [...casts].reverse().map((cast) => (
              <div 
                key={cast.id} 
                className="group flex items-center justify-between p-3 rounded-md border bg-slate-900 border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
                onClick={() => onLoadCast(cast)}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <h3 className="text-xs font-bold truncate text-slate-300 group-hover:text-amber-500 transition-colors">
                    {cast.name}
                  </h3>
                  <div className="flex gap-1 mt-1">
                     <span className="text-[9px] bg-slate-800 px-1.5 rounded text-slate-400 border border-slate-700">
                        {cast.characters.length} Actors
                     </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteCast(cast.id); }}
                  disabled={isGenerating}
                  className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};