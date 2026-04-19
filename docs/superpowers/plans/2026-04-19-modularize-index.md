# Modularize index.html Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 2400-line `index.html` into focused source files with no changes to behavior, component APIs, or visual output.

**Architecture:** Each source file is a straight line-range extraction from `index.html`. Babel standalone loads external `.jsx` files via `<script type="text/babel" src="...">`, evaluating them in DOM order so globals defined in earlier scripts are available to later ones — exactly the same as the current single-file behavior.

**Tech Stack:** React 18 (CDN UMD), Babel standalone (CDN), vanilla JS canvas, no build step.

---

## File Map

| File | Action | Content |
|---|---|---|
| `index.html` | Rewrite | Skeleton only (~20 lines) |
| `src/styles.css` | Create/Replace | CSS from `<style>` block (index.html lines 11–694) |
| `src/background.js` | Create | Monet canvas IIFE (index.html lines 706–1035) |
| `src/glass.jsx` | Replace | GlassSurface, GlassPill, Background (index.html lines 1038–1096) |
| `src/diagrams.jsx` | Create | Box, Arrow, SvgStage, all Diag* (index.html lines 1098–1740) |
| `src/knowledge.jsx` | Replace | React hooks + KNOWLEDGE + KnowledgeGrid + KnowledgeDetail |
| `src/app.jsx` | Replace | Hero, ProjectVisual, Projects, TweaksPanel, App, render |

---

## Testing Note

This is a pure extraction — no logic changes. There are no automated tests. Verification is: open `index.html` in a browser and confirm the page looks and behaves identically to before. Test after Task 7 (full skeleton rewrite). A local file server is required because browsers block `<script src>` on `file://` — run `npx serve .` or `python3 -m http.server 8080` from the project root.

---

## Task 1: Extract CSS to src/styles.css

**Files:**
- Create/Replace: `src/styles.css`

- [ ] **Step 1: Copy CSS content from index.html**

  Open `index.html`. Copy everything between (not including) `<style>` (line 10) and `</style>` (line 695) — that is, lines 11–694 — into `src/styles.css`. The file should start with `:root {` and end with the last `}` before `</style>`.

- [ ] **Step 2: Commit**

  ```bash
  git add src/styles.css
  git commit -m "feat: extract CSS to src/styles.css"
  ```

---

## Task 2: Extract canvas animation to src/background.js

**Files:**
- Create: `src/background.js`

- [ ] **Step 1: Copy canvas IIFE from index.html**

  Copy lines 706–1035 from `index.html` into `src/background.js`. The file should start with `// Animated background — Impression, Sunrise after Monet` and end with `  });` followed by `})();`. Do not include the `<script>` or `</script>` tags.

- [ ] **Step 2: Commit**

  ```bash
  git add src/background.js
  git commit -m "feat: extract canvas animation to src/background.js"
  ```

---

## Task 3: Populate src/glass.jsx

**Files:**
- Replace: `src/glass.jsx`

- [ ] **Step 1: Write src/glass.jsx**

  Copy lines 1038–1096 from `index.html` into `src/glass.jsx`. The file should start with the comment `// Liquid glass primitives...` (line 1038) and end with `Object.assign(window, { GlassSurface, GlassPill, Background });` (line 1096).

  Do not include the `<script type="text/babel">` opening tag (line 1037).

  The final line of the file must be:
  ```js
  Object.assign(window, { GlassSurface, GlassPill, Background });
  ```
  This exports the three components onto `window` so later babel scripts can reference them as globals.

- [ ] **Step 2: Commit**

  ```bash
  git add src/glass.jsx
  git commit -m "feat: populate src/glass.jsx with glass primitives"
  ```

---

## Task 4: Create src/diagrams.jsx

**Files:**
- Create: `src/diagrams.jsx`

- [ ] **Step 1: Write src/diagrams.jsx**

  Copy lines 1098–1740 from `index.html` into `src/diagrams.jsx`. The file should start with the comment `// Interactive step-by-step walkthroughs...` (line 1098) and end with `);` closing `DiagIvfflatVsHnsw` or whichever Diag component ends at line 1740.

  After the last `Diag*` component definition, add this line to export all diagram components as globals:

  ```js
  Object.assign(window, { Box, Arrow, SvgStage, DiagRagOverview, DiagRagChunking, DiagRagRetrieval, DiagRagGenerate, DiagAgentLoop, DiagAgentReAct, DiagAgentTools, DiagAgentMemory, DiagMlPipeline, DiagMlSupervised, DiagMlLoss, DiagMlEval, DiagVectorDbStorage, DiagHnswSearch, DiagSimilarityMetrics, DiagIvfflatVsHnsw, DiagAdvancedRag, DiagRagEval, DiagAgentPlanning, DiagMultiAgent, DiagAgentSafety, DiagNeuralNet, DiagOverfitting, DiagFeatureEng, DiagHyperparams });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/diagrams.jsx
  git commit -m "feat: extract diagram components to src/diagrams.jsx"
  ```

---

## Task 5: Populate src/knowledge.jsx

**Files:**
- Replace: `src/knowledge.jsx`

`knowledge.jsx` assembles content from two non-adjacent regions of `index.html`, plus the React hooks destructure line.

