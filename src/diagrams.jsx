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

// ---------- RAG extra diagrams ----------

const DiagVectorDbStorage = () => (
  <SvgStage vb="0 0 640 300">
    <text x={320} y={18} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">each row = dense float32 array + metadata payload</text>
    <rect x={20} y={26} width={600} height={26} rx={6} fill="rgba(12,18,40,0.08)" />
    <text x={50} y={44} fontSize="10" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">id</text>
    <text x={110} y={44} fontSize="10" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">vector [1536 × f32] ≈ 6 KB</text>
    <text x={420} y={44} fontSize="10" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">payload / metadata</text>
    {[
      ["a1b2", "[0.12, −0.08, 0.41 …]", '{ src:"q3.pdf", page:4 }'],
      ["c3d4", "[0.55,  0.22, −0.07 …]", '{ src:"handbook.pdf", page:12 }'],
      ["e5f6", "[−0.03, 0.71, 0.18 …]", '{ src:"faq.md", chunk:7 }'],
    ].map(([id, vec, meta], i) => (
      <g key={i}>
        <rect x={20} y={54 + i * 30} width={600} height={26} rx={0}
          fill={i % 2 === 0 ? "rgba(255,255,255,0.9)" : "rgba(235,240,255,0.7)"}
          stroke="rgba(12,18,40,0.09)" />
        <text x={50} y={71 + i * 30} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#2a3249">{id}</text>
        <text x={110} y={71 + i * 30} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.45 0.18 265)">{vec}</text>
        <text x={420} y={71 + i * 30} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">{meta}</text>
      </g>
    ))}
    <text x={320} y={168} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">HNSW index — hierarchical navigable small world</text>
    {[
      ["Layer 2", "sparse · long-range edges · entry point", 0.04],
      ["Layer 1", "medium density · bridging links", 0.07],
      ["Layer 0", "dense graph · all vectors · beam search here", 0.12],
    ].map(([lyr, desc, alpha], i) => (
      <g key={i}>
        <rect x={20} y={178 + i * 36} width={600} height={30} rx={6}
          fill={`rgba(91,100,120,${alpha})`}
          stroke="rgba(12,18,40,0.12)" strokeDasharray={i < 2 ? "4 3" : undefined} />
        <text x={36} y={198 + i * 36} fontSize="10" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">{lyr}</text>
        <text x={130} y={198 + i * 36} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">{desc}</text>
      </g>
    ))}
  </SvgStage>
);

const DiagHnswSearch = () => (
  <SvgStage vb="0 0 640 300">
    <text x={320} y={16} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">greedy descent: coarse layers guide, layer 0 returns top-k</text>
    <Box x={260} y={26} w={120} h={40} label="query vector" accent />
    <Arrow x1={320} y1={66} x2={320} y2={88} />
    <rect x={20} y={88} width={600} height={52} rx={8} fill="rgba(255,255,255,0.6)" stroke="rgba(12,18,40,0.12)" strokeDasharray="4 3" />
    <text x={38} y={106} fontSize="10" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#858ea3">Layer 2</text>
    <circle cx={190} cy={116} r={5} fill="#858ea3" />
    <circle cx={320} cy={110} r={8} fill="oklch(0.58 0.18 265)" />
    <circle cx={490} cy={118} r={5} fill="#858ea3" />
    <text x={320} y={130} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#2a3249">entry node</text>
    <Arrow x1={320} y1={140} x2={320} y2={158} />
    <rect x={20} y={158} width={600} height={52} rx={8} fill="rgba(255,255,255,0.75)" stroke="rgba(12,18,40,0.13)" strokeDasharray="4 3" />
    <text x={38} y={176} fontSize="10" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#5b6478">Layer 1</text>
    <circle cx={200} cy={185} r={5} fill="#858ea3" />
    <circle cx={280} cy={180} r={5} fill="#858ea3" />
    <circle cx={340} cy={186} r={8} fill="oklch(0.58 0.18 265)" />
    <circle cx={460} cy={183} r={5} fill="#858ea3" />
    <Arrow x1={320} y1={210} x2={320} y2={228} />
    <rect x={20} y={228} width={600} height={58} rx={8} fill="rgba(255,255,255,0.9)" stroke="rgba(12,18,40,0.15)" />
    <text x={38} y={246} fontSize="10" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">Layer 0</text>
    <text x={120} y={246} fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">beam width = ef · returns top-k nearest</text>
    {[260, 295, 320, 350, 390, 440, 490, 540].map((cx, i) => (
      <circle key={i} cx={cx} cy={260} r={i >= 1 && i <= 3 ? 7 : 4}
        fill={i >= 1 && i <= 3 ? "oklch(0.58 0.18 265)" : "#858ea3"} />
    ))}
    <text x={320} y={278} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#2a3249">top-3 neighbours</text>
  </SvgStage>
);

