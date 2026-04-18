// Interactive step-by-step walkthroughs for the three knowledge topics.
// Each topic has: id, title, summary, topics[], icon, steps[] (each step has
// a title, lede, a diagram component, and 2 notes).

// ---------- Shared diagram primitives ----------
const Box = ({ x, y, w, h, label, sub, fill = "rgba(255,255,255,0.9)", stroke = "rgba(12,18,40,0.18)", dashed = false, accent = false }) => (
  <g>
    <rect
      x={x} y={y} width={w} height={h} rx="10"
      fill={accent ? "oklch(0.58 0.18 265)" : fill}
      stroke={stroke}
      strokeWidth="1"
      strokeDasharray={dashed ? "4 4" : undefined}
    />
    <text x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 4)} textAnchor="middle"
      fontSize="12" fontWeight="600" fontFamily="Inter, system-ui"
      fill={accent ? "white" : "#0b1020"}>
      {label}
    </text>
    {sub && (
      <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle"
        fontSize="10" fontFamily="JetBrains Mono, monospace"
        fill={accent ? "rgba(255,255,255,0.8)" : "#5b6478"}>
        {sub}
      </text>
    )}
  </g>
);

const Arrow = ({ x1, y1, x2, y2, label, dashed = false, color = "#5b6478" }) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id={`arr-${color.replace(/[^a-z0-9]/gi, "")}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth="1.5"
        strokeDasharray={dashed ? "4 3" : undefined}
        markerEnd={`url(#arr-${color.replace(/[^a-z0-9]/gi, "")})`} />
      {label && (
        <g>
          <rect x={mx - 28} y={my - 9} width="56" height="16" rx="4" fill="white" stroke="rgba(12,18,40,0.08)" />
          <text x={mx} y={my + 3} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#2a3249">{label}</text>
        </g>
      )}
    </g>
  );
};

const SvgStage = ({ children, vb = "0 0 640 300" }) => (
  <svg viewBox={vb} width="100%" style={{ display: "block", height: "auto" }}>
    {children}
  </svg>
);

// ---------- RAG diagrams ----------
const DiagRagOverview = () => (
  <SvgStage>
    <Box x={20} y={120} w={120} h={60} label="User query" sub='"Show revenue by region"' />
    <Arrow x1={140} y1={150} x2={220} y2={150} />
    <Box x={220} y={120} w={120} h={60} label="Embedder" sub="text → vector" />
    <Arrow x1={340} y1={150} x2={420} y2={80} />
    <Arrow x1={340} y1={150} x2={420} y2={220} dashed />
    <Box x={420} y={50} w={180} h={60} label="Vector DB" sub="top-k similarity search" />
    <Box x={420} y={200} w={180} h={60} label="LLM" sub="generate answer" accent />
    <Arrow x1={510} y1={110} x2={510} y2={200} label="context" />
  </SvgStage>
);

const DiagRagChunking = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={20} y={110} w={120} h={60} label="Document" sub="handbook.pdf" />
    <Arrow x1={140} y1={140} x2={220} y2={140} label="split" />
    <g>
      <rect x={220} y={40} width={150} height={40} rx={8} fill="white" stroke="rgba(12,18,40,0.18)" />
      <rect x={220} y={90} width={150} height={40} rx={8} fill="white" stroke="rgba(12,18,40,0.18)" />
      <rect x={220} y={140} width={150} height={40} rx={8} fill="white" stroke="rgba(12,18,40,0.18)" />
      <rect x={220} y={190} width={150} height={40} rx={8} fill="white" stroke="rgba(12,18,40,0.18)" />
      <text x={295} y={64} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#2a3249">chunk 1 · 512 tok</text>
      <text x={295} y={114} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#2a3249">chunk 2 · 512 tok</text>
      <text x={295} y={164} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#2a3249">chunk 3 · 512 tok</text>
      <text x={295} y={214} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#2a3249">chunk 4 · 512 tok</text>
    </g>
    <Arrow x1={370} y1={60} x2={470} y2={110} />
    <Arrow x1={370} y1={110} x2={470} y2={130} />
    <Arrow x1={370} y1={160} x2={470} y2={150} />
    <Arrow x1={370} y1={210} x2={470} y2={170} />
    <Box x={470} y={100} w={150} h={80} label="Embeddings" sub="[0.12, −0.08, ...]" accent />
  </SvgStage>
);

