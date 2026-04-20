const { useState, useEffect, useMemo, useRef } = React;
const { GlassSurface, GlassPill,
        DiagRagOverview, DiagRagChunking, DiagRagRetrieval, DiagRagGenerate,
        DiagAgentLoop, DiagAgentReAct, DiagAgentTools, DiagAgentMemory,
        DiagMlPipeline, DiagMlSupervised, DiagMlLoss, DiagMlEval,
        DiagVectorDbStorage, DiagHnswSearch, DiagSimilarityMetrics, DiagIvfflatVsHnsw,
        DiagAdvancedRag, DiagRagEval, DiagAgentPlanning, DiagMultiAgent, DiagAgentSafety,
        DiagNeuralNet, DiagOverfitting, DiagFeatureEng, DiagHyperparams } = window;

const KNOWLEDGE = [
  {
    id: "rag",
    title: "Retrieval-Augmented Generation",
    short: "RAG",
    summary: "Give an LLM a knowledge base to lean on — so answers stay grounded and up-to-date without retraining.",
    topics: ["chunking", "embeddings", "vector search", "grounding"],
    depth: "intermediate",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 7h12M4 12h16M4 17h10" stroke="oklch(0.58 0.18 265)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="19" cy="17" r="2.5" stroke="oklch(0.58 0.18 265)" strokeWidth="1.8" />
      </svg>
    ),
    steps: [
      {
        title: "Why RAG exists",
        lede: "LLMs have frozen training data. For anything private, fresh, or obscure, they hallucinate. RAG fixes this by retrieving relevant passages and stuffing them into the prompt as evidence.",
        Diagram: DiagRagOverview,
        notes: [
          { h: "The core trick", b: <React.Fragment>Don't retrain the model — <code>retrieve</code> from a searchable index of your docs, then <code>generate</code> with that context.</React.Fragment> },
          { h: "When to reach for it", b: <React.Fragment>Internal docs, rapidly-changing facts, citation requirements, or any domain too narrow to fine-tune on.</React.Fragment> },
        ],
      },
      {
        title: "Chunk & embed",
        lede: "You can't cram a whole corpus into a prompt. Split docs into chunks (typically 200–1000 tokens) and encode each chunk as a dense vector using an embedding model.",
        Diagram: DiagRagChunking,
        notes: [
          { h: "Chunk size tradeoff", b: <React.Fragment>Small = precise but loses context. Large = more context but diluted signal. Start at 512 with 10–15% overlap.</React.Fragment> },
          { h: "Embedding model", b: <React.Fragment>Pick one tuned for your text domain (e.g. <code>text-embedding-3-small</code> for general English, or a multilingual model for i18n).</React.Fragment> },
        ],
      },
      {
        title: "Retrieve top-k",
        lede: "At query time, embed the question with the same model and find the k nearest chunks in vector space — usually via cosine similarity in a vector DB (pgvector, Pinecone, etc.).",
        Diagram: DiagRagRetrieval,
        notes: [
          { h: "Hybrid search wins", b: <React.Fragment>Combine dense (vector) and sparse (BM25) scores. Pure vector search often misses exact-term matches like product SKUs.</React.Fragment> },
          { h: "Rerank on top", b: <React.Fragment>A cross-encoder reranker on the top-50 candidates often lifts quality more than a better embedding model.</React.Fragment> },
        ],
      },
      {
        title: "Generate & ground",
        lede: "Assemble the retrieved chunks, user query, and a system prompt that tells the model to only answer from the given context — then generate.",
        Diagram: DiagRagGenerate,
        notes: [
          { h: "Guardrail prompt", b: <React.Fragment>Include: "If the context doesn't contain the answer, say so." This cuts confident hallucinations sharply.</React.Fragment> },
          { h: "Return citations", b: <React.Fragment>Ask the model to output chunk IDs alongside claims. Render them as footnotes — trust, but verify.</React.Fragment> },
        ],
      },
      {
        title: "Vector DB internals — storage",
        lede: "Embeddings are stored as dense float32 arrays alongside a metadata payload. An HNSW index is built in memory so approximate nearest-neighbour queries run in milliseconds. Understanding the storage model lets you tune capacity and cost.",
        Diagram: DiagVectorDbStorage,
        notes: [
          { h: "Index vs store", b: <React.Fragment>The HNSW index accelerates search; the payload store (often JSONB) holds filterable metadata. Most vector DBs support pre-filter (on metadata) and post-filter (on score) — pre-filter is faster, post-filter is more precise.</React.Fragment> },
          { h: "Storage cost", b: <React.Fragment>A 1536-dim float32 vector costs 6 KB. One million chunks ≈ 6 GB. The HNSW index adds ~20–50% overhead. Quantise to int8 for a 4× memory saving with minimal recall loss.</React.Fragment> },
        ],
      },
      {
        title: "Vector DB internals — search",
        lede: "HNSW search enters at a sparse top layer, greedily descends through progressively denser layers, then runs a beam search on the bottom layer to find the true top-k nearest neighbours. This gives sub-linear query time on billion-scale indices.",
        Diagram: DiagHnswSearch,
        notes: [
          { h: "ef_construction vs ef_search", b: <React.Fragment><code>ef_construction</code> controls how many candidates are evaluated when building the graph — higher means better recall but slower indexing. <code>ef_search</code> is the query-time beam width; increase it to trade latency for recall.</React.Fragment> },
          { h: "ANN vs exact search", b: <React.Fragment>HNSW is approximate — it can miss the true nearest neighbour by design. For most RAG workloads a ~1% miss rate is fine. For high-precision use cases, combine with a flat exact-search on a filtered candidate set.</React.Fragment> },
        ],
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
        lede: "Vanilla single-query retrieval often misses relevant chunks. Multi-query expansion generates several query variants in parallel; HyDE embeds a hypothetical answer rather than the question itself to close the query-document gap.",
        Diagram: DiagAdvancedRag,
        notes: [
          { h: "HyDE in practice", b: <React.Fragment>Hypothetical Document Embeddings work because the embedding space for answers is closer to the document space than questions are. Generating a one-sentence answer with the LLM, then embedding that, can sharply improve recall on complex queries.</React.Fragment> },
          { h: "Cross-encoder reranking", b: <React.Fragment>Retrieve 50–100 candidates cheaply via vector search, then score each (query, chunk) pair jointly with a BERT-class cross-encoder. Slower, but far more accurate for subtle relevance — often a bigger quality win than improving the embedding model.</React.Fragment> },
        ],
      },
      {
        title: "Evaluate your RAG system",
        lede: "RAGAS measures four orthogonal quality signals: context recall (did we retrieve what we needed?), context precision (is everything we retrieved useful?), faithfulness (is the answer grounded?), and answer relevance (does it address the question?).",
        Diagram: DiagRagEval,
        notes: [
          { h: "Automated evaluation", b: <React.Fragment>RAGAS scores can be computed using an LLM-as-judge — no human labels required. Run it as a CI step on a golden test set of ~50 question/answer pairs to catch retrieval regressions before they reach production.</React.Fragment> },
          { h: "Iteration flywheel", b: <React.Fragment>Low Context Recall → tune chunking strategy or add multi-query expansion. Low Faithfulness → tighten the system prompt guardrail. Low Precision → raise the similarity threshold or add a reranker. Fix one signal at a time.</React.Fragment> },
        ],
      },
    ],
  },
  {
    id: "agent",
    title: "LLM Agents",
    short: "Agents",
    summary: "An LLM becomes an agent when you let it think, pick tools, observe results, and loop until the goal is done.",
    topics: ["planning", "tools", "ReAct", "memory"],
    depth: "advanced",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="3.5" stroke="oklch(0.58 0.18 265)" strokeWidth="1.8" />
        <path d="M12 14v5M8 19h8M9 6.5L6 4M15 6.5L18 4" stroke="oklch(0.58 0.18 265)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    steps: [
      {
        title: "The agent loop",
        lede: "Plain LLMs answer in one shot. An agent wraps the LLM in a loop: reason → act → observe → repeat. Tools extend its reach beyond text into real systems.",
        Diagram: DiagAgentLoop,
        notes: [
          { h: "The cost knob", b: <React.Fragment>Each loop iteration is another model call. Budget a max step count so runaway agents can't burn your wallet.</React.Fragment> },
          { h: "Termination", b: <React.Fragment>Agent stops when it emits a final answer, hits the step limit, or a tool returns an error it can't recover from.</React.Fragment> },
        ],
      },
      {
        title: "ReAct: think before you act",
        lede: "The ReAct pattern structures each loop as a Thought → Action → Observation triple. The thought trace is pure text the model writes for itself; the action is a structured tool call.",
        Diagram: DiagAgentReAct,
        notes: [
          { h: "Why it works", b: <React.Fragment>Chain-of-thought reduces brittle tool choices. The model plans in language first, then commits.</React.Fragment> },
          { h: "Prompt shape", b: <React.Fragment>Few-shot with 2–3 examples of the Thought/Action/Observation format. Modern models also emit native <code>tool_use</code> blocks.</React.Fragment> },
        ],
      },
      {
        title: "Tool design",
        lede: "Tools are just typed functions the model can call. The quality of your tool descriptions matters more than the model's size — a clear name + schema + one-line doc beats a clever prompt.",
        Diagram: DiagAgentTools,
        notes: [
          { h: "Keep them small", b: <React.Fragment>Prefer many focused tools (<code>sql.run</code>, <code>sql.schema</code>) over one monolithic one. Easier to route, easier to debug.</React.Fragment> },
          { h: "Fail loudly", b: <React.Fragment>Return structured errors — the model can recover from "table not found" if you tell it the table actually exists.</React.Fragment> },
        ],
      },
      {
        title: "Memory",
        lede: "The scratchpad is short-term memory. For anything beyond one session, add persistent stores: episodic (what I did) and semantic (what I know — this is where RAG plugs in).",
        Diagram: DiagAgentMemory,
        notes: [
          { h: "Context window is not memory", b: <React.Fragment>It's a cache. Summarize and evict — don't just keep appending or you'll blow the token budget.</React.Fragment> },
          { h: "Write, then retrieve", b: <React.Fragment>Give the agent a <code>memory.write()</code> tool. Retrieval is automatic — the agent pulls relevant notes into the next turn.</React.Fragment> },
        ],
      },
      {
        title: "Planning strategies",
        lede: "ReAct is a baseline. Chain-of-Thought gives the model a scratchpad for explicit reasoning. Tree-of-Thought branches and scores multiple plans before committing. Reflection loops prompt the agent to critique its own output and regenerate.",
        Diagram: DiagAgentPlanning,
        notes: [
          { h: "Chain-of-Thought", b: <React.Fragment>Asking the model to "think step by step" is surprisingly powerful — the thought trace acts as working memory and forces the model to plan before calling tools. Modern models with native <code>thinking</code> tokens do this internally.</React.Fragment> },
          { h: "Reflection", b: <React.Fragment>After generating an answer, prompt the agent: "Critique your response. What might be wrong?" Then regenerate. Two passes often beats one longer context. Use sparingly — it doubles your token cost per turn.</React.Fragment> },
        ],
      },
      {
        title: "Multi-agent systems",
        lede: "For complex tasks, divide work across specialist agents: a research agent fetches context, a coder agent writes and tests code, a critic agent reviews. An orchestrator decomposes the goal, assigns sub-tasks, and aggregates results.",
        Diagram: DiagMultiAgent,
        notes: [
          { h: "Structured message passing", b: <React.Fragment>Agents should communicate through a typed message schema (sender, receiver, type, payload), not free-text. This makes debugging tractable — you can inspect every inter-agent message as a structured log event.</React.Fragment> },
          { h: "Parallelism vs shared state", b: <React.Fragment>Independent sub-tasks can run concurrently, cutting wall-clock time dramatically. But any shared state (a file being edited, a DB being updated) requires explicit coordination. Design sub-tasks to be stateless where possible.</React.Fragment> },
        ],
      },
      {
        title: "Safety & guardrails",
        lede: "Production agents need input filtering to block jailbreaks and PII leakage, output validation to catch policy violations and hallucinations, and hard operational limits so a runaway loop can't cause harm or drain your wallet.",
        Diagram: DiagAgentSafety,
        notes: [
          { h: "Principle of least privilege", b: <React.Fragment>Grant each tool only the permissions it actually needs. A research agent shouldn't have database write access. Audit every tool's schema before deploying. Prefer narrow scoped tokens over broad API keys.</React.Fragment> },
          { h: "Human-in-the-loop", b: <React.Fragment>For high-stakes irreversible actions — sending email, deleting records, executing payments — pause and surface a confirmation request to a human. Implement as a <code>confirm()</code> tool that yields to an operator before proceeding.</React.Fragment> },
        ],
      },
    ],
  },
  {
    id: "ml",
    title: "Machine Learning",
    short: "ML",
    summary: "The fundamentals: how a model learns a function from examples by minimizing loss on labeled data.",
    topics: ["supervised", "loss", "gradient descent", "evaluation"],
    depth: "foundational",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 20L8 14L12 16L20 6" stroke="oklch(0.58 0.18 265)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="14" r="1.5" fill="oklch(0.58 0.18 265)" />
        <circle cx="12" cy="16" r="1.5" fill="oklch(0.58 0.18 265)" />
        <circle cx="20" cy="6" r="1.5" fill="oklch(0.58 0.18 265)" />
      </svg>
    ),
    steps: [
      {
        title: "The ML pipeline",
        lede: "Raw data becomes features, features train a model, the model makes predictions, predictions get compared against truth, and the error signal flows back to update the weights.",
        Diagram: DiagMlPipeline,
        notes: [
          { h: "80% is data work", b: <React.Fragment>Cleaning, labeling, and feature engineering dominate. Swapping models rarely helps as much as fixing the data.</React.Fragment> },
          { h: "Leakage is the silent killer", b: <React.Fragment>If test info sneaks into training features, your metrics lie. Always split <em>before</em> doing anything else.</React.Fragment> },
        ],
      },
      {
        title: "Supervised learning",
        lede: "Given pairs (x, y), fit a function f such that f(x) ≈ y. Linear regression is the simplest example; neural nets are stacks of the same idea with nonlinearities.",
        Diagram: DiagMlSupervised,
        notes: [
          { h: "Regression vs classification", b: <React.Fragment>Regression predicts a number (price, temp). Classification predicts a discrete class (spam / not spam).</React.Fragment> },
          { h: "Inductive bias", b: <React.Fragment>The function family you choose — linear, tree, neural — encodes assumptions about the data. Match it to the shape of your problem.</React.Fragment> },
        ],
      },
      {
        title: "Loss & gradient descent",
        lede: "Training means minimizing a loss function that scores prediction error. Gradient descent nudges weights in the direction that most reduces the loss, one small step at a time.",
        Diagram: DiagMlLoss,
        notes: [
          { h: "Learning rate", b: <React.Fragment>Too small → training crawls. Too large → you bounce out of the minimum. Schedules (warmup + decay) help both problems.</React.Fragment> },
          { h: "Common losses", b: <React.Fragment>MSE for regression, cross-entropy for classification. Loss choice reflects what you want to optimize for.</React.Fragment> },
        ],
      },
      {
        title: "Evaluate honestly",
        lede: "Train/val/test splits exist so you can tell real learning from memorization. Tune on val, report on test — and only touch test once.",
        Diagram: DiagMlEval,
        notes: [
          { h: "Metrics ≠ loss", b: <React.Fragment>Train loss is how the optimizer sees it. Business metrics (F1, AUC, MAE) are how stakeholders do. Track both.</React.Fragment> },
          { h: "Baseline first", b: <React.Fragment>Always beat a dumb baseline (predict the mean, predict the majority class) before celebrating a new model.</React.Fragment> },
        ],
      },
      {
        title: "Neural networks",
        lede: "A neural network stacks layers of neurons. Each neuron computes a weighted sum of its inputs plus a bias, then passes the result through a nonlinear activation function. Stacking many layers lets the network learn hierarchical representations — edges → shapes → objects.",
        Diagram: DiagNeuralNet,
        notes: [
          { h: "Why nonlinearity matters", b: <React.Fragment>Without an activation function, any stack of linear layers collapses to a single linear transformation — it cannot represent complex patterns. ReLU breaks this with a single cheap comparison: <code>max(0, z)</code>.</React.Fragment> },
          { h: "Backpropagation", b: <React.Fragment>Gradients flow backwards through the chain rule — each layer multiplies the upstream gradient by its local derivative. This is how the loss signal from the output reaches weights deep in the network during training.</React.Fragment> },
        ],
      },
      {
        title: "Overfitting & regularisation",
        lede: "Overfitting is when the model memorises training data rather than learning the underlying pattern — train loss falls while validation loss rises. Regularisation adds friction to keep the model from latching onto spurious correlations.",
        Diagram: DiagOverfitting,
        notes: [
          { h: "Dropout", b: <React.Fragment>Randomly zero out a fraction of neurons during each training step. The network is forced to build redundant representations and cannot rely on any single neuron — effectively training an ensemble of sub-networks. Typical rates: 0.1–0.5.</React.Fragment> },
          { h: "L2 / weight decay", b: <React.Fragment>Adds a penalty proportional to the sum of squared weights to the loss. Keeps weights small, which smooths the decision boundary and reduces sensitivity to individual training examples. Most optimisers support it natively via <code>weight_decay</code>.</React.Fragment> },
        ],
      },
      {
        title: "Feature engineering",
        lede: "Raw data is rarely model-ready. Feature engineering transforms it into a clean numeric matrix: imputing nulls, scaling to unit variance, encoding categoricals, and crafting domain-specific combinations. This step often has more leverage than choosing a better model.",
        Diagram: DiagFeatureEng,
        notes: [
          { h: "Scale before you fit", b: <React.Fragment>Gradient-based models (linear models, neural nets) converge much faster on unit-variance features. Tree-based models (XGBoost, random forests) are scale-invariant — skip standardisation for them, it's wasted effort.</React.Fragment> },
          { h: "Feature leakage", b: <React.Fragment>Any feature that encodes information unavailable at prediction time inflates training metrics and fails silently in production. Common traps: using future values in time-series, target-encoded features computed before the train/test split.</React.Fragment> },
        ],
      },
      {
        title: "Hyperparameter tuning",
        lede: "Hyperparameters — learning rate, batch size, network depth, dropout — are not learned by gradient descent; you set them before training. Finding good values is its own optimisation problem, and the search strategy matters as much as the range you search over.",
        Diagram: DiagHyperparams,
        notes: [
          { h: "Learning rate is king", b: <React.Fragment>It's the single most impactful hyperparameter for gradient-based models. Use a learning-rate finder (warm up from 1e-7, plot loss vs lr, pick just before the minimum) to choose a starting point, then apply warmup + cosine decay.</React.Fragment> },
          { h: "Bayesian optimisation", b: <React.Fragment>Fits a surrogate model (Gaussian process or Tree Parzen Estimator) to past trial results and proposes the next trial that maximises expected improvement. Far more sample-efficient than grid or random search when each training run is expensive.</React.Fragment> },
        ],
      },
    ],
  },
];

window.KNOWLEDGE = KNOWLEDGE;

// ---------- Knowledge ----------
const KnowledgeGrid = ({ onOpen }) => (
  <section className="module" id="knowledge">
    <div className="module-head">
      <div>
        <div className="module-eyebrow">02 · Knowledge</div>
        <h2 className="module-title">A deck to refresh my memory</h2>
      </div>
      <div className="module-sub">click a card to step through it</div>
    </div>
    <div className="knowledge-grid">
      {window.KNOWLEDGE.map((k) => (
        <GlassSurface key={k.id} className="k-card" radius={24} onClick={() => onOpen(k.id)}>
          <div className="k-icon">{k.icon}</div>
          <h3>{k.title}</h3>
          <p className="k-desc">{k.summary}</p>
          <div className="k-topics">
            {k.topics.map((t) => <span key={t} className="k-topic">{t}</span>)}
          </div>
          <div className="k-meta">
            <span>{k.steps.length} steps · {k.depth}</span>
            <span className="open-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </GlassSurface>
      ))}
    </div>
  </section>
);

// ---------- Detail overlay ----------
const KnowledgeDetail = ({ topic, onClose }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, topic.steps.length - 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [topic, onClose]);

  const step = topic.steps[idx];
  const Diagram = step.Diagram;

  return (
    <div className="overlay-root" onClick={(e) => e.target.classList.contains("overlay-root") && onClose()}>
      <GlassSurface className="detail" radius={28}>
        <button className="detail-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="detail-header">
          <div className="eyebrow">{topic.short} · knowledge walkthrough</div>
          <h2>{topic.title}</h2>
          <p>{topic.summary}</p>
        </div>
        <div className="detail-body">
          <div className="step-rail">
            {topic.steps.map((s, i) => (
              <button key={i} className={`step-item ${i === idx ? "active" : ""} ${i < idx ? "done" : ""}`} onClick={() => setIdx(i)}>
                <span className="num">{i < idx ? "✓" : i + 1}</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
          <div className="step-stage">
            <div className="step-label">Step {idx + 1} of {topic.steps.length}</div>
            <h3>{step.title}</h3>
            <p className="lede">{step.lede}</p>
            <div className="step-diagram"><Diagram /></div>
            <div className="step-notes">
              {step.notes.map((n, i) => (
                <div key={i} className="note">
                  <h4>{n.h}</h4>
                  <p>{n.b}</p>
                </div>
              ))}
            </div>
            <div className="step-nav">
              <GlassPill onClick={() => setIdx(Math.max(0, idx - 1))}>← prev</GlassPill>
              <span className="counter">{String(idx + 1).padStart(2, "0")} / {String(topic.steps.length).padStart(2, "0")}</span>
              <GlassPill active={idx < topic.steps.length - 1} onClick={() =>
                idx < topic.steps.length - 1 ? setIdx(idx + 1) : onClose()
              }>
                {idx < topic.steps.length - 1 ? "next →" : "done ✓"}
              </GlassPill>
            </div>
          </div>
        </div>
      </GlassSurface>
    </div>
  );
};

Object.assign(window, { KnowledgeGrid, KnowledgeDetail });