const DiagSimilarityMetrics = () => {
  const ox = 100, oy = 240;
  const ax = 200, ay = 80;
  const bx = 440, by = 190;
  return (
    <SvgStage vb="0 0 640 300">
      <defs>
        <marker id="sim-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#0b1020" />
        </marker>
      </defs>
      <line x1={ox} y1={20} x2={ox} y2={oy} stroke="rgba(12,18,40,0.08)" strokeWidth="1" />
      <line x1={ox} y1={oy} x2={580} y2={oy} stroke="rgba(12,18,40,0.08)" strokeWidth="1" />
      <circle cx={ox} cy={oy} r={4} fill="#0b1020" />
      <text x={ox - 12} y={oy + 14} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">O</text>
      <line x1={ox} y1={oy} x2={ax} y2={ay} stroke="#0b1020" strokeWidth="2" markerEnd="url(#sim-arr)" />
      <text x={ax + 6} y={ay - 4} fontSize="13" fontWeight={600} fontFamily="Inter, system-ui" fill="#0b1020">A</text>
      <line x1={ox} y1={oy} x2={bx} y2={by} stroke="#0b1020" strokeWidth="2" markerEnd="url(#sim-arr)" />
      <text x={bx + 6} y={by + 4} fontSize="13" fontWeight={600} fontFamily="Inter, system-ui" fill="#0b1020">B</text>
      <path d="M 129 193 A 55 55 0 0 1 154 232" fill="none" stroke="oklch(0.58 0.18 265)" strokeWidth="2.5" />
      <text x={155} y={202} fontSize="12" fontWeight={700} fontFamily="JetBrains Mono, monospace" fill="oklch(0.45 0.18 265)">θ</text>
      <rect x={116} y={130} width={210} height={22} rx="5" fill="oklch(0.94 0.05 265)" stroke="oklch(0.75 0.12 265)" strokeWidth="1" />
      <text x={221} y={145} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.38 0.18 265)">cos θ = A·B / (|A| |B|)</text>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="oklch(0.62 0.18 30)" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x={(ax + bx) / 2 + 10} y={(ay + by) / 2 - 12} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.48 0.18 30)">‖A − B‖</text>
      <line x1={ax} y1={ay} x2={221} y2={222} stroke="#858ea3" strokeWidth="1.5" strokeDasharray="3 3" />
      <polyline points="215,213 224,210 227,219" fill="none" stroke="#858ea3" strokeWidth="1.2" />
      <text x={232} y={242} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">A·B (proj)</text>
      <line x1={480} y1={38} x2={510} y2={38} stroke="oklch(0.58 0.18 265)" strokeWidth="2.5" />
      <text x={516} y={42} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">cosine</text>
      <line x1={480} y1={58} x2={510} y2={58} stroke="oklch(0.62 0.18 30)" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x={516} y={62} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">Euclidean (L2)</text>
      <line x1={480} y1={78} x2={510} y2={78} stroke="#858ea3" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={516} y={82} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">dot product</text>
    </SvgStage>
  );
};

