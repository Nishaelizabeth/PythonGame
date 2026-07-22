# 🐍 Python Quest — Elizabeth's Adventure

A complete, magical, **frontend-only** educational adventure game that teaches Python
programming through 12 hand-crafted mini-games. Built for Elizabeth. No backend,
no database — progress is saved in the browser with `localStorage` and it works offline.

---

## ✨ What it is

One continuous adventure across 12 enchanted kingdoms. Every kingdom follows the same
magical learning flow:

> **Story → Mission → Game → Mission Complete → Reflection → Gameplay Explanation →
> Python Concept → Python Code → Practice Activity → Continue Adventure**

The learner never reads a textbook — they *play*, then discover the Python idea hiding
inside the game they just played.

### The 12 Kingdoms

| # | Kingdom | Concept | The Game |
|---|---------|---------|----------|
| 1 | 🏡 Programming Village | Programming & Algorithms | Order the steps to guide a robot to the bakery |
| 2 | 🌲 Memory Forest | Variables, Keywords, Identifiers | Drop treasures into the correctly named chests |
| 3 | ⛰️ Data Type Mountain | String / Integer / Float / Boolean | Sort falling crystals into the right type bins |
| 4 | 🌉 Operator Valley | All 6 operator families | Pick the operator that lights each bridge |
| 5 | 🏙️ Input & Output Town | print/input/int/float/str/type | A talking machine reveals why `"5" + "5"` ≠ 10 |
| 6 | 🚦 Traffic City | `if` | Drive — the police catch you IF speed > 80 |
| 7 | 🛣️ Highway Escape | `if / else` | Swerve if blocked, else stay |
| 8 | ⚽ Football Championship | `if / elif / else` | Power meter: miss / saved / GOAL |
| 9 | 🧟 Zombie Forest | `for` loop | Repeat your zap for every zombie in the wave |
| 10 | 🏛️ Temple Escape | `while` loop | Keep running WHILE stamina > 0 |
| 11 | 🏝️ Treasure Island | Lists & indexing | Collect treasures into an inventory list |
| 12 | 🧙 Wizard Academy | Functions | Define a spell, cast it with arguments, use its return |

---

## 🚀 Run it

```bash
npm install      # already done if node_modules exists
npm run dev      # start the dev server (opens the browser)
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

Other commands:

```bash
npm run build    # production build into /dist
npm run preview  # preview the production build
```

---

## 🧱 Tech stack

- **React 18** + **Vite** — fast, modern SPA
- **Tailwind CSS** — colorful, elegant styling
- **Framer Motion** — smooth animations & page transitions
- **React Router (HashRouter)** — navigation that works from any static host
- **localStorage** — saves current level, XP, coins, stars, badges & completed levels

No backend. No database. Fully offline (decorative Google Fonts fall back to system fonts).

---

## 📁 Project structure

```
src/
  context/         GameContext (progress + localStorage), BreadcrumbContext
  data/            levels.js (all story + teaching content), achievements.js
  components/      Background, Navbar, Breadcrumbs, HUD, Confetti, FlowChart, CodeBlock...
    game/          GameShell (countdown/pause/restart/win/lose), useGameMachine, useRaf
  levels/          StorySection, ReflectionSection
    games/         Level1Game … Level12Game (+ index.js registry)
  pages/           Home, WorldMap, Level, Achievements, Profile, Settings, NotFound
```

Every game shares `GameShell`, so they all get a countdown, pause, restart, and polished
victory / game-over overlays for free.

---

Made with love for Elizabeth. Happy questing! 🌟
