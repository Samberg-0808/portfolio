// Liquid glass primitives — layered backdrop-filter + specular highlight + chromatic edge.
// Kept as simple components so every module shares the same treatment.

const GlassSurface = ({ children, className = "", style = {}, radius = 28, intensity = "medium", onClick, as: Tag = "div", ...rest }) => {
  const blur = intensity === "heavy" ? 32 : intensity === "subtle" ? 10 : 20;
  const sat = intensity === "heavy" ? 1.9 : intensity === "subtle" ? 1.25 : 1.6;
  return (
    <Tag
      onClick={onClick}
      className={`glass-surface ${className}`}
      style={{
        borderRadius: radius,
        backdropFilter: `blur(${blur}px) saturate(${sat})`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${sat})`,
        ...style,
      }}
      {...rest}
    >
      {/* Inner specular highlight + edge refraction */}
      <span className="glass-edge" aria-hidden="true" style={{ borderRadius: radius }} />
      <span className="glass-spec" aria-hidden="true" style={{ borderRadius: radius }} />
      <span className="glass-tint" aria-hidden="true" style={{ borderRadius: radius }} />
      <span className="glass-content">{children}</span>
    </Tag>
  );
};

const GlassPill = ({ children, className = "", style = {}, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`glass-pill ${active ? "is-active" : ""} ${className}`}
    style={style}
  >
    <span className="glass-edge" aria-hidden="true" style={{ borderRadius: 999 }} />
    <span className="glass-spec" aria-hidden="true" style={{ borderRadius: 999 }} />
    <span className="glass-tint" aria-hidden="true" style={{ borderRadius: 999 }} />
    <span className="glass-content">{children}</span>
  </button>
);

// Animated background: slow-drifting colorful orbs that glass refracts.
const Background = () => (
  <div className="bg-root" aria-hidden="true">
    <div className="bg-grid" />
    <div className="orb orb-a" />
    <div className="orb orb-b" />
    <div className="orb orb-c" />
    <div className="orb orb-d" />
    <div className="orb orb-e" />
    <div className="orb-f" />
    <div className="bg-noise" />
  </div>
);

Object.assign(window, { GlassSurface, GlassPill, Background });