const DiagIvfflatVsHnsw = () => (
  <SvgStage vb="0 0 640 300">
    <rect x={12} y={12} width={290} height={276} rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(12,18,40,0.14)" />
    <text x={157} y={32} textAnchor="middle" fontSize="12" fontWeight={600} fontFamily="Inter, system-ui" fill="#0b1020">IVFFlat</text>
    <line x1={157} y1={44} x2={157} y2={268} stroke="rgba(12,18,40,0.15)" strokeWidth="1" strokeDasharray="4 3" />
    <line x1={20} y1={156} x2={294} y2={156} stroke="rgba(12,18,40,0.15)" strokeWidth="1" strokeDasharray="4 3" />
    <rect x={14} y={44} width={141} height={110} rx="8" fill="oklch(0.92 0.05 265)" opacity="0.6" />
    <rect x={158} y={44} width={141} height={110} rx="8" fill="oklch(0.92 0.05 265)" opacity="0.6" />
    <circle cx={55}  cy={75}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={88}  cy={90}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={70}  cy={118} r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={115} cy={80}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={130} cy={130} r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={185} cy={68}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={220} cy={95}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={200} cy={128} r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={255} cy={72}  r={5} fill="oklch(0.58 0.18 265)" />
    <circle cx={60}  cy={185} r={5} fill="#c8cdd9" />
    <circle cx={100} cy={210} r={5} fill="#c8cdd9" />
    <circle cx={130} cy={190} r={5} fill="#c8cdd9" />
    <circle cx={190} cy={200} r={5} fill="#c8cdd9" />
    <circle cx={240} cy={220} r={5} fill="#c8cdd9" />
    <circle cx={270} cy={185} r={5} fill="#c8cdd9" />
    <circle cx={148} cy={110} r={7} fill="none" stroke="#e05a5a" strokeWidth="2" strokeDasharray="3 2" />
    <circle cx={148} cy={110} r={3} fill="#e05a5a" />
    <circle cx={148} cy={110} r={58} fill="none" stroke="#e05a5a" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
    <text x={148} y={125} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#e05a5a">query</text>
    <text x={157} y={256} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">nlist = 4 clusters</text>
    <text x={157} y={271} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">nprobe = 2 cells searched</text>
    <rect x={338} y={12} width={290} height={276} rx="10" fill="rgba(255,255,255,0.7)" stroke="rgba(12,18,40,0.14)" />
    <text x={483} y={32} textAnchor="middle" fontSize="12" fontWeight={600} fontFamily="Inter, system-ui" fill="#0b1020">HNSW</text>
    <rect x={348} y={44} width={270} height={80} rx="8" fill="rgba(255,255,255,0.5)" stroke="rgba(12,18,40,0.12)" strokeDasharray="4 3" />
    <text x={358} y={62} fontSize="9" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#858ea3">Layer 1</text>
    <circle cx={400} cy={88} r={6} fill="#c8cdd9" />
    <circle cx={460} cy={78} r={8} fill="oklch(0.58 0.18 265)" />
    <circle cx={540} cy={92} r={6} fill="#c8cdd9" />
    <circle cx={590} cy={76} r={6} fill="#c8cdd9" />
    <line x1={400} y1={88} x2={460} y2={78} stroke="rgba(12,18,40,0.2)" strokeWidth="1" />
    <line x1={460} y1={78} x2={540} y2={92} stroke="rgba(12,18,40,0.2)" strokeWidth="1" />
    <line x1={540} y1={92} x2={590} y2={76} stroke="rgba(12,18,40,0.2)" strokeWidth="1" />
    <text x={460} y={100} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#2a3249">entry</text>
    <Arrow x1={460} y1={124} x2={460} y2={144} />
    <rect x={348} y={148} width={270} height={100} rx="8" fill="rgba(255,255,255,0.8)" stroke="rgba(12,18,40,0.15)" />
    <text x={358} y={166} fontSize="9" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">Layer 0</text>
    {[375,405,430,458,482,510,540,565].map((cx, i) => (
      <circle key={i} cx={cx} cy={210} r={i >= 2 && i <= 4 ? 7 : 4}
        fill={i >= 2 && i <= 4 ? "oklch(0.58 0.18 265)" : "#c8cdd9"} />
    ))}
    {[375,405,430,458,482,510,540].map((cx, i) => (
      <line key={i} x1={cx} y1={210} x2={[375,405,430,458,482,510,540,565][i+1]} y2={210}
        stroke="rgba(12,18,40,0.18)" strokeWidth="1" />
    ))}
    <text x={483} y={234} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#2a3249">top-3 neighbours</text>
    <text x={483} y={256} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">M = edges per node</text>
    <text x={483} y={271} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5b6478">ef_search = beam width</text>
  </SvgStage>
);

