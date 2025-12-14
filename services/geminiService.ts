import { GoogleGenAI } from "@google/genai";
import { SceneConfig, CharacterConfig } from "../types";
import { fileToBase64 } from "./utils";

// Helper to get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API Key not found via process.env.API_KEY");
  }
  return key;
};

export const generateCinematicScene = async (
  scene: SceneConfig,
  characters: CharacterConfig[]
): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // 1. Construct the Prompt
  let promptText = `
You are a cinematic scene composition engine.
Create a single-frame scene that looks like a still from a high-budget movie.

[1. FILM STYLE PRESET]
Film style: ${scene.filmStyle}

[2. CAMERA & ANGLE]
Camera Setting: ${scene.cameraSetting}

[3. TIME & LIGHTING]
Time of day: ${scene.timeOfDay}
Lighting: cinematic contrast, volumetric light, realistic global illumination, film grain, color grading matching the selected film.

[4. SCENE DESCRIPTION]
Environment:
${scene.environment}

Include multiple objects and environmental storytelling elements.
Ensure depth, foreground, midground, and background separation.
Note: The user may refer to characters in the scene description using labels c1, c2, c3, etc. These correspond to the characters defined below.
`;

  const parts: any[] = [];
  const activeCharacters = characters.filter(c => c.prompt || c.image);

  // 2. Add Character Details and Images
  for (let i = 0; i < activeCharacters.length; i++) {
    const char = activeCharacters[i];
    const charNum = i + 1;
    
    promptText += `\n[CHARACTER ${charNum} (c${charNum})]`;
    
    if (char.image) {
      promptText += `\nBase character appearance is provided via the attached reference image ${charNum}. Preserve facial identity and body proportions.`;
      
      const base64Data = await fileToBase64(char.image);
      parts.push({
        inlineData: {
          mimeType: char.image.type,
          data: base64Data
        }
      });
    } else {
      promptText += `\n(No reference image provided for this character)`;
    }

    promptText += `\nCharacter Modifications & Placement:\n${char.prompt}\n`;
  }

  // Add the text prompt as the last part
  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Using the high quality preview model
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: scene.aspectRatio,
          imageSize: scene.resolution
        },
        // We do not use google_search here as we are doing pure generation/composition
      }
    });

    // Extract image
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};