const DiagRagRetrieval = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={20} y={20} w={130} h={44} label="query vector" sub="[0.41, 0.09, ...]" accent />
    <Box x={180} y={20} w={440} h={220} label="" stroke="rgba(12,18,40,0.14)" fill="rgba(255,255,255,0.6)" />
    <text x={400} y={42} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">vector space · cosine similarity</text>
    {/* points */}
    <circle cx={250} cy={130} r={6} fill="oklch(0.58 0.18 265)" />
    <circle cx={290} cy={110} r={6} fill="oklch(0.58 0.18 265)" />
    <circle cx={310} cy={150} r={6} fill="oklch(0.58 0.18 265)" />
    <circle cx={420} cy={180} r={5} fill="#858ea3" />
    <circle cx={480} cy={90} r={5} fill="#858ea3" />
    <circle cx={540} cy={180} r={5} fill="#858ea3" />
    <circle cx={580} cy={120} r={5} fill="#858ea3" />
    <circle cx={380} cy={210} r={5} fill="#858ea3" />
    {/* query star */}
    <circle cx={290} cy={140} r={10} fill="none" stroke="oklch(0.58 0.18 265)" strokeWidth="2" strokeDasharray="3 3" />
    <circle cx={290} cy={140} r={4} fill="oklch(0.58 0.18 265)" />
    <text x={290} y={170} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">query</text>
    <text x={220} y={100} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">top-3 neighbors</text>
  </SvgStage>
);

const DiagRagGenerate = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={20} y={30} w={180} h={50} label="Retrieved chunks" sub="3 × ~512 tokens" />
    <Box x={20} y={100} w={180} h={50} label="User query" sub="natural language" />
    <Box x={20} y={170} w={180} h={50} label="System prompt" sub="role + guardrails" />
    <Arrow x1={200} y1={55} x2={290} y2={130} />
    <Arrow x1={200} y1={125} x2={290} y2={140} />
    <Arrow x1={200} y1={195} x2={290} y2={150} />
    <Box x={290} y={110} w={140} h={60} label="Prompt" sub="assembled context" />
    <Arrow x1={430} y1={140} x2={490} y2={140} />
    <Box x={490} y={110} w={130} h={60} label="LLM" sub="grounded answer" accent />
  </SvgStage>
);

// ---------- LLM Agent diagrams ----------
const DiagAgentLoop = () => (
  <SvgStage vb="0 0 640 300">
    <Box x={260} y={20} w={120} h={50} label="Goal" sub="user task" />
    <Arrow x1={320} y1={70} x2={320} y2={100} />
    <Box x={240} y={100} w={160} h={60} label="LLM (planner)" sub="reason + choose tool" accent />
    <Arrow x1={320} y1={160} x2={320} y2={185} label="action" />
    <Box x={220} y={185} w={200} h={50} label="Tool call" sub="search / code / API" />
    <Arrow x1={420} y1={210} x2={540} y2={210} />
    <Box x={520} y={185} w={100} h={50} label="Env" sub="execute" />
    <Arrow x1={570} y1={185} x2={570} y2={130} />
    <Arrow x1={570} y1={130} x2={400} y2={130} label="observation" />
    <text x={130} y={130} fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">loop until done</text>
    <path d="M 160 140 Q 200 160 240 160" fill="none" stroke="#5b6478" strokeDasharray="3 3" />
  </SvgStage>
);