const DiagAdvancedRag = () => (
  <SvgStage vb="0 0 640 300">
    <Box x={20} y={125} w={100} h={50} label="User query" />
    <Arrow x1={120} y1={150} x2={175} y2={80} />
    <Arrow x1={120} y1={150} x2={175} y2={150} />
    <Arrow x1={120} y1={150} x2={175} y2={220} />
    <Box x={175} y={55} w={130} h={50} label="Query variant 1" sub="rephrase A" />
    <Box x={175} y={125} w={130} h={50} label="HyDE doc" sub="LLM-generated answer" accent />
    <Box x={175} y={195} w={130} h={50} label="Query variant 2" sub="rephrase B" />
    <Arrow x1={305} y1={80} x2={375} y2={150} />
    <Arrow x1={305} y1={150} x2={375} y2={150} />
    <Arrow x1={305} y1={220} x2={375} y2={150} />
    <Box x={375} y={125} w={100} h={50} label="Merge" sub="deduplicate hits" />
    <Arrow x1={475} y1={150} x2={525} y2={150} />
    <Box x={525} y={125} w={90} h={50} label="Rerank" sub="cross-encoder" accent />
  </SvgStage>
);

const DiagRagEval = () => (
  <SvgStage vb="0 0 640 280">
    <text x={320} y={18} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">RAGAS — four axes for measuring RAG quality</text>
    {[
      ["Context Recall", "were the right chunks retrieved?", "0.87"],
      ["Context Precision", "are all retrieved chunks relevant?", "0.73"],
      ["Faithfulness", "does the answer follow from context?", "0.91"],
      ["Answer Relevance", "does the answer address the question?", "0.82"],
    ].map(([metric, desc, score], i) => (
      <g key={i}>
        <rect x={20} y={30 + i * 56} width={580} height={46} rx={8}
          fill={i % 2 === 0 ? "rgba(255,255,255,0.9)" : "rgba(240,244,255,0.7)"}
          stroke="rgba(12,18,40,0.11)" />
        <text x={36} y={52 + i * 56} fontSize="12" fontWeight={600} fontFamily="Inter, system-ui" fill="#0b1020">{metric}</text>
        <text x={36} y={68 + i * 56} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">{desc}</text>
        <rect x={500} y={38 + i * 56} width={80} height={28} rx={6} fill="oklch(0.58 0.18 265)" />
        <text x={540} y={56 + i * 56} textAnchor="middle" fontSize="14" fontWeight={700} fontFamily="Inter, system-ui" fill="white">{score}</text>
      </g>
    ))}
  </SvgStage>
);

// ---------- Agent extra diagrams ----------

