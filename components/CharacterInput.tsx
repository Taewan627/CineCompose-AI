import React, { useRef } from 'react';
import { CharacterConfig } from '../types';
import { PromptPool } from './PromptPool';

interface PoolItem {
    id: string;
    text: string;
}

interface CharacterInputProps {
  character: CharacterConfig;
  index: number;
  
  // Actions
  onPromptChange: (text: string) => void;
  onImageUpload: (file: File) => void;
  onImageClear: () => void;
  onRemove: () => void;
  onPoolSubmit: (text: string) => void;
  
  // Config
  canRemove: boolean;
  
  // Pool Data & Actions
  poolItems: PoolItem[];
  onAddPoolItem: (text: string) => void;
  onRemovePoolItem: (id: string) => void;
}

export const CharacterInput: React.FC<CharacterInputProps> = ({ 
    character, 
    index, 
    onPromptChange,
    onImageUpload,
    onImageClear,
    onRemove, 
    onPoolSubmit, 
    canRemove,
    poolItems,
    onAddPoolItem,
    onRemovePoolItem
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onPoolSubmit(character.prompt);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 mb-4 relative group transition-all hover:border-amber-500/30">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-amber-500 font-semibold cinematic-font tracking-wider">
                {character.name.toUpperCase()} <span className="text-slate-500 text-sm ml-2">(Slot {index + 1})</span>
            </h3>
            {canRemove && (
                <button 
                    onClick={onRemove}
                    className="text-slate-500 hover:text-red-400 text-sm transition-colors uppercase font-bold text-[10px] tracking-wider"
                >
                    Remove Slot
                </button>
            )}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Image Upload Area */}
        <div className="md:col-span-4 flex flex-col items-center">
            <div 
                className={`
                    relative w-full aspect-[2/3] rounded-md border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all
                    ${character.previewUrl ? 'border-amber-500/50 bg-slate-900 shadow-lg' : 'border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-750'}
                `}
                onClick={() => !character.previewUrl && fileInputRef.current?.click()}
            >
                {character.previewUrl ? (
                    <>
                        <img 
                            src={character.previewUrl} 
                            alt={`Reference for ${character.name}`} 
                            className="w-full h-full object-cover"
                        />
                        <button 
                            onClick={(e) => { e.stopPropagation(); onImageClear(); }}
                            className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors backdrop-blur-sm"
                            title="Remove Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-center px-4 font-mono">UPLOAD REF<br/>(OPTIONAL)</span>
                    </div>
                )}
                <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                />
            </div>
        </div>

        {/* Prompt Area */}
        <div className="md:col-span-8 flex flex-col h-full">
          <label className="flex justify-between items-center text-xs text-slate-400 mb-2 uppercase tracking-wide">
            <span>Description & Placement</span>
            <span className="text-[9px] text-amber-500/80">Press ENTER to add to slot pool</span>
          </label>
          <textarea
            value={character.prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Describe character ${index + 1} appearance, action, and position...`}
            className="w-full h-32 bg-slate-900 border border-slate-700 text-slate-200 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm resize-none shadow-inner"
          />
          
          {/* Integrated Pool for this specific slot */}
          <PromptPool 
            items={poolItems}
            onAdd={onAddPoolItem}
            onRemove={onRemovePoolItem}
            onSelect={onPromptChange}
            placeholder={`Save preset for Slot ${index + 1}...`}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
};