const DiagAgentReAct = () => (
  <SvgStage vb="0 0 640 300">
    <g>
      <rect x={30} y={20} width={580} height={50} rx={10} fill="rgba(255,255,255,0.9)" stroke="rgba(12,18,40,0.14)" />
      <text x={46} y={42} fontSize="11" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">Thought</text>
      <text x={46} y={58} fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#2a3249">"I need last quarter's revenue — I should query the SQL tool."</text>
    </g>
    <Arrow x1={320} y1={70} x2={320} y2={95} />
    <g>
      <rect x={30} y={95} width={580} height={50} rx={10} fill="oklch(0.58 0.18 265)" />
      <text x={46} y={117} fontSize="11" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="white">Action</text>
      <text x={46} y={133} fontSize="11" fontFamily="JetBrains Mono, monospace" fill="rgba(255,255,255,0.85)">sql.run("SELECT SUM(rev) FROM orders WHERE q='Q4'")</text>
    </g>
    <Arrow x1={320} y1={145} x2={320} y2={170} />
    <g>
      <rect x={30} y={170} width={580} height={50} rx={10} fill="rgba(255,255,255,0.9)" stroke="rgba(12,18,40,0.14)" />
      <text x={46} y={192} fontSize="11" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">Observation</text>
      <text x={46} y={208} fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#2a3249">"$ 2,480,112"</text>
    </g>
    <Arrow x1={320} y1={220} x2={320} y2={245} />
    <g>
      <rect x={30} y={245} width={580} height={40} rx={10} fill="rgba(255,255,255,0.7)" stroke="rgba(12,18,40,0.14)" strokeDasharray="3 3" />
      <text x={320} y={270} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">loop → next Thought, or Answer if sufficient</text>
    </g>
  </SvgStage>
);

const DiagAgentTools = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={240} y={110} w={160} h={60} label="Agent" sub="selects tool by name" accent />
    {/* tool cards */}
    <Box x={30} y={20} w={150} h={50} label="search()" sub="web retrieval" />
    <Box x={30} y={115} w={150} h={50} label="sql()" sub="query database" />
    <Box x={30} y={210} w={150} h={50} label="calculator()" sub="arithmetic" />
    <Box x={460} y={20} w={150} h={50} label="code_runner()" sub="python sandbox" />
    <Box x={460} y={115} w={150} h={50} label="http_get()" sub="call API" />
    <Box x={460} y={210} w={150} h={50} label="memory.write()" sub="persist note" />
    <Arrow x1={180} y1={45} x2={240} y2={130} dashed />
    <Arrow x1={180} y1={140} x2={240} y2={140} dashed />
    <Arrow x1={180} y1={235} x2={240} y2={150} dashed />
    <Arrow x1={400} y1={130} x2={460} y2={45} dashed />
    <Arrow x1={400} y1={140} x2={460} y2={140} dashed />
    <Arrow x1={400} y1={150} x2={460} y2={235} dashed />
  </SvgStage>
);

const DiagAgentMemory = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={240} y={110} w={160} h={60} label="Agent" accent />
    <Box x={30} y={30} w={170} h={60} label="Short-term" sub="current scratchpad" />
    <Box x={30} y={110} w={170} h={60} label="Episodic" sub="past interactions" />
    <Box x={30} y={190} w={170} h={60} label="Semantic" sub="facts & docs (RAG)" />
    <Arrow x1={200} y1={60} x2={240} y2={130} />
    <Arrow x1={200} y1={140} x2={240} y2={140} />
    <Arrow x1={200} y1={220} x2={240} y2={150} />
    <Box x={440} y={110} w={170} h={60} label="Tool layer" sub="acts on world" />
    <Arrow x1={400} y1={140} x2={440} y2={140} />
  </SvgStage>
);

