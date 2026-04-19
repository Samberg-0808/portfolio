# RAG Similarity Metrics & Index Types — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new steps to the RAG knowledge card — one explaining vector similarity metrics (cosine, dot product, Euclidean) with a geometry diagram, and one comparing IVFFlat vs HNSW index types with a split-panel diagram.

**Architecture:** All changes are in `src/knowledge.jsx`. Two new SVG diagram components (`DiagSimilarityMetrics`, `DiagIvfflatVsHnsw`) are added in the diagram section. Two new step objects are spliced into the RAG `steps[]` array after index 5 (the existing HNSW search step), before "Advanced retrieval patterns".

**Tech Stack:** Vanilla JSX loaded via CDN (no build step). Uses existing `SvgStage`, `Box`, `Arrow` SVG primitives already defined at the top of `src/knowledge.jsx`.

---

## File Map

| Action | File | What changes |
|--------|------|--------------|
| Modify | `src/knowledge.jsx` | Add 2 SVG components (~100 lines), insert 2 step objects into `KNOWLEDGE[0].steps` |

---

### Task 1: Add `DiagSimilarityMetrics` component

**Files:**
- Modify: `src/knowledge.jsx` — insert after the closing `};` of `DiagHnswSearch` (around line 343) and before the `// ---------- Advanced RAG ----------` comment (around line 345)

- [ ] **Step 1: Insert the component**

Add the following block between the `DiagHnswSearch` component and the `DiagAdvancedRag` component:

```jsx
const DiagSimilarityMetrics = () => {
  // Origin O=(100,240), vector A tip=(200,80), vector B tip=(440,190)
  // Arc endpoints at r=55 along each vector direction
  const ox = 100, oy = 240;
  const ax = 200, ay = 80;
  const bx = 440, by = 190;
  // Unit vector OA: (100,-160)/188.7 ≈ (0.530,-0.848); at r=55: (129,193)
  // Unit vector OB: (340,-50)/343.7 ≈ (0.989,-0.145); at r=55: (154,232)
  // Projection foot of A onto OB line: (221,222)
  return (
    <SvgStage vb="0 0 640 300">
      <defs>
        <marker id="sim-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#0b1020" />
        </marker>
      </defs>
      {/* axis guide lines */}
      <line x1={ox} y1={20} x2={ox} y2={oy} stroke="rgba(12,18,40,0.08)" strokeWidth="1" />
      <line x1={ox} y1={oy} x2={580} y2={oy} stroke="rgba(12,18,40,0.08)" strokeWidth="1" />
      {/* origin */}
      <circle cx={ox} cy={oy} r={4} fill="#0b1020" />
      <text x={ox - 12} y={oy + 14} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">O</text>
      {/* vector A */}
      <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#0b1020" strokeWidth="2" markerEnd="url(#sim-arr)" />
      <text x={ax + 6} y={ay - 4} fontSize="13" fontWeight="600" fontFamily="Inter, system-ui" fill="#0b1020">A</text>
      {/* vector B */}
      <line x1={ox} y1={oy} x2={bx} y2={by} stroke="#0b1020" strokeWidth="2" markerEnd="url(#sim-arr)" />
      <text x={bx + 6} y={by + 4} fontSize="13" fontWeight="600" fontFamily="Inter, system-ui" fill="#0b1020">B</text>
      {/* cosine arc θ — accent blue, arc from (129,193) to (154,232) */}
      <path d="M 129 193 A 55 55 0 0 1 154 232" fill="none" stroke="oklch(0.58 0.18 265)" strokeWidth="2.5" />
      <text x={155} y={202} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="oklch(0.45 0.18 265)">θ</text>
      {/* cosine label pill */}
      <rect x={116} y={130} width={210} height={22} rx="5" fill="oklch(0.94 0.05 265)" stroke="oklch(0.75 0.12 265)" strokeWidth="1" />
      <text x={221} y={145} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.38 0.18 265)">cos θ = A·B / (|A| |B|)</text>
      {/* Euclidean dashed line A→B */}
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="oklch(0.62 0.18 30)" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x={(ax + bx) / 2 + 10} y={(ay + by) / 2 - 12} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.48 0.18 30)">‖A − B‖</text>
      {/* dot product: perpendicular from A tip to projection foot on OB */}
      <line x1={ax} y1={ay} x2={221} y2={222} stroke="#858ea3" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* right-angle mark at projection foot (221,222) */}
      <polyline points="215,213 224,210 227,219" fill="none" stroke="#858ea3" strokeWidth="1.2" />
      <text x={232} y={242} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">A·B (proj)</text>
      {/* legend */}
      <line x1={480} y1={38} x2={510} y2={38} stroke="oklch(0.58 0.18 265)" strokeWidth="2.5" />
      <text x={516} y={42} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">cosine</text>
      <line x1={480} y1={58} x2={510} y2={58} stroke="oklch(0.62 0.18 30)" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x={516} y={62} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">Euclidean (L2)</text>
      <line x1={480} y1={78} x2={510} y2={78} stroke="#858ea3" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={516} y={82} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">dot product</text>
    </SvgStage>
  );
};
```

