import React, { useState, useRef } from 'react';

interface PoolItem {
  id: string;
  text: string;
  data?: any; 
}

interface PromptPoolProps {
  title?: string;
  items: PoolItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  onSelect?: (text: string) => void;
  placeholder?: string;
  compact?: boolean;
}

export const PromptPool: React.FC<PromptPoolProps> = ({ 
  title, 
  items, 
  onAdd, 
  onRemove,
  onSelect,
  placeholder = "Enter prompt...",
  compact = false
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    onAdd(inputValue);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleChipClick = (text: string) => {
    setInputValue(text);
    if (onSelect) {
      onSelect(text);
    }
    // Focus input to allow immediate editing
    inputRef.current?.focus();
  };

  return (
    <div className={compact ? "mt-4" : "mb-6"}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <h3 className={`font-bold text-slate-200 uppercase tracking-wide ${compact ? 'text-[10px]' : 'text-xs'}`}>{title}</h3>
          <span className="text-[10px] text-slate-500 font-mono">[{items.length}]</span>
        </div>
      )}

      <div className={`${compact ? 'bg-slate-950/30' : 'bg-slate-900/50'} border border-slate-800 rounded-lg p-3 transition-colors hover:border-slate-700`}>
        {/* Input Area */}
        <div className="flex gap-2 mb-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-600 ${compact ? 'text-xs' : 'text-sm'}`}
          />
          <button
            onClick={handleAdd}
            className={`bg-indigo-900/50 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-100 rounded font-bold transition-all hover:shadow-[0_0_10px_rgba(99,102,241,0.3)] ${compact ? 'px-3 py-1.5 text-[10px] uppercase' : 'px-6 py-2 text-xs uppercase'}`}
          >
            Add
          </button>
        </div>

        {/* Chips Area */}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleChipClick(item.text)}
              className="group flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5 cursor-pointer hover:bg-slate-700 hover:border-amber-500/50 transition-all select-none"
              title="Click to load & edit"
            >
              <span className={`truncate text-slate-300 group-hover:text-amber-500 ${compact ? 'max-w-[100px] text-[10px]' : 'max-w-[150px] text-xs'}`}>
                {item.text}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                className="text-slate-600 hover:text-red-400 rounded-full p-0.5 transition-colors"
                title="Remove preset"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {items.length === 0 && (
            <span className="text-[10px] text-slate-600 italic px-2 py-1">List empty. Add presets to enable automation.</span>
          )}
        </div>
      </div>
    </div>
  );
};