// ---------- Machine Learning diagrams ----------
const DiagMlPipeline = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={10} y={110} w={110} h={60} label="Raw data" sub="rows, images..." />
    <Arrow x1={120} y1={140} x2={160} y2={140} />
    <Box x={160} y={110} w={110} h={60} label="Features" sub="clean + encode" />
    <Arrow x1={270} y1={140} x2={310} y2={140} />
    <Box x={310} y={110} w={110} h={60} label="Model" sub="fit(X, y)" accent />
    <Arrow x1={420} y1={140} x2={460} y2={140} />
    <Box x={460} y={110} w={110} h={60} label="Predictions" sub="evaluate" />
    <Arrow x1={515} y1={110} x2={515} y2={60} />
    <Arrow x1={515} y1={60} x2={365} y2={60} label="loss" />
    <Arrow x1={365} y1={60} x2={365} y2={110} dashed />
  </SvgStage>
);

const DiagMlSupervised = () => (
  <SvgStage vb="0 0 640 280">
    {/* axes */}
    <line x1={50} y1={240} x2={610} y2={240} stroke="#2a3249" strokeWidth={1} />
    <line x1={50} y1={20} x2={50} y2={240} stroke="#2a3249" strokeWidth={1} />
    <text x={325} y={270} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">feature x</text>
    <text x={30} y={130} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478" transform="rotate(-90 30 130)">label y</text>
    {/* points */}
    {[[90, 220],[140, 200],[190, 180],[240, 170],[290, 150],[340, 140],[390, 120],[440, 100],[490, 80],[540, 60]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y + (i % 3 === 0 ? -8 : i % 3 === 1 ? 6 : 0)} r={5} fill="oklch(0.58 0.18 265)" />
    ))}
    {/* regression line */}
    <line x1={70} y1={230} x2={580} y2={50} stroke="oklch(0.72 0.14 300)" strokeWidth={2} />
    <text x={570} y={40} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.55 0.18 300)">ŷ = wx + b</text>
  </SvgStage>
);

const DiagMlLoss = () => (
  <SvgStage vb="0 0 640 280">
    {/* bowl curve */}
    <path d="M 40 40 Q 320 400 600 40" fill="none" stroke="rgba(12,18,40,0.2)" strokeWidth={1.5} />
    {/* gradient steps */}
    {[[80, 95],[160, 170],[240, 215],[310, 235],[380, 225],[450, 190],[520, 130]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={5} fill={i === 3 ? "oklch(0.58 0.18 265)" : "#858ea3"} />
    ))}
    <line x1={80} y1={95} x2={310} y2={235} stroke="oklch(0.58 0.18 265)" strokeWidth={1} strokeDasharray="3 3" />
    <text x={80} y={82} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">start</text>
    <text x={310} y={260} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.55 0.18 265)">minimum · ∇L = 0</text>
    <text x={320} y={30} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">loss surface L(w)</text>
  </SvgStage>
);

const DiagMlEval = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={40} y={100} w={540} h={80} label="" fill="rgba(255,255,255,0.6)" stroke="rgba(12,18,40,0.14)" />
    <rect x={40} y={100} width={340} height={80} rx={10} fill="oklch(0.92 0.04 265)" />
    <rect x={380} y={100} width={100} height={80} rx={0} fill="oklch(0.88 0.06 300)" />
    <rect x={480} y={100} width={100} height={80} rx={0} fill="oklch(0.85 0.09 40)" />
    <text x={210} y={145} textAnchor="middle" fontSize="13" fontWeight={600} fontFamily="Inter" fill="#0b1020">Train</text>
    <text x={210} y={162} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">~60%</text>
    <text x={430} y={145} textAnchor="middle" fontSize="12" fontWeight={600} fontFamily="Inter" fill="#0b1020">Val</text>
    <text x={430} y={162} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">~20%</text>
    <text x={530} y={145} textAnchor="middle" fontSize="12" fontWeight={600} fontFamily="Inter" fill="#0b1020">Test</text>
    <text x={530} y={162} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">~20%</text>
    <text x={310} y={80} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">how we split the data</text>
    <text x={310} y={220} textAnchor="middle" fontSize="11" fontFamily="Inter" fill="#0b1020">
      train fits weights · val tunes hyperparams · test is touched once
    </text>
  </SvgStage>
);

// ---------- Content ----------
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
    ],
  },
];

window.KNOWLEDGE = KNOWLEDGE;
