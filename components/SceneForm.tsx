import React from 'react';
import { SceneConfig, FILM_STYLES, TIMES_OF_DAY, ASPECT_RATIOS, RESOLUTIONS, CAMERA_SETTINGS } from '../types';

interface SceneFormProps {
  config: SceneConfig;
  onChange: (newConfig: SceneConfig) => void;
  onSubmit: () => void;
}

export const SceneForm: React.FC<SceneFormProps> = ({ config, onChange, onSubmit }) => {
  
  const handleChange = (field: keyof SceneConfig, value: string | number) => {
    onChange({ ...config, [field]: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Style, Camera, Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs text-amber-500 mb-2 uppercase tracking-widest font-bold">
            Film Style Preset
          </label>
          <select
            value={config.filmStyle}
            onChange={(e) => handleChange('filmStyle', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-3 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a style...</option>
            {FILM_STYLES.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-amber-500 mb-2 uppercase tracking-widest font-bold">
            Camera & Lens
          </label>
          <select
            value={config.cameraSetting}
            onChange={(e) => handleChange('cameraSetting', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-3 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="" disabled>Select camera...</option>
            {CAMERA_SETTINGS.map((cam) => (
              <option key={cam} value={cam}>{cam}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-amber-500 mb-2 uppercase tracking-widest font-bold">
            Time & Lighting
          </label>
          <select
            value={config.timeOfDay}
            onChange={(e) => handleChange('timeOfDay', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-3 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
             <option value="" disabled>Select time...</option>
            {TIMES_OF_DAY.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Format & Resolution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs text-amber-500 mb-2 uppercase tracking-widest font-bold">
            Format (Aspect Ratio)
          </label>
          <select
            value={config.aspectRatio}
            onChange={(e) => handleChange('aspectRatio', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-3 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            {ASPECT_RATIOS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-amber-500 mb-2 uppercase tracking-widest font-bold">
            Gen Resolution
          </label>
           <select
            value={config.resolution}
            onChange={(e) => handleChange('resolution', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-3 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            {RESOLUTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
           <label className="block text-xs text-amber-500 mb-2 uppercase tracking-widest font-bold">
            Export Width (px)
          </label>
          <input 
            type="number"
            min="100"
            max="4096"
            value={config.outputWidth}
            onChange={(e) => handleChange('outputWidth', parseInt(e.target.value) || 960)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md p-3 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Environment */}
      <div>
        <label className="flex justify-between items-center text-xs text-amber-500 mb-2 uppercase tracking-widest font-bold">
          <span>Scene Prompt</span>
          <span className="text-[10px] text-slate-500 font-normal normal-case opacity-70">Press ENTER to add to queue • Shift+Enter for new line</span>
        </label>
        <textarea
          value={config.environment}
          onChange={(e) => handleChange('environment', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the environment, mood, and action..."
          className="w-full h-32 bg-slate-800 border border-slate-700 text-white rounded-md p-4 focus:outline-none focus:border-amber-500 transition-colors resize-none shadow-inner"
        />
      </div>
    </div>
  );
};