- [ ] **Step 2: Open `index.html` in a browser and visually verify**

Expected: no JS errors in console, the RAG card's new similarity step shows two vectors from an origin with a blue arc (θ), a dashed orange line between the tips, and a grey dashed perpendicular. Legend appears top-right.

- [ ] **Step 3: Commit**

```bash
git add src/knowledge.jsx
git commit -m "feat: add DiagSimilarityMetrics SVG component"
```

---

### Task 2: Add `DiagIvfflatVsHnsw` component

**Files:**
- Modify: `src/knowledge.jsx` — insert immediately after the closing `};` of `DiagSimilarityMetrics`

- [ ] **Step 1: Insert the component**

Add the following block immediately after `DiagSimilarityMetrics`:

```jsx
const DiagIvfflatVsHnsw = () => (
  <SvgStage vb="0 0 640 300">
    {/* ── Left panel: IVFFlat ── */}
    <rect x={12} y={12} width={290} height={276} rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(12,18,40,0.14)" />
    <text x={157} y={32} textAnchor="middle" fontSize="12" fontWeight="600" fontFamily="Inter, system-ui" fill="#0b1020">IVFFlat</text>
    {/* cell boundary lines (rough Voronoi dividers) */}
    <line x1={157} y1={44} x2={157} y2={268} stroke="rgba(12,18,40,0.15)" strokeWidth="1" strokeDasharray="4 3" />
    <line x1={20} y1={156} x2={294} y2={156} stroke="rgba(12,18,40,0.15)" strokeWidth="1" strokeDasharray="4 3" />
    {/* probed cells highlight (top-left and top-right) */}
    <rect x={14} y={44} width={141} height={110} rx="8" fill="oklch(0.92 0.05 265)" opacity="0.6" />
    <rect x={158} y={44} width={141} height={110} rx="8" fill="oklch(0.92 0.05 265)" opacity="0.6" />
    {/* dots — top-left cluster (probed) */}
    <circle cx={55}  cy={75}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={88}  cy={90}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={70}  cy={118} r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={115} cy={80}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={130} cy={130} r={5} fill="oklch(0.58 0.18 265)" />
    {/* dots — top-right cluster (probed) */}
    <circle cx={185} cy={68}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={220} cy={95}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={200} cy={128} r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={255} cy={72}  r={5} fill="oklch(0.58 0.18 265)" />
    {/* dots — bottom clusters (not probed) */}
    <circle cx={60}  cy={185} r={5} fill="#c8cdd9" />
    <circle cx={100} cy={210} r={5} fill="#c8cdd9" />
    <circle cx={130} cy={190} r={5} fill="#c8cdd9" />
    <circle cx={190} cy={200} r={5} fill="#c8cdd9" />
    <circle cx={240} cy={220} r={5} fill="#c8cdd9" />
    <circle cx={270} cy={185} r={5} fill="#c8cdd9" />
    {/* query point */}
    <circle cx={148} cy={110} r={7} fill="none" stroke="#e05a5a" strokeWidth="2" strokeDasharray="3 2" />
    <circle cx={148} cy={110} r={3} fill="#e05a5a" />
    {/* probe radius circle */}
    <circle cx={148} cy={110} r={58} fill="none" stroke="#e05a5a" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
    <text x={148} y={125} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#e05a5a">query</text>
    {/* labels */}
    <text x={157} y={256} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">nlist = 4 clusters</text>
    <text x={157} y={271} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">nprobe = 2 cells searched</text>

    {/* ── Right panel: HNSW ── */}
    <rect x={338} y={12} width={290} height={276} rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(12,18,40,0.14)" />
    <text x={483} y={32} textAnchor="middle" fontSize="12" fontWeight="600" fontFamily="Inter, system-ui" fill="#0b1020">HNSW</text>
    {/* Layer 1 (coarse) */}
    <rect x={348} y={44} width={270} height={80} rx="8" fill="rgba(255,255,255,0.5)" stroke="rgba(12,18,40,0.12)" strokeDasharray="4 3" />
    <text x={358} y={62} fontSize="9" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="#858ea3">Layer 1</text>
    <circle cx={400} cy={88} r={6} fill="#c8cdd9" />
    <circle cx={460} cy={78} r={8} fill="oklch(0.58 0.18 265)" />
    <circle cx={540} cy={92} r={6} fill="#c8cdd9" />
    <circle cx={590} cy={76} r={6} fill="#c8cdd9" />
    <line x1={400} y1={88} x2={460} y2={78} stroke="rgba(12,18,40,0.2)" strokeWidth="1" />
    <line x1={460} y1={78} x2={540} y2={92} stroke="rgba(12,18,40,0.2)" strokeWidth="1" />
    <line x1={540} y1={92} x2={590} y2={76} stroke="rgba(12,18,40,0.2)" strokeWidth="1" />
    <text x={460} y={100} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#2a3249">entry</text>
    {/* descent arrow — use Arrow component so its defs marker is present */}
    <Arrow x1={460} y1={124} x2={460} y2={144} />
    {/* Layer 0 (dense) */}
    <rect x={348} y={148} width={270} height={100} rx="8" fill="rgba(255,255,255,0.8)" stroke="rgba(12,18,40,0.15)" />
    <text x={358} y={166} fontSize="9" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="#0b1020">Layer 0</text>
    {[375,405,430,458,482,510,540,565].map((cx, i) => (
      <circle key={i} cx={cx} cy={210} r={i >= 2 && i <= 4 ? 7 : 4}
        fill={i >= 2 && i <= 4 ? "oklch(0.58 0.18 265)" : "#c8cdd9"} />
    ))}
    {/* edges in layer 0 */}
    {[375,405,430,458,482,510,540].map((cx, i) => (
      <line key={i} x1={cx} y1={210} x2={[375,405,430,458,482,510,540,565][i+1]} y2={210}
        stroke="rgba(12,18,40,0.18)" strokeWidth="1" />
    ))}
    <text x={483} y={234} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#2a3249">top-3 neighbours</text>
    {/* labels */}
    <text x={483} y={256} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">M = edges per node</text>
    <text x={483} y={271} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">ef_search = beam width</text>
  </SvgStage>
);
```