const DiagAgentPlanning = () => (
  <SvgStage vb="0 0 640 300">
    <text x={320} y={16} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">Tree-of-Thought: branch → score → keep best path</text>
    <Box x={260} y={24} w={120} h={40} label="Problem" sub="user task" accent />
    <Arrow x1={260} y1={44} x2={130} y2={100} />
    <Arrow x1={320} y1={64} x2={320} y2={100} />
    <Arrow x1={380} y1={44} x2={510} y2={100} />
    <Box x={65} y={100} w={110} h={40} label="Plan A" />
    <Box x={265} y={100} w={110} h={40} label="Plan B" />
    <Box x={460} y={100} w={110} h={40} label="Plan C" />
    <Arrow x1={120} y1={140} x2={90} y2={180} />
    <Arrow x1={120} y1={140} x2={165} y2={180} />
    <Arrow x1={320} y1={140} x2={320} y2={180} />
    <Arrow x1={515} y1={140} x2={515} y2={180} />
    <Box x={50} y={180} w={80} h={36} label="dead end" sub="score 2" />
    <Box x={145} y={180} w={80} h={36} label="ok" sub="score 6" />
    <Box x={265} y={180} w={110} h={36} label="best path" sub="score 9" accent />
    <Box x={455} y={180} w={110} h={36} label="ok" sub="score 5" />
    <text x={320} y={270} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">prune low-scoring branches · expand best · repeat</text>
  </SvgStage>
);

const DiagMultiAgent = () => (
  <SvgStage vb="0 0 640 300">
    <Box x={240} y={14} w={160} h={50} label="Orchestrator" sub="decompose task" accent />
    <Arrow x1={270} y1={64} x2={115} y2={130} label="sub-task A" />
    <Arrow x1={320} y1={64} x2={320} y2={130} label="sub-task B" />
    <Arrow x1={370} y1={64} x2={525} y2={130} label="sub-task C" />
    <Box x={50} y={130} w={130} h={50} label="Research" sub="web + RAG" />
    <Box x={255} y={130} w={130} h={50} label="Coder" sub="write + test" />
    <Box x={460} y={130} w={130} h={50} label="Critic" sub="review + lint" />
    <Arrow x1={115} y1={180} x2={270} y2={238} />
    <Arrow x1={320} y1={180} x2={320} y2={238} />
    <Arrow x1={525} y1={180} x2={370} y2={238} />
    <Box x={230} y={238} w={180} h={50} label="Aggregator" sub="merge results" />
  </SvgStage>
);

const DiagAgentSafety = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={20} y={115} w={100} h={50} label="User input" />
    <Arrow x1={120} y1={140} x2={170} y2={140} />
    <Box x={170} y={115} w={120} h={50} label="Input guard" sub="PII · jailbreak · scope" />
    <Arrow x1={290} y1={140} x2={330} y2={140} />
    <Box x={330} y={115} w={100} h={50} label="Agent" accent />
    <Arrow x1={430} y1={140} x2={470} y2={140} />
    <Box x={470} y={115} w={130} h={50} label="Output guard" sub="policy · grounding check" />
    <Arrow x1={230} y1={115} x2={230} y2={70} color="#e05a5a" />
    <rect x={175} y={50} width={110} height={26} rx={6} fill="rgba(224,90,90,0.1)" stroke="rgba(224,90,90,0.3)" />
    <text x={230} y={67} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#e05a5a">deny / sanitise</text>
    <Arrow x1={535} y1={115} x2={535} y2={70} color="#e05a5a" />
    <rect x={485} y={50} width={100} height={26} rx={6} fill="rgba(224,90,90,0.1)" stroke="rgba(224,90,90,0.3)" />
    <text x={535} y={67} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#e05a5a">block / redact</text>
    <text x={380} y={208} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">also enforce: max_steps · cost budget · timeout</text>
  </SvgStage>
);

// ---------- ML extra diagrams ----------

