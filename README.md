# CINECOMPOSE
영화적(시네마틱) 씬을 **프리셋 + 랜덤 풀(Random Pools)** 조합으로 빠르게 “믹스/루프 생성”하는 **씬 컴포지팅 UI**.

> 목표: *프롬프트를 매번 길게 쓰지 않고*  
> **Film Style / Camera & Lens / Time & Lighting / Environment Presets / Character Slots** 를 조합해
> 일관된 톤의 씬을 반복 생성(Variation)한다.

---

## ✨ 주요 기능
- **Scene Config**
  - Film Style Preset (예: Blade Runner)
  - Camera & Lens (예: Standard 35mm)
  - Time & Lighting (예: Midnight)
  - Format(Aspect Ratio), Gen Resolution, Export Width(px)
  - Scene Prompt(환경/무드/액션 메인 프롬프트)
- **Environment Presets Pool**
  - 프리셋을 여러 개 등록 → 랜덤 풀로 섞어서 반복 생성
- **Casting (Character Slots)**
  - 캐릭터 슬롯(1..N) 추가
  - 슬롯별 프롬프트/배치(Placement) 입력
  - (옵션) 레퍼런스 이미지 업로드
- **Automation Engine**
  - `MIX ONCE`: 풀에서 1회 조합 생성
  - `AUTO LOOP`: 풀에서 반복 조합 생성(배치/프롬프트 Variations)
- **JSON Import / Export**
  - 설정 전체를 JSON으로 저장/공유/재현 가능

---

## 🧭 UI 구성
- **01 Scene Config**: 씬의 전체 톤/카메라/시간대/포맷 + 메인 프롬프트
- **02 Casting**: 캐릭터 슬롯 및 슬롯별 묘사/행동/위치
- **03 Viewport**: 렌더 결과 미리보기(“NO SIGNAL”이면 아직 렌더 전)

---

## 🚀 빠른 사용법 (기본 워크플로우)
1. **Film Style / Camera / Time & Lighting** 을 먼저 고정한다. (일관성 확보)
2. **Scene Prompt** 에 “장소/무드/액션”을 한 문단으로 넣는다.
3. **Environment Presets** 에 변주하고 싶은 배경 요소를 여러 개 등록한다.
4. **Character Slot** 을 추가하고, 각 슬롯에 “외형/행동/위치”를 적는다.
5. `MIX ONCE` 로 1회 생성 → 괜찮으면 `AUTO LOOP` 로 Variations 뽑는다.
6. 마음에 드는 결과가 나오면 **EXPORT JSON** 으로 저장한다.

---

## 🧩 프롬프트 작성 팁(추천 포맷)
### Scene Prompt (환경/무드/액션)
- **Where**: 장소(실내/실외/도시/복도/옥상/시장)
- **Mood**: 톤(긴장/정적/불안/낭만/서늘)
- **Action**: 핵심 행동(추격/대치/휴식/교섭/잠입)
- **Visual cues**: 빛/안개/젖은 바닥/네온/입자/역광

예시:
- `Neon-lit alleyway after rain, dense fog and steam vents, slow dolly-in, two figures negotiating in the shadows, cinematic contrast, subtle film grain.`

### Character Slot (외형/행동/위치)
- **Appearance**: 나이대/의상/소품/실루엣
- **Action**: 동작/표정/시선
- **Placement**: 화면 좌/우/전경/중경/후경 + 카메라 거리

예시:
- `Female operative in long coat, holding a compact device, cautious expression, placed on right foreground facing left, rim light on shoulders.`

---

## 📦 JSON 포맷 (예시)
> 실제 필드는 프로젝트 코드에 맞게 조정하면 된다. 아래는 “개념 스키마” 예시.

```json
{
  "scene": {
    "filmStyle": "Blade Runner",
    "cameraLens": "Standard (35mm)",
    "timeLighting": "Midnight",
    "format": "16:9",
    "genResolution": "1K",
    "exportWidthPx": 960,
    "prompt": "Describe the environment, mood, and action..."
  },
  "environmentPresets": [
    "Rainy neon street with steam vents",
    "Crowded market signage, holograms",
    "Industrial corridor, harsh backlight"
  ],
  "casting": [
    {
      "slotId": 1,
      "name": "Character 1",
      "refImage": null,
      "descriptionPlacement": "Describe character 1 appearance, action, and position..."
    }
  ],
  "automation": {
    "mode": "mix_once",
    "seed": 12345,
    "loopCount": 12
  }
}
