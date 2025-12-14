# CINECOMPOSE

A **cinematic scene composition UI** that generates film-style scenes using **presets + random pools**, enabling fast iteration and consistent visual tone without rewriting long prompts every time.

> Goal  
> Instead of crafting complex prompts repeatedly, combine  
> **Film Style / Camera & Lens / Time & Lighting / Environment Presets / Character Slots**  
> to generate high-quality cinematic variations via mix and loop automation.

---

## ✨ Key Features

### Scene Configuration
- **Film Style Preset** (e.g., Blade Runner)
- **Camera & Lens** (e.g., Standard 35mm)
- **Time & Lighting** (e.g., Midnight)
- **Aspect Ratio / Resolution / Export Width**
- **Scene Prompt** for environment, mood, and action

### Environment Preset Pool
- Register multiple environment presets
- Randomly mixed during generation for visual variation
- Designed for repeatable yet diverse outputs

### Casting System (Character Slots)
- Add multiple character slots
- Slot-specific appearance, action, and placement prompts
- Optional reference image upload per slot

### Automation Engine
- **MIX ONCE**: Generate a single randomized combination
- **AUTO LOOP**: Continuously generate variations from preset pools

### JSON Import / Export
- Save and reload entire scene configurations
- Share setups across team members
- Reproduce identical results with the same config

---

## 🧭 UI Structure

- **01 Scene Config**  
  Global cinematic tone, camera, lighting, format, and main scene prompt

- **02 Casting**  
  Character slots with individual descriptions and placements

- **03 Viewport**  
  Render preview area  
  (“NO SIGNAL” indicates the scene has not been rendered yet)

---

## 🚀 Quick Start Workflow

1. Lock your **Film Style, Camera, and Lighting** first for consistency.
2. Write a concise **Scene Prompt** describing environment, mood, and action.
3. Add multiple **Environment Presets** for variation.
4. Create **Character Slots** and define appearance, action, and screen position.
5. Click **MIX ONCE** for a single result.
6. Use **AUTO LOOP** to generate multiple cinematic variations.
7. Export the configuration using **EXPORT JSON**.

---

## 🧩 Prompt Writing Guidelines

### Scene Prompt (Environment / Mood / Action)
- **Where**: Location (alley, rooftop, corridor, market)
- **Mood**: Emotional tone (tense, calm, eerie, romantic)
- **Action**: Core narrative action
- **Visual cues**: Lighting, weather, atmosphere, camera motion

https://huggingface.co/spaces/devmeta/cinecompose-ai

