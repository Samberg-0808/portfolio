const { useState, useEffect, useMemo, useRef } = React;
const { GlassSurface, GlassPill, Background, KnowledgeGrid, KnowledgeDetail } = window;

// ---------- Hero / Info ----------
const Hero = ({ name, role, bio, location, handle }) => (
  <GlassSurface className="hero" radius={36}>
    <div className="hero-left">
      <div className="status">
        <span className="pulse" /> available for collaboration
      </div>
      <h1>
        {name}, <span className="accent">building tools that think.</span>
      </h1>
      <p>{bio}</p>
      <div className="hero-meta">
        <span>◉ {role}</span>
        <span>◴ {location}</span>
        <span className="kbd">{handle}</span>
      </div>
      <div className="hero-actions">
        <GlassPill active>→ view projects</GlassPill>
        <GlassPill>✿ knowledge deck</GlassPill>
        <GlassPill>↗ email me</GlassPill>
      </div>
    </div>
    <div className="hero-right">
      <div className="avatar-frame">
        <img src="assets/selfie.PNG" alt="Shibo Zhang" className="avatar-photo" />
      </div>
      <div className="avatar-tag">design · code · data</div>
    </div>
  </GlassSurface>
);

// ---------- Projects ----------
const ProjectVisual = () => (
  <div className="project-visual">
    <div className="mock-chat">
      <div className="mock-row user">Revenue by region, last quarter?</div>
      <div className="mock-row ai">Here's Q1 revenue across 6 regions, using the finance.orders table.</div>
      <div className="mock-chart">
        <div className="cap">Revenue · Q1 2026</div>
        <div className="bars">
          <span style={{ height: "40%" }} />
          <span style={{ height: "72%" }} />
          <span style={{ height: "55%" }} />
          <span style={{ height: "90%" }} />
          <span style={{ height: "62%" }} />
          <span style={{ height: "48%" }} />
        </div>
      </div>
      <div className="mock-row user">Break APAC down by country.</div>
    </div>
  </div>
);

const Projects = () => (
  <section className="module" id="projects">
    <div className="module-head">
      <div>
        <div className="module-eyebrow">01 · Projects</div>
        <h2 className="module-title">What I'm building</h2>
      </div>
      <div className="module-sub">selected work · 2025–present</div>
    </div>
    <div className="projects-grid">
      <GlassSurface className="project-card" radius={28}>
        <div className="project-body">
          <span className="project-pill">● Active · Flagship</span>
          <h3>DAItaView</h3>
          <p className="project-desc">
            AI-powered data reporting platform. Ask natural-language questions about your data and get
            interactive charts and tables back — backed by admin-curated knowledge that teaches the
            system your company's data context.
          </p>
          <ul className="project-feats">
            <li>Natural-language → SQL with a guided knowledge layer admins can edit.</li>
            <li>Interactive charts, filters, and drilldowns rendered inline in the answer.</li>
            <li>Grounded explanations + source links so every number can be audited.</li>
          </ul>
          <div className="project-tags">
            <span className="tag">React</span>
            <span className="tag">Python</span>
            <span className="tag">LLM</span>
            <span className="tag">pgvector</span>
            <span className="tag">DuckDB</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <a
              href="https://github.com/Samberg-0808/DAItaView"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <GlassPill active>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.41c.58.1.79-.25.79-.56v-2c-3.2.69-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.17 1.18a10.98 10.98 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
                </svg>
                View on GitHub ↗
              </GlassPill>
            </a>
            <a
              href="https://daitaview.example.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <GlassPill>Live demo →</GlassPill>
            </a>
          </div>
        </div>
        <ProjectVisual />
      </GlassSurface>
    </div>
  </section>
);