- [ ] **Step 2: Visually verify in browser**

Expected: split panel, left shows IVFFlat with 4 quadrant cells, top 2 highlighted blue, a red query point with dashed probe circle, grey dots in bottom cells. Right shows HNSW 2-layer graph with accent nodes in layer 0.

- [ ] **Step 3: Commit**

```bash
git add src/knowledge.jsx
git commit -m "feat: add DiagIvfflatVsHnsw SVG component"
```

---

### Task 3: Insert the two new step objects into the RAG steps array

**Files:**
- Modify: `src/knowledge.jsx` — `KNOWLEDGE[0].steps[]` array, after the object with `title: "Vector DB internals — search"` (currently the 6th element, 0-based index 5), before the object with `title: "Advanced retrieval patterns"`

- [ ] **Step 1: Insert the similarity metrics step**

Find this line in `KNOWLEDGE[0].steps` (the end of the "Vector DB internals — search" step object, around line 635):

```js
      },
      {
        title: "Advanced retrieval patterns",
```

Replace it with:

```js
      },
      {
        title: "Vector similarity metrics",
        lede: "Three distance functions dominate vector search: cosine similarity measures the angle between vectors (ignoring magnitude), dot product is the unnormalized inner product, and Euclidean distance measures straight-line separation. Choosing the right one for your embedding model changes retrieval quality significantly.",
        Diagram: DiagSimilarityMetrics,
        notes: [
          { h: "Cosine for text", b: <React.Fragment>Embedding models like <code>text-embedding-3</code> encode meaning in <em>direction</em>, not magnitude. Cosine cancels out length differences between short and long documents — the default choice for RAG pipelines.</React.Fragment> },
          { h: "Dot product when vectors are unit-normalised", b: <React.Fragment>If your vector DB stores unit-norm vectors (many do by default), dot product and cosine are mathematically identical but dot product skips the normalisation division — roughly 10–20% faster. Euclidean is preferred for image or audio embeddings where magnitude carries semantic information.</React.Fragment> },
        ],
      },
      {
        title: "Index types: IVFFlat vs HNSW",
        lede: "Vector DBs offer multiple index types with very different speed/recall/memory tradeoffs. IVFFlat partitions the space into Voronoi cells and searches only the nearest cells at query time — low memory, but recall depends on how many cells you probe. HNSW builds a navigable graph and is faster at query time, but costs significantly more memory.",
        Diagram: DiagIvfflatVsHnsw,
        notes: [
          { h: "Pick IVFFlat when memory is tight", b: <React.Fragment>IVFFlat stores only raw vectors plus a compact inverted list — no graph edges. At 1B vectors, HNSW's edge overhead adds hundreds of GB. IVFFlat also supports cheap add/delete; HNSW deletions require a mark-deleted workaround and periodic rebuild.</React.Fragment> },
          { h: "Pick HNSW when latency matters", b: <React.Fragment>HNSW consistently achieves higher recall at the same query latency. IVFFlat recall drops sharply if <code>nprobe</code> is too low; raising it recovers recall but increases query time linearly. For interactive RAG with tight p99 latency requirements, HNSW is the safer default.</React.Fragment> },
        ],
      },
      {
        title: "Advanced retrieval patterns",
```

- [ ] **Step 2: Visually verify in browser**

Load `index.html`. Navigate to the RAG knowledge card. Step through the cards to confirm:
- Steps 7 and 8 now appear: "Vector similarity metrics" and "Index types: IVFFlat vs HNSW"
- Both diagrams render without JS errors
- The step count increments correctly through all 10 steps
- "Advanced retrieval patterns" is still present after the two new steps

- [ ] **Step 3: Commit**

```bash
git add src/knowledge.jsx
git commit -m "feat: add vector similarity metrics and IVFFlat vs HNSW steps to RAG card"
```
