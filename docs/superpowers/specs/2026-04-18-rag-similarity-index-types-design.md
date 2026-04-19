# RAG Knowledge Card — Similarity Metrics & Index Types

**Date:** 2026-04-18  
**File:** `src/knowledge.jsx` — RAG `steps[]` array

## Summary

Add two new steps to the RAG knowledge card, inserted after the existing "Vector DB internals — search" step (HNSW greedy descent). Total RAG steps goes from 8 to 10.

---

## Step 1 — Vector similarity metrics

**Position:** after current step 6 (HNSW search), before "Advanced retrieval patterns"

### Lede
Three distance functions dominate vector search: cosine similarity measures the angle between vectors (ignoring magnitude), dot product is the unnormalized inner product, and Euclidean distance measures straight-line separation. Choosing the right one for your embedding model changes retrieval quality significantly.

### Diagram — `DiagSimilarityMetrics`
- ViewBox `0 0 640 300`, origin at ~(100, 220)
- Two vectors from the origin: vector A (upper-right), vector B (more rightward)
- Arc between them labeled θ with annotation `cos θ = A·B / (|A||B|)` — cosine similarity
- Dashed straight line from tip of A to tip of B labeled `‖A−B‖` — Euclidean distance
- Bracket/projection along B axis showing dot product A·B
- Muted grid lines to reinforce 2D space
- Accent color (oklch blue) on the cosine arc as the hero metric

### Notes
- **"Cosine for text"** — Embedding models encode meaning in direction, not magnitude. Cosine cancels out length differences between short and long documents — the default for RAG.
- **"Dot product when vectors are normalized"** — If the DB stores unit-norm vectors (many do by default), dot product and cosine are mathematically identical but dot product is ~10–20% faster. Euclidean preferred for image/audio embeddings where magnitude carries information.

---

## Step 2 — Index types: IVFFlat vs HNSW

**Position:** immediately after the similarity metrics step (new step 8 of 10 total)

### Lede
Vector DBs offer multiple index types with very different speed/recall/memory tradeoffs. IVFFlat partitions the space into Voronoi cells and searches only the nearest cells at query time — low memory, but recall depends on how many cells you probe. HNSW builds a navigable graph and is faster and more accurate at query time, but costs significantly more memory.

### Diagram — `DiagIvfflatVsHnsw`
- Split-panel SVG, viewBox `0 0 640 300`
- **Left panel (IVFFlat):** scatter of dots grouped into ~4 Voronoi regions with boundary lines; query point with dashed probe-radius circle covering 2 cells; highlighted dots inside probed cells; labels `nlist = clusters`, `nprobe = cells searched`
- **Right panel (HNSW):** simplified 2-layer graph; nodes with edges; query entry at top layer descending; labels `M = edges/node`, `ef_search = beam width`
- Thin divider with "IVFFlat" / "HNSW" headers; accent color on probed cells (left) and best-path nodes (right)

### Notes
- **"Pick IVFFlat when memory is tight"** — Stores only raw vectors + compact inverted list (no graph edges). At 1B vectors, HNSW's edge overhead adds hundreds of GB. IVFFlat also supports cheap add/delete; HNSW deletions require mark-deleted + rebuild.
- **"Pick HNSW when latency matters"** — Consistently achieves higher recall at the same query latency. IVFFlat recall drops sharply if `nprobe` is too low; raising it recovers recall but increases query time linearly. For interactive RAG with tight p99 latency, HNSW is the safer default.

---

## Implementation Notes

- Use existing `Box`, `Arrow`, `SvgStage` primitives — no new shared components needed
- Both steps follow the exact object shape: `{ title, lede, Diagram, notes: [{h, b}, {h, b}] }`
- Insert after index 5 (0-based) in the RAG `steps[]` array, before the existing "Advanced retrieval patterns" step