const DiagNeuralNet = () => {
  const inputY = [80, 140, 200];
  const h1Y = [60, 110, 165, 215];
  const h2Y = [60, 110, 165, 215];
  const outY = [115, 175];
  const xs = [70, 230, 400, 570];
  return (
    <SvgStage vb="0 0 640 300">
      {["Input", "Hidden 1", "Hidden 2", "Output"].map((lbl, i) => (
        <text key={i} x={xs[i]} y={22} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">{lbl}</text>
      ))}
      {inputY.flatMap((iy, ii) => h1Y.map((hy, hi) => (
        <line key={`i${ii}h${hi}`} x1={xs[0] + 16} y1={iy} x2={xs[1] - 16} y2={hy} stroke="rgba(91,100,120,0.18)" strokeWidth={1} />
      )))}
      {h1Y.flatMap((iy, ii) => h2Y.map((hy, hi) => (
        <line key={`h1${ii}h2${hi}`} x1={xs[1] + 16} y1={iy} x2={xs[2] - 16} y2={hy} stroke="rgba(91,100,120,0.18)" strokeWidth={1} />
      )))}
      {h2Y.flatMap((iy, ii) => outY.map((oy, oi) => (
        <line key={`h2${ii}o${oi}`} x1={xs[2] + 16} y1={iy} x2={xs[3] - 16} y2={oy} stroke="rgba(91,100,120,0.22)" strokeWidth={1} />
      )))}
      {inputY.map((y, i) => <circle key={i} cx={xs[0]} cy={y} r={16} fill="white" stroke="rgba(12,18,40,0.2)" strokeWidth={1.5} />)}
      {h1Y.map((y, i) => (
        <g key={i}>
          <circle cx={xs[1]} cy={y} r={16} fill="white" stroke="rgba(12,18,40,0.2)" strokeWidth={1.5} />
          <text x={xs[1]} y={y + 4} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#2a3249">σ</text>
        </g>
      ))}
      {h2Y.map((y, i) => (
        <g key={i}>
          <circle cx={xs[2]} cy={y} r={16} fill="white" stroke="rgba(12,18,40,0.2)" strokeWidth={1.5} />
          <text x={xs[2]} y={y + 4} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#2a3249">σ</text>
        </g>
      ))}
      {outY.map((y, i) => <circle key={i} cx={xs[3]} cy={y} r={16} fill="oklch(0.58 0.18 265)" />)}
      <text x={320} y={262} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">each neuron: z = Wx + b · activation = ReLU(z) or softmax(z)</text>
    </SvgStage>
  );
};

const DiagOverfitting = () => (
  <SvgStage vb="0 0 640 280">
    <line x1={50} y1={240} x2={610} y2={240} stroke="#2a3249" strokeWidth={1} />
    <line x1={50} y1={20} x2={50} y2={240} stroke="#2a3249" strokeWidth={1} />
    <text x={330} y={268} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">epochs →</text>
    <text x={24} y={135} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478" transform="rotate(-90 24 135)">loss</text>
    <path d="M 60 200 C 150 160, 300 100, 600 40" fill="none" stroke="oklch(0.58 0.18 265)" strokeWidth={2} />
    <path d="M 60 210 C 150 165, 280 120, 350 115 C 420 116, 520 140, 600 185" fill="none" stroke="oklch(0.65 0.18 30)" strokeWidth={2} strokeDasharray="6 3" />
    <line x1={350} y1={115} x2={350} y2={240} stroke="rgba(12,18,40,0.35)" strokeWidth={1} strokeDasharray="3 3" />
    <text x={350} y={255} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#0b1020">early stop here</text>
    <text x={510} y={58} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="oklch(0.55 0.18 30)">overfit zone</text>
    <line x1={60} y1={32} x2={92} y2={32} stroke="oklch(0.58 0.18 265)" strokeWidth={2} />
    <text x={98} y={36} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">train loss</text>
    <line x1={185} y1={32} x2={217} y2={32} stroke="oklch(0.65 0.18 30)" strokeWidth={2} strokeDasharray="6 3" />
    <text x={223} y={36} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#0b1020">val loss</text>
  </SvgStage>
);

