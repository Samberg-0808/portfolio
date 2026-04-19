# Modularize index.html — Design Spec

**Date:** 2026-04-19  
**Status:** Approved

## Problem

`index.html` is 2400 lines, containing CSS, vanilla JS, and JSX all in one file. It is difficult to navigate and edit.

## Goal

Split `index.html` into focused files with a single clear purpose each, with no changes to behavior, component APIs, or visual output.

## Approach

Keep the no-build-step setup (Babel standalone). Babel supports `<script type="text/babel" src="...">` for external JSX files. CSS is extracted to a `<link>` stylesheet. Pure JS is a regular `<script src>`.

## Output File Structure

```
index.html          ~15 lines — skeleton only
src/
  styles.css        ~685 lines — all CSS (extracted from <style> block)
  background.js     ~330 lines — Monet canvas animation IIFE (vanilla JS)
  glass.jsx         ~65 lines  — GlassSurface, GlassPill
  diagrams.jsx      ~590 lines — Box, Arrow, SvgStage, all Diag* components
  knowledge.jsx     ~360 lines — KNOWLEDGE data array, KnowledgeGrid, KnowledgeDetail
  app.jsx           ~210 lines — Hero, ProjectVisual, Projects, TweaksPanel, App, ReactDOM render
```

## index.html Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Portfolio</title>
  <!-- fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="...google fonts url..." rel="stylesheet" />
  <!-- styles -->
  <link rel="stylesheet" href="src/styles.css" />
  <!-- tweaks config — must be inline, read before scripts run -->
  <script>window.__TWEAKS__ = {"glass":"heavy","accent":"indigo","bg":"warm","density":"comfy"};</script>
</head>
<body>
<div id="root"></div>
<script src="src/background.js"></script>
<script src="https://unpkg.com/react@18.3.1/..."></script>
<script src="https://unpkg.com/react-dom@18.3.1/..."></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/..."></script>
<script type="text/babel" src="src/glass.jsx"></script>
<script type="text/babel" src="src/diagrams.jsx"></script>
<script type="text/babel" src="src/knowledge.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
</body>
</html>
```

## Load Order

Scripts execute in DOM order. Babel transpiles each `text/babel` file before the next is evaluated, so globals (e.g. `GlassSurface`) are available to later files. This mirrors the current single-file behavior.

- `background.js` runs before React loads (canvas setup only, no React dependency)
- `glass.jsx` — defines GlassSurface, GlassPill (used by all later JSX files)
- `diagrams.jsx` — defines Box, Arrow, SvgStage, Diag* (used by knowledge.jsx)
- `knowledge.jsx` — defines KNOWLEDGE data, KnowledgeGrid, KnowledgeDetail (used by app.jsx)
- `app.jsx` — defines Hero, Projects, TweaksPanel, App; calls ReactDOM.createRoot

## Constraints

- No logic changes, no component renames, no prop changes
- No behavior or visual changes
- `window.__TWEAKS__` stays inline in index.html (must be set before any script)
- Existing `src/` files (glass.jsx, app.jsx, knowledge.jsx, styles.css) will be replaced with correct content

## Out of Scope

- Moving to a build tool (Vite, esbuild)
- ES module imports/exports
- Component refactoring
- Any feature changes
