# SimpleSpinWheel — Foundation Prompt

Use this prompt at the start of every AI session or feature task for this project.

---

## Project

**SimpleSpinWheel** is a React Native app for creating, customizing, spinning, and sharing decision wheels. Users define wheel segments (labels, colors, weights), spin with smooth animation, save wheels locally, and share results or wheel images.

**Platform:** iOS & Android  
**Language:** TypeScript  
**Entry:** `index.js` → `src/App.tsx`

---

## Tech Stack (installed — do not replace)

| Concern | Library |
|---|---|
| UI / wheel drawing | `react-native-svg` |
| Spin animation | `react-native-reanimated` + `react-native-worklets` |
| Gestures / drag | `react-native-gesture-handler`, `react-native-draggable-flatlist` |
| Navigation | `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context` |
| Lists | `@shopify/flash-list` |
| Local storage | `react-native-mmkv` (+ `react-native-nitro-modules`) |
| Share / capture | `react-native-share`, `react-native-view-shot` |

**React Native:** 0.87.0  
**React:** 19.2.3

> **Note:** `react-native-reanimated` uses a nightly build for RN 0.87 compatibility. Do not downgrade without checking compatibility.

---

## Folder Structure

All app code lives under `src/`:

```
src/
├── App.tsx              # Providers only (gesture, safe area, navigation)
├── components/          # Reusable UI (SpinWheel, SegmentEditor, Button, …)
├── screens/             # Screen-level views (Home, Editor, History, …)
├── navigation/          # Navigators, route config
├── storage/             # MMKV keys, read/write helpers
├── domain/              # Models, business rules, wheel logic (pure TS)
├── hooks/               # Custom hooks (useWheel, useSpin, …)
├── utils/               # Helpers (colors, math, formatting)
├── theme/               # Colors, spacing, typography tokens
└── types/               # Shared TS types & navigation param lists
```

**Rules:**
- Screens compose components; they do not contain heavy business logic.
- Domain layer has **no** React imports — pure functions and types only.
- Storage access goes through `src/storage/` — never call MMKV directly from screens.
- Export public APIs from each folder's `index.ts`.

---

## Architecture Principles

1. **Minimal scope** — smallest correct change; no unrelated refactors.
2. **Match existing conventions** — read surrounding code before adding files.
3. **Separation of concerns**
   - `domain/` — wheel math, segment validation, winner selection
   - `storage/` — persistence schema & migrations
   - `hooks/` — glue between domain, storage, and UI
   - `components/` — presentational + lightly interactive UI
4. **Performance** — use Reanimated worklets for spin animation; FlashList for long segment lists.
5. **Offline-first** — all wheels stored locally via MMKV; no backend assumed.

---

## Core Domain Concepts

```ts
// src/types — extend as needed
type WheelSegment = {
  id: string;
  label: string;
  color: string;
  weight?: number; // default 1
};

type Wheel = {
  id: string;
  name: string;
  segments: WheelSegment[];
  createdAt: number;
  updatedAt: number;
};

type SpinResult = {
  id: string;
  wheelId: string;
  segmentId: string;
  segmentLabel: string;
  spunAt: number;
};
```

**Wheel logic (domain):**
- Minimum 2 segments to spin.
- Winner selected by weighted random over segments.
- Spin animation decelerates and lands on the chosen segment (angle calculated in domain, animated in component).

---

## Navigation (planned tabs)

| Tab | Purpose |
|---|---|
| **Spin** | Select / spin active wheel |
| **Wheels** | List saved wheels, create / edit / delete |
| **History** | Recent spin results |

Update `src/types/index.ts` (`RootTabParamList`) and `src/navigation/RootNavigator.tsx` when adding screens.

---

## Storage Keys (MMKV)

```ts
// src/storage/keys.ts
const KEYS = {
  wheels: 'wheels',
  activeWheelId: 'activeWheelId',
  spinHistory: 'spinHistory',
} as const;
```

Persist JSON-serialized arrays/objects. Provide typed getters/setters in `src/storage/`.

---

## Setup Already Done

- Babel: `react-native-reanimated/plugin` in `babel.config.js`
- Entry: `import 'react-native-gesture-handler'` first in `index.js`
- Providers: `GestureHandlerRootView`, `SafeAreaProvider`, `NavigationContainer` in `src/App.tsx`
- iOS pods installed

After native or Babel changes: `npm start -- --reset-cache` then rebuild.

---

## Coding Standards

- **TypeScript** strict; no `any` unless unavoidable.
- **Functional components** + hooks; no class components.
- **Named exports** for components/hooks; default export only for `App.tsx`.
- **Styles:** `StyleSheet.create` colocated with component; use `theme/` tokens for colors/spacing.
- **Comments:** only for non-obvious logic (wheel angle math, weighted random, etc.).
- **Tests:** add for domain logic; optional for simple UI.

---

## Feature Build Order

Implement in this order unless the user specifies otherwise:

1. **Domain** — `Wheel`, `WheelSegment`, validation, weighted pick, angle helpers
2. **Storage** — CRUD wheels, active wheel, spin history
3. **Components** — `SpinWheel` (SVG + Reanimated), `SegmentRow`, basic buttons
4. **Screens** — Spin, Wheels list, Editor (draggable segment list), History
5. **Navigation** — wire bottom tabs to screens
6. **Polish** — share wheel snapshot (`view-shot` + `share`), empty states, haptics (optional)

---

## Do NOT

- Add new dependencies without asking unless required for the current task.
- Put navigation types in random files — keep in `src/types/`.
- Use `AsyncStorage` — use MMKV via `src/storage/`.
- Use the legacy Animated API — use Reanimated.
- Commit secrets or modify git config.
- Create markdown/docs files unless requested.

---

## Example Task Prompt

> Implement the SpinWheel component: SVG segments from `Wheel.segments`, press Spin to call domain `pickWinner`, animate rotation with Reanimated to the computed final angle, and call `onSpinComplete(result)`.

---

## Current State

- ✅ Dependencies installed & linked
- ✅ `src/` scaffold in place
- ✅ Single **Home** tab placeholder screen
- ⬜ Domain models & logic
- ⬜ Storage layer
- ⬜ SpinWheel component
- ⬜ Full tab navigation & screens