// ---------- Tweaks panel ----------
const TweaksPanel = ({ visible, tweaks, setTweaks }) => {
  if (!visible) return null;
  return (
    <GlassSurface className="tweaks" radius={20}>
      <h4>Tweaks</h4>
      <div className="tweak-row">
        <label>Glass</label>
        <div className="tweak-chips">
          {["subtle", "medium", "heavy"].map((v) => (
            <button key={v} className={`tweak-chip ${tweaks.glass === v ? "active" : ""}`}
              onClick={() => setTweaks({ ...tweaks, glass: v })}>{v}</button>
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <label>Accent</label>
        <div className="tweak-chips">
          {[
            { id: "indigo", h: 265 },
            { id: "violet", h: 300 },
            { id: "ocean", h: 230 },
            { id: "mint", h: 165 },
          ].map((c) => (
            <div key={c.id}
              className={`tweak-swatch ${tweaks.accent === c.id ? "active" : ""}`}
              title={c.id}
              style={{ background: `oklch(0.58 0.18 ${c.h})` }}
              onClick={() => setTweaks({ ...tweaks, accent: c.id })}
            />
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <label>Background</label>
        <div className="tweak-chips">
          {["warm", "cool", "iridescent"].map((v) => (
            <button key={v} className={`tweak-chip ${tweaks.bg === v ? "active" : ""}`}
              onClick={() => setTweaks({ ...tweaks, bg: v })}>{v}</button>
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <label>Density</label>
        <div className="tweak-chips">
          {["comfy", "tight"].map((v) => (
            <button key={v} className={`tweak-chip ${tweaks.density === v ? "active" : ""}`}
              onClick={() => setTweaks({ ...tweaks, density: v })}>{v}</button>
          ))}
        </div>
      </div>
    </GlassSurface>
  );
};

// ---------- App ----------
const App = () => {
  const [openId, setOpenId] = useState(null);
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [tweaks, setTweaks] = useState(window.__TWEAKS__ || {
    glass: "medium", accent: "indigo", bg: "warm", density: "comfy",
  });

  // Apply tweaks
  useEffect(() => {
    const hueMap = { indigo: 265, violet: 300, ocean: 230, mint: 165 };
    const root = document.documentElement;
    const h = hueMap[tweaks.accent] || 265;
    root.style.setProperty("--accent", `oklch(0.58 0.18 ${h})`);
    root.style.setProperty("--accent-2", `oklch(0.65 0.15 ${h - 20})`);
    root.style.setProperty("--accent-3", `oklch(0.72 0.14 ${h + 35})`);
    document.body.dataset.bg = tweaks.bg;
    document.body.dataset.density = tweaks.density;
    // persist
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: tweaks }, "*");
  }, [tweaks]);

  // Edit-mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksVisible(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksVisible(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const openTopic = window.KNOWLEDGE.find((k) => k.id === openId);

  return (
    <React.Fragment>
      <Background />
      <div className="page">
        <GlassSurface className="nav" radius={999}>
          <div className="nav-brand">
            <span className="dot" />
            <span>portfolio · v2026</span>
          </div>
          <div className="nav-links">
            <a className="nav-link active" href="#about">about</a>
            <a className="nav-link" href="#projects">projects</a>
            <a className="nav-link" href="#knowledge">knowledge</a>
            <a className="nav-link" href="#contact">contact</a>
          </div>
        </GlassSurface>

        <div id="about">
          <Hero
            name="Shibo Zhang"
            role="Full Stack Engineer - AI/data"
            bio="I design and build human-in-the-loop AI products — interfaces that make language models useful to people who don't speak SQL. Mostly React on the front and Python on the back; always with a pen nearby."
            location="Bay Area CA · PST"
            handle="@Shibo Zhang"
          />
        </div>

        <section className="module" id="contact" style={{ marginTop: -8, marginBottom: 56 }}>
          <GlassSurface radius={24} style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ font: "500 11px/1 var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-2)" }}>Get in touch</span>
                <span style={{ width: 1, height: 16, background: "rgba(12,18,40,0.12)" }} />
                <span style={{ font: "400 14px var(--font-sans)", color: "var(--ink-2)" }}>Open to collaborations</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href="mailto:shibozhang0808@gmail.com" style={{ textDecoration: "none" }}>
                  <GlassPill>✉ shibozhang0808@gmail.com</GlassPill>
                </a>
                <a href="https://github.com/Samberg-0808" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <GlassPill>↗ github</GlassPill>
                </a>
                <a href="https://www.linkedin.com/in/shibo-zhang-a99373203/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <GlassPill>↗ linkedin</GlassPill>
                </a>
              </div>
            </div>
          </GlassSurface>
        </section>

        <Projects />
        <KnowledgeGrid onOpen={setOpenId} />

        <footer style={{ textAlign: "center", font: "500 12px var(--font-mono)", color: "var(--muted-2)", marginTop: 40, letterSpacing: "0.06em" }}>
          hand-crafted · glass v26 · {new Date().getFullYear()}
        </footer>
      </div>

      {openTopic && <KnowledgeDetail topic={openTopic} onClose={() => setOpenId(null)} />}

      <TweaksPanel visible={tweaksVisible} tweaks={tweaks} setTweaks={setTweaks} />
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
