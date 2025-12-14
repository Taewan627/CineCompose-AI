import React, { useEffect, useState, useCallback } from 'react';

// Define interface locally to avoid global namespace collisions
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkKey = useCallback(async () => {
    try {
      const aistudio = (window as any).aistudio as AIStudio | undefined;
      if (aistudio?.hasSelectedApiKey) {
        const selected = await aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for dev environments where the extension might not be present
        // In a real app adhering to the prompt requirements, we strictly check.
        // For local dev without the specific wrapper, this might block, but 
        // the prompt instructs to assume the environment is set up.
        // We will default to true if the API_KEY env var is present to allow testing,
        // but prefer the aistudio check if available.
        setHasKey(!!process.env.API_KEY);
      }
    } catch (e) {
      console.error("Error checking API key", e);
      setHasKey(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio as AIStudio | undefined;
    if (aistudio?.openSelectKey) {
      await aistudio.openSelectKey();
      // Assume success as per instructions regarding race condition
      setHasKey(true); 
    } else {
        alert("AI Studio environment not detected. Please ensure you are running in the correct environment.");
    }
  };

  if (checking) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 cinematic-font">
            Loading System...
        </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl text-amber-500 mb-4 cinematic-font">Authorization Required</h1>
        <p className="text-slate-400 max-w-md mb-8">
          To access the CineCompose high-fidelity generation engine, you must provide a valid API key with billing enabled.
        </p>
        <button
          onClick={handleSelectKey}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded-sm tracking-widest uppercase transition-all"
        >
          Select API Key
        </button>
        <p className="mt-6 text-xs text-slate-600">
           Review <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-amber-500">Billing Documentation</a> for more details.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};