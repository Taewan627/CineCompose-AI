import React, { useState } from 'react';
import { downloadProcessedImage } from '../services/utils';
import { SceneConfig } from '../types';

interface SceneViewportProps {
  image: string | null;
  isGenerating: boolean;
  error: string | null;
  config: SceneConfig;
}

export const SceneViewport: React.FC<SceneViewportProps> = ({ image, isGenerating, error, config }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = () => {
    if (image) {
      downloadProcessedImage(image, `cinecompose-${Date.now()}.jpg`, config.outputWidth);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-2">
        <span className="text-amber-500 font-bold text-lg">03</span>
        <h2 className="text-xl font-light cinematic-font">VIEWPORT</h2>
      </div>

      <div className="flex-1 bg-black rounded-lg border border-slate-800 overflow-hidden relative min-h-[400px] flex items-center justify-center shadow-2xl shadow-black group">
        
        {/* Placeholder Grid */}
        {!image && !isGenerating && (
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        )}

        {/* The Image */}
        {image && (
            <img 
                src={image} 
                alt="Generated Scene" 
                className="w-full h-auto object-contain max-h-[80vh] animate-in fade-in duration-700 cursor-zoom-in"
                onClick={() => setShowModal(true)}
            />
        )}

        {/* Loading State */}
        {isGenerating && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                <div className="w-16 h-1 bg-slate-800 rounded overflow-hidden mb-4">
                    <div className="h-full bg-amber-500 animate-[loading_1s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-amber-500 font-mono text-sm blink">RENDERING SCENE...</p>
                <style>{`
                    @keyframes loading {
                        0% { width: 0%; margin-left: 0; }
                        50% { width: 100%; margin-left: 0; }
                        100% { width: 0%; margin-left: 100%; }
                    }
                    .blink { animation: blinker 2s linear infinite; }
                    @keyframes blinker { 50% { opacity: 0.5; } }
                `}</style>
            </div>
        )}
        
        {/* Empty State */}
        {!image && !isGenerating && (
             <div className="text-center">
                <p className="text-slate-600 font-mono text-sm mb-2">NO SIGNAL</p>
                <p className="text-slate-700 text-xs max-w-xs mx-auto">Configure your scene and press render to visualize.</p>
             </div>
        )}

        {/* Overlay Controls */}
        {image && !isGenerating && (
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                <button
                    onClick={() => setShowModal(true)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    EXPAND VIEW
                </button>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400">
                    {config.aspectRatio} • {config.outputWidth}px
                  </span>
                  <button 
                      onClick={handleDownload}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-xs backdrop-blur-md border border-white/10 transition-colors uppercase tracking-wider font-bold"
                  >
                      SAVE JPEG
                  </button>
                </div>
             </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm">
              <span className="font-bold">ERROR:</span> {error}
          </div>
      )}

      {/* Image Modal */}
      {showModal && image && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setShowModal(false)}
        >
            <div className="relative w-full max-w-7xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute -top-12 right-0 text-slate-400 hover:text-amber-500 transition-colors"
                    title="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <img 
                    src={image} 
                    alt="Full Size Scene" 
                    className="w-auto h-auto max-w-full max-h-[85vh] rounded shadow-2xl shadow-black border border-slate-800"
                />

                <div className="mt-6 flex gap-4 items-center">
                    <span className="text-slate-500 text-sm">Target Width: {config.outputWidth}px</span>
                    <button
                        onClick={handleDownload}
                        className="bg-amber-600 hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-sm font-bold tracking-widest uppercase transition-colors shadow-lg"
                    >
                        Download JPEG
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};