- [ ] **Step 1: Write src/knowledge.jsx**

  Each Babel `<script>` has an isolated scope. `knowledge.jsx` must explicitly import everything it needs from `window` before using it.

  The file has four parts assembled in this order:

  **Part A** — Window imports (add these as the first lines):
  ```js
  const { useState, useEffect, useMemo, useRef } = React;
  const { GlassSurface, GlassPill,
          DiagRagOverview, DiagRagChunking, DiagRagRetrieval, DiagRagGenerate,
          DiagAgentLoop, DiagAgentReAct, DiagAgentTools, DiagAgentMemory,
          DiagMlPipeline, DiagMlSupervised, DiagMlLoss, DiagMlEval,
          DiagVectorDbStorage, DiagHnswSearch, DiagSimilarityMetrics, DiagIvfflatVsHnsw,
          DiagAdvancedRag, DiagRagEval, DiagAgentPlanning, DiagMultiAgent, DiagAgentSafety,
          DiagNeuralNet, DiagOverfitting, DiagFeatureEng, DiagHyperparams } = window;
  ```

  **Part B** — KNOWLEDGE data array and its window export:
  Copy lines 1742–2020 from `index.html`. Starts with `const KNOWLEDGE = [` and ends with `window.KNOWLEDGE = KNOWLEDGE;`.

  **Part C** — KnowledgeGrid and KnowledgeDetail components:
  Copy lines 2139–2240 from `index.html`. Starts with `// ---------- Knowledge ----------` and ends with `};` closing `KnowledgeDetail`.

  **Part D** — Export:
  ```js
  Object.assign(window, { KnowledgeGrid, KnowledgeDetail });
  ```

  The complete file structure is:
  ```
  const { useState, useEffect, useMemo, useRef } = React;
  const { GlassSurface, GlassPill, DiagRagOverview, ... } = window;  // full list above

  // [KNOWLEDGE array — lines 1742–2020]

  // ---------- Knowledge ----------
  // [KnowledgeGrid — lines 2139–2171]
  // [KnowledgeDetail — lines 2172–2240]

  Object.assign(window, { KnowledgeGrid, KnowledgeDetail });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/knowledge.jsx
  git commit -m "feat: populate src/knowledge.jsx with data and components"
  ```

---

## Task 6: Populate src/app.jsx

**Files:**
- Replace: `src/app.jsx`

`app.jsx` contains the remaining UI components and the render call. Each Babel `<script>` has isolated scope — `app.jsx` needs its own hooks destructure even though `knowledge.jsx` also has one.

- [ ] **Step 1: Write src/app.jsx**

  Start the file with these window imports:
  ```js
  const { useState, useEffect, useMemo, useRef } = React;
  const { GlassSurface, GlassPill, Background, KnowledgeGrid, KnowledgeDetail } = window;
  ```

  Then copy these line ranges from `index.html` in order:

  - Lines 2024–2136: `// ---------- Hero / Info ----------` through end of `Projects` component
  - Lines 2242–2397: `// ---------- Tweaks panel ----------` through `ReactDOM.createRoot(document.getElementById("root")).render(<App />);`

  The file should end with:
  ```js
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  ```

  Do not include the `</script>` tag (line 2399).

- [ ] **Step 2: Commit**

  ```bash
  git add src/app.jsx
  git commit -m "feat: populate src/app.jsx with app components and render"
  ```

---

## Task 7: Rewrite index.html as skeleton

**Files:**
- Rewrite: `index.html`

- [ ] **Step 1: Replace index.html with the skeleton**

  Replace the entire contents of `index.html` with:

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="src/styles.css" />
  <script>window.__TWEAKS__ = {"glass":"heavy","accent":"indigo","bg":"warm","density":"comfy"};</script>
  </head>
  <body>
  <div id="root"></div>
  <script src="src/background.js"></script>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
  <script type="text/babel" src="src/glass.jsx"></script>
  <script type="text/babel" src="src/diagrams.jsx"></script>
  <script type="text/babel" src="src/knowledge.jsx"></script>
  <script type="text/babel" src="src/app.jsx"></script>
  </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add index.html
  git commit -m "refactor: replace monolithic index.html with modular file structure"
  ```

---

## Task 8: Verify in browser

**Files:** None modified.

- [ ] **Step 1: Start a local server**

  From the project root:
  ```bash
  npx serve . -p 3000
  # or: python3 -m http.server 3000
  ```

  Open `http://localhost:3000` in a browser.

- [ ] **Step 2: Visual check**

  Confirm all of the following match the original:
  - Animated Monet canvas background plays
  - Hero section renders with name, role, bio, glass surface
  - Projects section renders
  - Knowledge cards render (3 cards visible)
  - Clicking a knowledge card opens the step-through detail view
  - Stepping through a knowledge card shows diagrams at each step
  - Tweaks panel opens and applies glass/accent/bg/density changes

- [ ] **Step 3: Check browser console**

  Open DevTools → Console. There should be zero errors. If you see `GlassSurface is not defined` or similar, the load order is wrong — verify that `glass.jsx` loads before `diagrams.jsx`, `knowledge.jsx`, and `app.jsx` in `index.html`.
