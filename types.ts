export interface CharacterConfig {
  id: number;
  name: string;
  prompt: string;
  image: File | null;
  previewUrl: string | null;
}

export interface SceneConfig {
  filmStyle: string;
  timeOfDay: string;
  cameraSetting: string;
  environment: string;
  aspectRatio: string;
  resolution: string;
  outputWidth: number;
}

// Previously SavedScene, now split
export interface SavedEnvironment {
  id: string;
  name: string;
  config: SceneConfig;
  createdAt: number;
}

export interface SavedCast {
  id: string;
  name: string;
  characters: CharacterConfig[];
  createdAt: number;
}

export interface BatchResult {
  id: string;
  imageUrl: string;
  timestamp: number;
  sourceSceneName: string;
  config: SceneConfig; // Store config to allow re-download/inspect
}

export interface GeneratedScene {
  imageUrl: string;
  promptUsed: string;
}

export const FILM_STYLES = [
  "Blade Runner 2049 (Cyberpunk, Neon, Fog)",
  "The Dark Knight (Gritty, Urban, IMAX)",
  "Dune (Grand Scale, Monochromatic, Sandy)",
  "Ghost in the Shell (High Tech, Glossy, Anime-Realism)",
  "Children of Men (Handheld, Desaturated, Realistic)",
  "Wes Anderson (Symmetrical, Pastel, Flat)",
  "Mad Max: Fury Road (High Contrast, Saturated, Chaos)",
  "The Godfather (Warm, Shadowy, Noir)",
];

export const CAMERA_SETTINGS = [
  "Standard (35mm-50mm) - Natural View",
  "Wide Angle (24mm) - Expansive",
  "Ultra Wide / Fisheye - Distorted/Panoramic",
  "Telephoto (85mm+) - Compressed Depth",
  "Macro - Extreme Close-up",
  "Low Angle - Heroic/Imposing",
  "High Angle / Bird's Eye - Overview",
  "Dutch Angle - Tilted/Unsettling",
  "Over-the-Shoulder - Conversational",
  "Drone / Aerial - High Altitude",
  "Handheld - Shaky/Documentary Style",
];

export const TIMES_OF_DAY = [
  "Golden Hour",
  "Blue Hour",
  "High Noon",
  "Midnight",
  "Overcast Day",
  "Stormy Night",
];

export const ASPECT_RATIOS = [
  { label: "16:9 (Cinematic)", value: "16:9" },
  { label: "9:16 (Portrait)", value: "9:16" },
  { label: "1:1 (Square)", value: "1:1" },
  { label: "4:3 (Classic TV)", value: "4:3" },
  { label: "3:4 (Vertical)", value: "3:4" },
];

export const RESOLUTIONS = [
  { label: "1K (Standard)", value: "1K" },
  { label: "2K (High Def)", value: "2K" },
];