const DiagFeatureEng = () => (
  <SvgStage vb="0 0 640 280">
    <Box x={20} y={110} w={110} h={60} label="Raw data" sub="mixed, messy" />
    <Arrow x1={130} y1={140} x2={170} y2={140} />
    <Box x={170} y={46} w={130} h={40} label="Impute" sub="fill missing values" />
    <Box x={170} y={96} w={130} h={40} label="Scale" sub="standardise / min-max" />
    <Box x={170} y={146} w={130} h={40} label="Encode" sub="one-hot / ordinal" />
    <Box x={170} y={196} w={130} h={40} label="Engineer" sub="log(x) · x² · ratios" />
    <Arrow x1={300} y1={66} x2={390} y2={128} />
    <Arrow x1={300} y1={116} x2={390} y2={135} />
    <Arrow x1={300} y1={166} x2={390} y2={145} />
    <Arrow x1={300} y1={216} x2={390} y2={155} />
    <Box x={390} y={110} w={130} h={60} label="Feature matrix" sub="X ∈ ℝⁿˣᵈ · clean" accent />
    <Arrow x1={520} y1={140} x2={565} y2={140} />
    <Box x={565} y={110} w={55} h={60} label="fit()" />
  </SvgStage>
);

const DiagHyperparams = () => (
  <SvgStage vb="0 0 640 280">
    <text x={320} y={18} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#5b6478">what you tune vs how to search the space</text>
    <rect x={20} y={28} width={290} height={230} rx={10} fill="rgba(255,255,255,0.8)" stroke="rgba(12,18,40,0.14)" />
    <text x={165} y={50} textAnchor="middle" fontSize="11" fontWeight={600} fontFamily="Inter, system-ui" fill="#0b1020">Hyperparameters (you set)</text>
    {["learning rate", "batch size", "depth / width", "dropout rate", "optimizer type", "weight decay"].map((t, i) => (
      <g key={i}>
        <circle cx={44} cy={66 + i * 30} r={4} fill="oklch(0.58 0.18 265)" />
        <text x={56} y={70 + i * 30} fontSize="11" fontFamily="JetBrains Mono, monospace" fill="#2a3249">{t}</text>
      </g>
    ))}
    <rect x={330} y={28} width={290} height={230} rx={10} fill="rgba(255,255,255,0.8)" stroke="rgba(12,18,40,0.14)" />
    <text x={475} y={50} textAnchor="middle" fontSize="11" fontWeight={600} fontFamily="Inter, system-ui" fill="#0b1020">Search strategies</text>
    {[
      ["Grid search", "exhaustive · small discrete spaces"],
      ["Random search", "surprisingly good · large spaces"],
      ["Bayesian opt.", "builds surrogate · most efficient"],
      ["Population-based", "evolutionary · parallel trials"],
    ].map(([name, desc], i) => (
      <g key={i}>
        <text x={350} y={70 + i * 46} fontSize="11" fontWeight={600} fontFamily="JetBrains Mono, monospace" fill="#0b1020">{name}</text>
        <text x={350} y={86 + i * 46} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5b6478">{desc}</text>
      </g>
    ))}
  </SvgStage>
);

Object.assign(window, { Box, Arrow, SvgStage, DiagRagOverview, DiagRagChunking, DiagRagRetrieval, DiagRagGenerate, DiagAgentLoop, DiagAgentReAct, DiagAgentTools, DiagAgentMemory, DiagMlPipeline, DiagMlSupervised, DiagMlLoss, DiagMlEval, DiagVectorDbStorage, DiagHnswSearch, DiagSimilarityMetrics, DiagIvfflatVsHnsw, DiagAdvancedRag, DiagRagEval, DiagAgentPlanning, DiagMultiAgent, DiagAgentSafety, DiagNeuralNet, DiagOverfitting, DiagFeatureEng, DiagHyperparams });
