import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SceneConfig, CharacterConfig, BatchResult } from './types';
import { SceneForm } from './components/SceneForm';
import { CharacterInput } from './components/CharacterInput';
import { ApiKeyGuard } from './components/ApiKeyGuard';
import { generateCinematicScene } from './services/geminiService';
import { SceneViewport } from './components/SceneViewport';
import { GalleryStrip } from './components/GalleryStrip';
import { PromptPool } from './components/PromptPool';

// --- Constants & Defaults ---
const DEFAULT_SCENE_CONFIG: SceneConfig = {
  filmStyle: "Blade Runner 2049 (Cyberpunk, Neon, Fog)",
  timeOfDay: "Midnight",
  cameraSetting: "Standard (35mm-50mm) - Natural View",
  environment: "",
  aspectRatio: "16:9",
  resolution: "1K",
  outputWidth: 960,
};

const createDefaultCharacter = (id: number): CharacterConfig => ({
  id,
  name: `Character ${id}`,
  prompt: "",
  image: null,
  previewUrl: null,
});

interface PoolItem {
  id: string;
  text: string;
}

function App() {
  // --- STATE ---
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(DEFAULT_SCENE_CONFIG);
  const [characters, setCharacters] = useState<CharacterConfig[]>([createDefaultCharacter(1)]);
  
  // App Flow
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pools
  const [environmentPool, setEnvironmentPool] = useState<PoolItem[]>([]);
  const [characterPools, setCharacterPools] = useState<Record<number, PoolItem[]>>({});
  
  // Results
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Automation
  const [isAutoLooping, setIsAutoLooping] = useState(false);
  const autoLoopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- MEMORY MANAGEMENT ---
  // Cleanup object URLs when characters are removed or updated
  const revokeCharacterImage = (char: CharacterConfig) => {
    if (char.previewUrl) {
      URL.revokeObjectURL(char.previewUrl);
    }
  };

  // Cleanup all on unmount
  useEffect(() => {
    return () => {
      characters.forEach(revokeCharacterImage);
      if (autoLoopTimeoutRef.current) clearTimeout(autoLoopTimeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- CHARACTER HANDLERS ---
  
  const addCharacterSlot = () => {
    if (characters.length < 5) {
      setCharacters(prev => [...prev, createDefaultCharacter(prev.length + 1)]);
    }
  };

  const removeCharacterSlot = (indexToRemove: number) => {
    setCharacters(prev => {
      // 1. Revoke image for the removed char
      revokeCharacterImage(prev[indexToRemove]);

      // 2. Remove and re-index remaining
      const filtered = prev.filter((_, i) => i !== indexToRemove);
      return filtered.map((char, i) => ({
        ...char,
        id: i + 1,
        name: `Character ${i + 1}`
      }));
    });
    
    // Note: We deliberately KEEP the pool for the slot index intact. 
    // If you remove Slot 2, the pool for Slot 2 remains and will apply to the *new* Slot 2 (prev Slot 3).
    // This matches the "Slot based" architecture.
  };

  const updateCharacterPrompt = (index: number, text: string) => {
    setCharacters(prev => {
      const newChars = [...prev];
      newChars[index] = { ...newChars[index], prompt: text };
      return newChars;
    });
  };

  const updateCharacterImage = (index: number, file: File | null) => {
    setCharacters(prev => {
      const newChars = [...prev];
      const oldChar = newChars[index];

      // Revoke old if exists
      revokeCharacterImage(oldChar);

      if (file) {
        newChars[index] = {
          ...oldChar,
          image: file,
          previewUrl: URL.createObjectURL(file)
        };
      } else {
        newChars[index] = {
          ...oldChar,
          image: null,
          previewUrl: null
        };
      }
      return newChars;
    });
  };

  // --- GENERATION LOGIC ---

  const executeGeneration = async (config: SceneConfig, chars: CharacterConfig[], sourceName: string) => {
    setError(null);
    setIsGenerating(true);
    setSelectedImage(null); 

    try {
      const imageUrl = await generateCinematicScene(config, chars);
      
      const newResult: BatchResult = {
        id: Date.now().toString(),
        imageUrl,
        timestamp: Date.now(),
        sourceSceneName: sourceName,
        config: config
      };

      setBatchResults(prev => [...prev, newResult]);
      setSelectedImage(imageUrl);
      return true;
    } catch (e: any) {
      console.error("Generation failed:", e);
      setError(e.message || "Failed to generate scene.");
      setIsAutoLooping(false); // Safety Stop
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualGenerate = () => {
    if (!sceneConfig.environment.trim()) {
      setError("Please describe the environment first.");
      return;
    }
    executeGeneration(sceneConfig, characters, "Manual Composition");
  };

  // --- POOL MANAGEMENT ---

  const addEnvironmentToPool = (text: string) => {
    setEnvironmentPool(prev => [...prev, { id: Date.now().toString(), text }]);
  };

  const removeEnvironmentFromPool = (id: string) => {
    setEnvironmentPool(prev => prev.filter(item => item.id !== id));
  };

  const addCharacterToPool = (slotIndex: number, text: string) => {
    setCharacterPools(prev => {
        const currentPool = prev[slotIndex] || [];
        return {
            ...prev,
            [slotIndex]: [...currentPool, { id: Date.now().toString(), text }]
        };
    });
  };

  const removeCharacterFromPool = (slotIndex: number, itemId: string) => {
     setCharacterPools(prev => {
        const currentPool = prev[slotIndex] || [];
        return {
            ...prev,
            [slotIndex]: currentPool.filter(item => item.id !== itemId)
        };
     });
  };

  // --- AUTOMATION ENGINE ---

  const toggleAutoLoop = () => {
      if (isAutoLooping) {
          setIsAutoLooping(false);
          if (autoLoopTimeoutRef.current) clearTimeout(autoLoopTimeoutRef.current);
      } else {
          // Validation
          const hasEnv = environmentPool.length > 0;
          const hasCharPools = characters.some((_, i) => (characterPools[i] && characterPools[i].length > 0));

          if (!hasEnv || !hasCharPools) {
              alert("Configuration Error: Ensure you have items in the Environment pool AND at least one Character Slot pool.");
              return;
          }
          setIsAutoLooping(true);
      }
  };

  const runRandomMix = useCallback(async () => {
     if (environmentPool.length === 0) {
         setError("Auto-Mix Error: Environment pool is empty.");
         setIsAutoLooping(false);
         return;
     }
     
     // 1. Pick Random Environment
     const envItem = environmentPool[Math.floor(Math.random() * environmentPool.length)];
     
     // 2. Mix Characters
     const mixedCharacters = characters.map((char, index) => {
         const pool = characterPools[index];
         // Only randomize if this specific slot has a pool
         if (pool && pool.length > 0) {
             const randomTrait = pool[Math.floor(Math.random() * pool.length)];
             return { ...char, prompt: randomTrait.text };
         }
         return char;
     });
     
     // 3. Update UI Reflection
     setSceneConfig(prev => ({ ...prev, environment: envItem.text }));
     setCharacters(mixedCharacters);

     // 4. Execute
     await executeGeneration(
         { ...sceneConfig, environment: envItem.text }, 
         mixedCharacters, 
         `MIX: ${envItem.text.substring(0,12)}...`
     );
  }, [environmentPool, characterPools, characters, sceneConfig]);

  // Automation Loop Effect
  useEffect(() => {
      if (isAutoLooping && !isGenerating) {
          // 3-second delay between generations
          autoLoopTimeoutRef.current = setTimeout(() => {
             runRandomMix();
          }, 3000); 
      }
      return () => {
          if (autoLoopTimeoutRef.current) clearTimeout(autoLoopTimeoutRef.current);
      };
  }, [isAutoLooping, isGenerating, runRandomMix]);

  // --- JSON DATA HANDLERS ---

  const exportProject = () => {
    const projectData = {
        version: "1.0",
        timestamp: Date.now(),
        sceneConfig,
        // Strip binary data, keep structure
        characters: characters.map(c => ({
            id: c.id,
            name: c.name,
            prompt: c.prompt,
            image: null,
            previewUrl: null
        })),
        pools: {
            environment: environmentPool,
            characters: characterPools
        }
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cinecompose-project-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProject = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const raw = event.target?.result as string;
              if (!raw) return;
              
              const data = JSON.parse(raw);
              
              if (data.version && data.sceneConfig) {
                  // Clean up existing state
                  characters.forEach(revokeCharacterImage);

                  // Load Config
                  setSceneConfig(data.sceneConfig);
                  
                  // Load Characters (Safe mapping)
                  const loadedChars = (data.characters as any[]).map((c, i) => ({
                      ...createDefaultCharacter(i + 1),
                      prompt: c.prompt || "",
                      // Images cannot be restored from JSON
                  }));
                  setCharacters(loadedChars);

                  // Load Pools
                  if (data.pools) {
                      setEnvironmentPool(data.pools.environment || []);
                      setCharacterPools(data.pools.characters || {});
                  }
                  
                  alert("Project loaded successfully. Images must be re-uploaded manually.");
              } else {
                  throw new Error("Invalid project file structure.");
              }
          } catch (err) {
              alert("Failed to load project file.");
              console.error(err);
          } finally {
              // Reset file input
              e.target.value = '';
          }
      };
      reader.readAsText(file);
  };

  return (
    <ApiKeyGuard>
      <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-sm rotate-45 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
              <h1 className="text-2xl font-bold tracking-wider text-white cinematic-font">
                CINE<span className="text-amber-500">COMPOSE</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <label className="text-[10px] font-bold uppercase bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded cursor-pointer transition-colors text-slate-300 border border-slate-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Import JSON
                        <input type="file" accept=".json" onChange={importProject} className="hidden" />
                    </label>
                    <button 
                        onClick={exportProject}
                        className="text-[10px] font-bold uppercase bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded transition-colors text-slate-300 border border-slate-700 flex items-center gap-2"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export JSON
                    </button>
                </div>

                {isAutoLooping && (
                    <div className="flex items-center gap-2 text-xs text-amber-500 animate-pulse font-bold uppercase border border-amber-500/50 px-3 py-1 rounded-full bg-amber-950/30">
                        <span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"></span>
                        Auto-Mix Active
                    </div>
                )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT COLUMN: Controls & Library */}
            <div className="lg:col-span-5 flex flex-col h-full space-y-8">
              
              {/* AUTOMATION CARD */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <div>
                    <h3 className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-1">Automation Engine</h3>
                    <p className="text-[10px] text-slate-400">Loop Generation using Random Pools</p>
                </div>
                <div className="flex gap-2">
                    <button 
                         onClick={runRandomMix}
                         disabled={isGenerating || isAutoLooping}
                         className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-600 text-[10px] font-bold uppercase transition-colors"
                    >
                         Mix Once
                    </button>
                    <button 
                         onClick={toggleAutoLoop}
                         className={`px-3 py-1.5 rounded border text-[10px] font-bold uppercase transition-colors ${isAutoLooping ? 'bg-amber-600 text-black border-amber-600' : 'bg-transparent text-amber-500 border-amber-500/50 hover:border-amber-500'}`}
                    >
                         {isAutoLooping ? "Stop Loop" : "Auto Loop"}
                    </button>
                </div>
              </div>

              {/* SECTION 1: SCENE */}
              <section className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-amber-500 font-bold text-lg">01</span>
                        <h2 className="text-xl font-light cinematic-font">SCENE CONFIG</h2>
                    </div>
                </div>
                
                <SceneForm 
                  config={sceneConfig} 
                  onChange={setSceneConfig} 
                  onSubmit={() => {
                      if (sceneConfig.environment.trim()) addEnvironmentToPool(sceneConfig.environment);
                  }} 
                />

                <div className="mt-8 border-t border-slate-800 pt-6">
                    <PromptPool 
                        title="Environment Presets"
                        items={environmentPool}
                        onAdd={addEnvironmentToPool}
                        onRemove={removeEnvironmentFromPool}
                        onSelect={(text) => setSceneConfig({ ...sceneConfig, environment: text })}
                        placeholder="Add scene prompt..."
                    />
                </div>
              </section>

              {/* SECTION 2: CHARACTERS */}
              <section>
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-amber-500 font-bold text-lg">02</span>
                        <h2 className="text-xl font-light cinematic-font">CASTING</h2>
                    </div>
                    {characters.length < 3 && (
                        <button 
                            onClick={addCharacterSlot}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors uppercase font-bold tracking-wider"
                        >
                            + Character Slot
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                  {characters.map((char, index) => (
                    <CharacterInput
                      key={char.id}
                      character={char}
                      index={index}
                      
                      // Data Handling
                      onPromptChange={(text) => updateCharacterPrompt(index, text)}
                      onImageUpload={(file) => updateCharacterImage(index, file)}
                      onImageClear={() => updateCharacterImage(index, null)}
                      
                      // Slot Logic
                      onRemove={() => removeCharacterSlot(index)}
                      canRemove={characters.length > 0}
                      
                      // Pool Logic
                      poolItems={characterPools[index] || []}
                      onAddPoolItem={(text) => addCharacterToPool(index, text)}
                      onRemovePoolItem={(id) => removeCharacterFromPool(index, id)}
                      onPoolSubmit={(text) => {
                          if (text.trim()) addCharacterToPool(index, text.trim());
                      }}
                    />
                  ))}
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN: Output */}
            <div className="lg:col-span-7 flex flex-col h-full">
                <SceneViewport 
                    image={selectedImage} 
                    isGenerating={isGenerating} 
                    error={error} 
                    config={sceneConfig}
                />
                
                <GalleryStrip 
                    results={batchResults}
                    onSelect={(url) => setSelectedImage(url)}
                    selectedUrl={selectedImage}
                />
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-40 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-[10px] text-slate-600 font-mono tracking-widest uppercase opacity-50 select-none">
                    Taewan-Kim
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleManualGenerate}
                        disabled={isGenerating}
                        className={`
                            px-8 py-3 rounded-sm font-bold tracking-[0.2em] uppercase transition-all transform
                            ${isGenerating 
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                                : 'bg-amber-600 hover:bg-amber-500 text-slate-900 hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                            }
                        `}
                    >
                        {isGenerating ? 'Rendering...' : 'Manual Render'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </ApiKeyGuard>
  );
}

export default App;