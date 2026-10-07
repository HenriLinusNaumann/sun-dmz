import { Step, Steps, useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';

// ─────────────────────────────────────────────────────────────────────────────
// Design-Tokens (im Design-Panel live tweakbar)
// ─────────────────────────────────────────────────────────────────────────────

export const design: DesignSystem = {
  palette: { bg: '#0b0d12', text: '#eef1f7', accent: '#ffb224' },
  fonts: {
    display: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 150, body: 34 },
  radius: 14,
};

// Farben ausserhalb des Design-Systems (bewusst fest)
const MUTED = '#8b93a7';
const LINE = '#28304a';
const PANEL = '#12162080';
const RED = '#f87171';
const AMBER = '#ffb224';
const ORANGE = '#fb923c';
const BLUE = '#60a5fa';
const GREEN = '#34d399';
const CYAN = '#22d3ee';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const fill = {
  width: '100%',
  height: '100%',
  fontFamily: 'var(--osd-font-body)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Globale Keyframes (pro Seite eingebettet, Klassen mit sd- Prefix)
// ─────────────────────────────────────────────────────────────────────────────

const GlobalFx = () => (
  <style>{`
    @keyframes sd-dash { to { stroke-dashoffset: -56; } }
    .sd-flow { stroke-dasharray: 9 19; animation: sd-dash 1.1s linear infinite; }
    @keyframes sd-orbit { to { transform: rotate(360deg); } }
    .sd-orbit { animation: sd-orbit 16s linear infinite; }
    .sd-orbit-r { animation: sd-orbit 26s linear infinite reverse; }
    @keyframes sd-sun {
      0%,100% { box-shadow: 0 0 70px 18px rgba(255,178,36,.30), 0 0 170px 60px rgba(255,178,36,.12); }
      50%      { box-shadow: 0 0 110px 36px rgba(255,178,36,.48), 0 0 230px 90px rgba(255,178,36,.20); }
    }
    .sd-sun { animation: sd-sun 5.5s ease-in-out infinite; }
    @keyframes sd-radar {
      0%   { transform: scale(.55); opacity: .75; }
      100% { transform: scale(1.45); opacity: 0; }
    }
    .sd-radar { animation: sd-radar 3.4s cubic-bezier(0,0,.2,1) infinite; }
    .sd-radar-2 { animation: sd-radar 3.4s cubic-bezier(0,0,.2,1) 1.7s infinite; }
    @keyframes sd-blink { 0%,55% { opacity: 1; } 56%,100% { opacity: 0; } }
    .sd-blink { animation: sd-blink 1.1s steps(1) infinite; }
    @keyframes sd-glow { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
    .sd-glow { animation: sd-glow 2.2s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .sd-flow, .sd-orbit, .sd-orbit-r, .sd-sun, .sd-radar, .sd-radar-2, .sd-blink, .sd-glow { animation: none; }
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// Bausteine
// ─────────────────────────────────────────────────────────────────────────────

const Foot = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 52,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: MONO,
        fontSize: 20,
        color: MUTED,
        letterSpacing: '0.08em',
      }}
    >
      <span>sun-dmz · CONTAINERLAB SECURITY LAB</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Eyebrow = ({ children, c = AMBER }: { children: React.ReactNode; c?: string }) => (
  <div style={{ fontFamily: MONO, fontSize: 24, color: c, letterSpacing: '0.3em', fontWeight: 600 }}>
    {children}
  </div>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 64,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      margin: 0,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h2>
);

const Chip = ({ children, c = MUTED }: { children: React.ReactNode; c?: string }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: MONO,
      fontSize: 22,
      color: c,
      border: `1.5px solid ${c}55`,
      background: `${c}12`,
      borderRadius: 10,
      padding: '8px 18px',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

// Minimal-Icons (24×24 Raster, Stroke-basiert)
type IconT =
  | 'globe' | 'laptop' | 'wall' | 'switch' | 'server' | 'eye' | 'router'
  | 'monitor' | 'lock' | 'shield' | 'term' | 'mesh' | 'mountain' | 'wave' | 'funnel';

const Ico = ({ t, x = 0, y = 0, s = 1, c = 'currentColor' }: { t: IconT; x?: number; y?: number; s?: number; c?: string }) => {
  const g: Record<IconT, React.ReactNode> = {
    globe: (<><circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="4.5" ry="10" /><path d="M2 12h20" /></>),
    laptop: (<><path d="M4.5 5.5h15v10h-15z" /><path d="M2.5 18.5h19" /></>),
    wall: (<><rect x="3" y="4" width="18" height="16" /><path d="M3 9.3h18M3 14.6h18M9 4v5.3M15 4v5.3M6 9.3v5.3M12 9.3v5.3M18 9.3v5.3M9 14.6V20M15 14.6V20" /></>),
    switch: (<><rect x="3" y="9" width="18" height="6" rx="1" /><path d="M6.5 5 4.5 7l2 2.2M17.5 5l2 2-2 2.2" /></>),
    server: (<><rect x="4" y="4" width="16" height="7" rx="1" /><rect x="4" y="13" width="16" height="7" rx="1" /><circle cx="7.5" cy="7.5" r="1" /><circle cx="7.5" cy="16.5" r="1" /></>),
    eye: (<><path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="2.8" /></>),
    router: (<><circle cx="12" cy="12" r="3" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4M10.7 4.3 12 3l1.3 1.3M10.7 19.7 12 21l1.3-1.3M4.3 10.7 3 12l1.3 1.3M19.7 10.7 21 12l-1.3 1.3" /></>),
    monitor: (<><rect x="3" y="4.5" width="18" height="12" rx="1.5" /><path d="M9 20.5h6M12 16.5v4" /></>),
    lock: (<><rect x="5.5" y="10.5" width="13" height="9" rx="1.5" /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" /></>),
    shield: (<path d="M12 2.5 20 6v6c0 4.8-3.4 8.2-8 9.5C7.4 20.2 4 16.8 4 12V6z" />),
    term: (<><rect x="2.5" y="4" width="19" height="16" rx="2" /><path d="M6.5 9l3.5 3-3.5 3M12.5 15.5H18" /></>),
    mesh: (<><path d="M12 2.5 20.2 7.2v9.6L12 21.5 3.8 16.8V7.2z" /><circle cx="12" cy="12" r="2.6" /></>),
    mountain: <path d="M2.5 19.5 9 7.5l4 6.5 3-4.5 5.5 10z" />,
    wave: <path d="M2 12c2.5 0 2.5-6 5-6s2.5 12 5 12 2.5-12 5-12 2.5 6 5 6" />,
    funnel: <path d="M3.5 4.5h17L14 12v7.5l-4-2V12z" />,
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {g[t]}
    </g>
  );
};

// SVG-Knoten für Topologie-Grafiken — als explizite Instanzen genutzt
const NodeBox = ({
  x, y, w, h, t, sub, icon, c,
}: { x: number; y: number; w: number; h: number; t: string; sub: string; icon: IconT; c: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={12} fill={`${c}14`} stroke={`${c}88`} strokeWidth={2} />
    <g transform={`translate(${x + w / 2 - 17},${y + 12})`}>
      <Ico t={icon} s={1.4} c={c} />
    </g>
    <text x={x + w / 2} y={y + 70} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={700} fill="#eef1f7">
      {t}
    </text>
    <text x={x + w / 2} y={y + 94} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={MUTED}>
      {sub}
    </text>
  </g>
);

// ─────────────────────────────────────────────────────────────────────────────
// 01 — Cover
// ─────────────────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', position: 'relative', overflow: 'hidden' }}>
    <GlobalFx />

    {/* Sonne mit Radar-Ringen — rechts */}
    <div style={{ position: 'absolute', right: 200, top: 540 - 380 + 0, width: 0, height: 0 }}>
      <div style={{ position: 'absolute', left: -190, top: -190, width: 380, height: 380 }}>
        <div className="sd-radar" style={{ position: 'absolute', inset: 0, border: `2px solid ${AMBER}55`, borderRadius: '50%' }} />
        <div className="sd-radar-2" style={{ position: 'absolute', inset: 0, border: `2px solid ${AMBER}33`, borderRadius: '50%' }} />
      </div>
      <div className="sd-orbit" style={{ position: 'absolute', left: -300, top: -300, width: 600, height: 600, borderRadius: '50%', border: `1.5px dashed ${AMBER}30` }}>
        <div style={{ position: 'absolute', left: '50%', top: -7, width: 14, height: 14, marginLeft: -7, borderRadius: '50%', background: AMBER }} />
      </div>
      <div className="sd-orbit-r" style={{ position: 'absolute', left: -370, top: -370, width: 740, height: 740, borderRadius: '50%', border: `1.5px dashed ${LINE}` }}>
        <div style={{ position: 'absolute', left: '50%', top: -6, width: 12, height: 12, marginLeft: -6, borderRadius: '50%', background: BLUE }} />
      </div>
      <div className="sd-sun" style={{ position: 'absolute', left: -110, top: -110, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle at 38% 34%, #ffd57a, ${AMBER} 58%, #d98a10)` }} />
    </div>

    <div style={{ position: 'absolute', left: 120, top: 200, maxWidth: 1050 }}>
      <Eyebrow>CONTAINERLAB · SECURITY-LAB</Eyebrow>
      <h1
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.02,
          margin: '36px 0 40px',
        }}
      >
        <span style={{ color: AMBER }}>sun</span>-dmz
      </h1>
      <p style={{ fontSize: 42, lineHeight: 1.5, color: MUTED, maxWidth: 900, margin: 0 }}>
        Ein komplettes Firmennetz mit DMZ, VPN, IDS und SOC —<br />
        vollständig virtualisiert in Containern auf einem Laptop.
      </p>
      <div style={{ display: 'flex', gap: 20, marginTop: 64 }}>
        <Chip c={AMBER}>containerlab 0.62.1</Chip>
        <Chip c={BLUE}>Alpine + nginx</Chip>
        <Chip c={GREEN}>11 Nodes · 8 Netze</Chip>
      </div>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 02 — Idee & Zahlen
// ─────────────────────────────────────────────────────────────────────────────

const StatCard = ({ n, l, s, c }: { n: string; l: string; s: string; c: string }) => (
  <div
    style={{
      flex: 1,
      border: `1.5px solid ${c}44`,
      background: `${c}0d`,
      borderRadius: 'var(--osd-radius)',
      padding: '36px 40px 30px',
    }}
  >
    <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 104, fontWeight: 900, color: c, lineHeight: 1, letterSpacing: '-0.03em' }}>{n}</div>
    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 18, color: 'var(--osd-text)' }}>{l}</div>
    <div style={{ fontFamily: MONO, fontSize: 21, color: MUTED, marginTop: 10 }}>{s}</div>
  </div>
);

const Idee: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow>DIE IDEE</Eyebrow>
    <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 64, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '26px 0 0', maxWidth: 1500 }}>
      Wie baut man ein sicheres Unternehmensnetz,<br />
      <span style={{ color: AMBER }}>ohne teure Hardware?</span>
    </h2>

    <div style={{ display: 'flex', gap: 28, marginTop: 72 }}>
      <Steps>
        <Step duration={260}>
          <StatCard n="11" l="Container-Nodes" s="10 Alpine/nginx + 1 Bridge" c={AMBER} />
        </Step>
        <Step duration={260}>
          <StatCard n="8" l="Netzwerke" s="inkl. VPN-Tunnel 10.8.0.0/24" c={BLUE} />
        </Step>
        <Step duration={260}>
          <StatCard n="2" l="Firewall-Ebenen" s="edge_fw + backend_fw" c={RED} />
        </Step>
        <Step duration={260}>
          <StatCard n="1" l="Laptop genügt" s="keine Lizenzen, keine VMs" c={GREEN} />
        </Step>
      </Steps>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 03 — Werkzeuge
// ─────────────────────────────────────────────────────────────────────────────

const ToolCard = ({ t, d, icon, c }: { t: string; d: string; icon: IconT; c: string }) => (
  <div
    style={{
      border: `1.5px solid ${LINE}`,
      background: PANEL,
      borderRadius: 'var(--osd-radius)',
      padding: '30px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}
  >
    <svg width={44} height={44} viewBox="0 0 24 24"><Ico t={icon} s={1.8} c={c} /></svg>
    <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: 'var(--osd-text)' }}>{t}</div>
    <div style={{ fontSize: 24, lineHeight: 1.45, color: MUTED }}>{d}</div>
  </div>
);

const Stack: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow>DER WERKZEUGKASTEN</Eyebrow>
    <div style={{ height: 26 }} />
    <H2>Nur Open Source. Nur Linux.</H2>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 26, marginTop: 64 }}>
      <ToolCard t="containerlab" d="Beschreibt die ganze Topologie als YAML." icon="mesh" c={AMBER} />
      <ToolCard t="Alpine Linux" d="Basis aller Router & Firewalls — schlank & schnell." icon="mountain" c={BLUE} />
      <ToolCard t="iptables" d="Paketfilter auf beiden Firewall-Ebenen." icon="wall" c={RED} />
      <ToolCard t="WireGuard" d="Moderner VPN-Tunnel für das Remote-Office." icon="lock" c={CYAN} />
      <ToolCard t="nginx" d="Reverse Proxy in der DMZ mit WAF-Regeln." icon="shield" c={ORANGE} />
      <ToolCard t="tcpdump" d="IDS-Sensor erkennt Port-Scans." icon="wave" c={GREEN} />
      <ToolCard t="socat" d="Log-Pipeline UDP 514 → Dashboard." icon="funnel" c={AMBER} />
      <ToolCard t="BusyBox httpd" d="Serviert das SOC-Dashboard im Browser." icon="monitor" c={BLUE} />
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 04 — Defense in Depth (Zwiebel-Modell)
// ─────────────────────────────────────────────────────────────────────────────

const LayerRow = ({ c, t, d }: { c: string; t: string; d: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: c, boxShadow: `0 0 18px ${c}` }} />
    <div>
      <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: c, letterSpacing: '0.06em' }}>{t}</span>
      <span style={{ fontSize: 28, color: MUTED, marginLeft: 22 }}>{d}</span>
    </div>
  </div>
);

const Layers: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <div style={{ display: 'flex', gap: 60, height: '100%' }}>
      <div style={{ width: 760 }}>
        <Eyebrow>ARCHITEKTUR-PRINZIP</Eyebrow>
        <div style={{ height: 26 }} />
        <H2>Defense in Depth</H2>
        <p style={{ fontSize: 32, lineHeight: 1.5, color: MUTED, margin: '30px 0 0' }}>
          Keine einzelne Mauer schützt — <span style={{ color: 'var(--osd-text)' }}>fünf Schichten</span> tun es gemeinsam.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, marginTop: 52 }}>
          <Steps>
            <Step duration={240}><LayerRow c={RED} t="INTERNET" d="Untrusted — hier lauern Angreifer" /></Step>
            <Step duration={240}><LayerRow c={AMBER} t="EDGE-FIREWALL" d="Default-DROP + VPN-Einwahl" /></Step>
            <Step duration={240}><LayerRow c={ORANGE} t="DMZ" d="Gepufferte Zone — nur der Proxy sichtbar" /></Step>
            <Step duration={240}><LayerRow c={BLUE} t="INTERNES NETZ" d="Mitarbeiter, geschützt hinter zwei Türen" /></Step>
            <Step duration={240}><LayerRow c={GREEN} t="BACKEND" d="SIEM & Logs — hier kommt niemand rein" /></Step>
          </Steps>
        </div>
      </div>

      <svg width={800} height={800} viewBox="0 0 780 780" style={{ flex: 1 }}>
        <circle cx={390} cy={400} r={350} fill="none" stroke={RED} strokeWidth={2.5} opacity={0.55} />
        <circle cx={390} cy={400} r={285} fill="none" stroke={AMBER} strokeWidth={2.5} opacity={0.55} />
        <circle cx={390} cy={400} r={220} fill="none" stroke={ORANGE} strokeWidth={2.5} opacity={0.55} />
        <circle cx={390} cy={400} r={155} fill="none" stroke={BLUE} strokeWidth={2.5} opacity={0.55} />
        <circle cx={390} cy={400} r={92} fill={`${GREEN}18`} stroke={GREEN} strokeWidth={2.5} />

        <text x={390} y={78} textAnchor="middle" fontFamily={MONO} fontSize={21} fill={RED} letterSpacing="3">INTERNET</text>
        <text x={390} y={143} textAnchor="middle" fontFamily={MONO} fontSize={21} fill={AMBER} letterSpacing="3">EDGE-FW</text>
        <text x={390} y={208} textAnchor="middle" fontFamily={MONO} fontSize={21} fill={ORANGE} letterSpacing="3">DMZ</text>
        <text x={390} y={273} textAnchor="middle" fontFamily={MONO} fontSize={21} fill={BLUE} letterSpacing="3">INTERN</text>
        <g transform="translate(378,368)"><Ico t="lock" s={1} c={GREEN} /></g>
        <text x={390} y={422} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={GREEN} letterSpacing="3">BACKEND</text>
        <text x={390} y={450} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={MUTED}>SIEM</text>

        {/* Angriff von aussen: prallt an der ersten Schicht ab */}
        <g className="sd-glow">
          <path d="M24,661 L103,616" stroke={RED} strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d="M111,611 L87,612 L98,631 Z" fill={RED} />
        </g>
        <text x={20} y={700} fontFamily={MONO} fontSize={19} fill={RED}>Angriff</text>
      </svg>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 05 — Topologie (Herzstück)
// ─────────────────────────────────────────────────────────────────────────────

const Topologie: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '88px 100px 100px', position: 'relative' }}>
    <GlobalFx />
    <Eyebrow>DIE TOPOLOGIE</Eyebrow>
    <div style={{ height: 20 }} />

    <svg width={1720} height={700} viewBox="0 0 1720 700" style={{ display: 'block' }}>
      {/* Zonen */}
      <rect x={0} y={0} width={270} height={700} rx={18} fill={`${RED}0a`} stroke={`${RED}30`} strokeDasharray="3 7" />
      <rect x={540} y={0} width={450} height={700} rx={18} fill={`${AMBER}0a`} stroke={`${AMBER}30`} strokeDasharray="3 7" />
      <rect x={1300} y={0} width={250} height={310} rx={18} fill={`${BLUE}0a`} stroke={`${BLUE}30`} strokeDasharray="3 7" />
      <rect x={1300} y={380} width={420} height={320} rx={18} fill={`${GREEN}0a`} stroke={`${GREEN}30`} strokeDasharray="3 7" />

      <text x={22} y={46} fontFamily={MONO} fontSize={22} fontWeight={700} fill={RED} letterSpacing="3">INTERNET</text>
      <text x={22} y={72} fontFamily={MONO} fontSize={17} fill={MUTED}>untrusted</text>
      <text x={562} y={46} fontFamily={MONO} fontSize={22} fontWeight={700} fill={AMBER} letterSpacing="3">DMZ</text>
      <text x={562} y={72} fontFamily={MONO} fontSize={17} fill={MUTED}>gepufferte Zone</text>
      <text x={1322} y={46} fontFamily={MONO} fontSize={22} fontWeight={700} fill={BLUE} letterSpacing="3">INTERN</text>
      <text x={1322} y={72} fontFamily={MONO} fontSize={17} fill={MUTED}>Mitarbeiter</text>
      <text x={1322} y={414} fontFamily={MONO} fontSize={22} fontWeight={700} fill={GREEN} letterSpacing="3">BACKEND</text>
      <text x={1322} y={440} fontFamily={MONO} fontSize={17} fill={MUTED}>SIEM &amp; Logs</text>

      {/* Links */}
      <g stroke={LINE} strokeWidth={3} fill="none">
        <path d="M240,196 H285 V350 H330" />
        <path d="M240,476 H285 V400 H330" />
        <path d="M510,350 H555 V340 H590" />
        <path d="M690,312 V208" />
        <path d="M690,368 V436" />
        <path d="M760,368 V620 H810" />
        <path d="M510,395 H1030 V355 H1070" />
        <path d="M1155,300 V196 H1330" />
        <path d="M1155,410 V507 H1330" />
        <path d="M1425,562 V584" />
      </g>

      {/* WireGuard-Tunnel */}
      <path className="sd-flow" d="M240,452 C330,452 390,390 390,280" stroke={CYAN} strokeWidth={3.5} fill="none" opacity={0.9} />
      <text x={330} y={96} fontFamily={MONO} fontSize={19} fill={CYAN}>WireGuard · 51820</text>
      <text x={330} y={122} fontFamily={MONO} fontSize={17} fill={MUTED}>10.8.0.0/24</text>

      {/* Syslog-Pfad Richtung SIEM (eigene Route, unterhalb des DMZ-Traffics) */}
      <path className="sd-flow" d="M810,152 H840 V636 H1330" stroke={AMBER} strokeWidth={2.5} fill="none" opacity={0.75} />
      <text x={860} y={618} fontFamily={MONO} fontSize={19} fill={AMBER}>syslog → SIEM · UDP 514</text>

      {/* Nodes */}
      <NodeBox x={20} y={140} w={220} h={112} t="internet_client" sub="10.0.0.10 · Angreifer" icon="globe" c={RED} />
      <NodeBox x={20} y={420} w={220} h={112} t="remote_client" sub="10.0.100.10 · VPN" icon="laptop" c={CYAN} />

      {/* edge_fw — die Mauer */}
      <g>
        <rect x={330} y={280} width={180} height={150} rx={12} fill={`${AMBER}16`} stroke={AMBER} strokeWidth={2.5} />
        <g transform="translate(397,304)"><Ico t="wall" s={1.9} c={AMBER} /></g>
        <text x={420} y={382} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill="#eef1f7">edge_fw</text>
        <text x={420} y={408} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={MUTED}>Firewall + VPN</text>
      </g>
      {/* Blockiert-Punkt */}
      <g className="sd-glow" stroke={RED} strokeWidth={5} strokeLinecap="round">
        <path d="M314,342 l16,16 M330,342 l-16,16" />
      </g>

      <NodeBox x={570} y={96} w={240} h={112} t="rev_proxy" sub="10.0.10.20 · WAF" icon="shield" c={ORANGE} />

      {/* dmz_switch */}
      <g>
        <rect x={590} y={312} width={220} height={56} rx={12} fill={`${MUTED}14`} stroke={`${MUTED}66`} strokeWidth={2} />
        <circle cx={630} cy={312} r={5} fill={AMBER} />
        <circle cx={690} cy={312} r={5} fill={ORANGE} />
        <circle cx={750} cy={312} r={5} fill={GREEN} />
        <text x={700} y={338} textAnchor="middle" fontFamily={MONO} fontSize={21} fontWeight={700} fill="#eef1f7">dmz_switch</text>
        <text x={700} y={358} textAnchor="middle" fontFamily={MONO} fontSize={15} fill={MUTED}>Verteiler · Hub-Modus</text>
      </g>

      <NodeBox x={570} y={436} w={240} h={112} t="dmz_host" sub="10.0.10.10 · Webserver" icon="server" c={ORANGE} />
      <NodeBox x={570} y={578} w={240} h={112} t="ids" sub="10.0.10.30 · horcht" icon="eye" c={GREEN} />
      <NodeBox x={1070} y={300} w={170} h={110} t="int_router" sub="10.0.20.1" icon="router" c={BLUE} />
      <NodeBox x={1330} y={140} w={200} h={112} t="int_client" sub="10.0.30.10 · User" icon="laptop" c={BLUE} />
      <NodeBox x={1330} y={452} w={190} h={110} t="backend_fw" sub="10.0.40.254" icon="wall" c={GREEN} />
      <NodeBox x={1330} y={584} w={190} h={104} t="backend_siem" sub="10.0.50.10 · SOC" icon="monitor" c={GREEN} />

      {/* Erlaubter Traffic: Internet → Proxy */}
      <circle r={7} fill={GREEN}>
        <animateMotion dur="4.5s" repeatCount="indefinite" path="M240,196 H285 V350 H690 V208" />
      </circle>
      <circle r={13} fill={GREEN} opacity={0.22}>
        <animateMotion dur="4.5s" repeatCount="indefinite" path="M240,196 H285 V350 H690 V208" />
      </circle>

      {/* Blockierter Traffic: prallt an edge_fw ab */}
      <circle r={7} fill={RED}>
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M240,196 H285 V350 H322" />
        <animate attributeName="opacity" values="1;1;1;0" keyTimes="0;0.72;0.88;1" dur="2.6s" repeatCount="indefinite" />
      </circle>

      {/* Syslog-Paket */}
      <circle r={7} fill={AMBER}>
        <animateMotion dur="8s" repeatCount="indefinite" path="M810,152 H840 V636 H1330" />
      </circle>

      {/* VPN-Paket */}
      <circle r={7} fill={CYAN}>
        <animateMotion dur="3.4s" repeatCount="indefinite" path="M240,452 C330,452 390,390 390,280" />
      </circle>

      {/* Interner Traffic */}
      <circle r={6} fill={BLUE}>
        <animateMotion dur="3s" repeatCount="indefinite" path="M1155,300 V196 H1330" />
      </circle>
    </svg>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 06 — Adressplan
// ─────────────────────────────────────────────────────────────────────────────

const NetRow = ({ net, zone, desc, c }: { net: string; zone: string; desc: string; c: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '13px 0', borderBottom: `1px solid ${LINE}` }}>
    <div style={{ width: 8, height: 40, borderRadius: 4, background: c }} />
    <span style={{ fontFamily: MONO, fontSize: 29, fontWeight: 700, color: 'var(--osd-text)', width: 330 }}>{net}</span>
    <span style={{ fontFamily: MONO, fontSize: 21, color: c, letterSpacing: '0.1em', width: 210 }}>{zone}</span>
    <span style={{ fontSize: 27, color: MUTED }}>{desc}</span>
  </div>
);

const Adressplan: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow>ADRESSPLAN</Eyebrow>
    <div style={{ height: 26 }} />
    <H2>Alles hat seinen Platz.</H2>

    <div style={{ marginTop: 54 }}>
      <NetRow net="10.0.0.0/24" zone="INTERNET" desc="internet_client — die böse Aussenwelt" c={RED} />
      <NetRow net="10.0.100.0/24" zone="REMOTE" desc="remote_client — Aussenstelle" c={CYAN} />
      <NetRow net="10.8.0.0/24" zone="VPN" desc="verschlüsselter WireGuard-Tunnel" c={CYAN} />
      <NetRow net="10.0.10.0/24" zone="DMZ" desc="rev_proxy · dmz_host · ids" c={AMBER} />
      <NetRow net="10.0.20.0/24" zone="TRANSFER" desc="edge_fw ↔ int_router" c={MUTED} />
      <NetRow net="10.0.30.0/24" zone="INTERN" desc="int_client — Mitarbeiter-Netz" c={BLUE} />
      <NetRow net="10.0.40.0/24" zone="TRANSFER" desc="int_router ↔ backend_fw" c={MUTED} />
      <NetRow net="10.0.50.0/24" zone="BACKEND" desc="backend_siem — das Gold im Keller" c={GREEN} />
      <NetRow net="172.20.20.0/24" zone="MGMT" desc="containerlab-Management" c={MUTED} />
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 07 — Edge-Firewall
// ─────────────────────────────────────────────────────────────────────────────

const RuleCard = ({ t, d, chip, c }: { t: string; d: string; chip?: string; c: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
    <div style={{ width: 16, height: 16, borderRadius: '50%', background: c, boxShadow: `0 0 16px ${c}`, flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <span style={{ fontFamily: MONO, fontSize: 29, fontWeight: 700, color: 'var(--osd-text)' }}>{t}</span>
      <span style={{ fontSize: 27, color: MUTED, marginLeft: 20 }}>{d}</span>
      {chip ? (
        <div style={{ marginTop: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 21, color: c, background: `${c}12`, border: `1.5px solid ${c}44`, borderRadius: 8, padding: '5px 14px' }}>
            {chip}
          </span>
        </div>
      ) : null}
    </div>
  </div>
);

const EdgeFw: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <div style={{ display: 'flex', gap: 70, height: '100%' }}>
      <div style={{ width: 420, flexShrink: 0 }}>
        <Eyebrow>SCHICHT 1</Eyebrow>
        <div style={{ height: 24 }} />
        <H2>Die Mauer:<br />edge_fw</H2>
        <svg width={420} height={520} viewBox="0 0 420 520" style={{ marginTop: 30 }}>
          <ellipse cx={210} cy={280} rx={190} ry={230} fill={`${AMBER}0c`} className="sd-glow" />
          {/* abprallende Angriffe */}
          <g stroke={RED} strokeWidth={4} strokeLinecap="round" className="sd-glow">
            <path d="M14 96 h44 m0 0 l-14 -12 m14 12 l-14 12" fill="none" />
            <path d="M406 210 h-44 m0 0 l14 -12 m-14 12 l14 12" fill="none" />
          </g>
          <g stroke={AMBER} strokeWidth={3}>
            <rect x={90} y={60} width={240} height={400} rx={10} fill={`${AMBER}12`} />
            <path d="M90 130 h240 M90 200 h240 M90 270 h240 M90 340 h240" />
            <path d="M170 60 v70 M250 60 v70 M130 130 v70 M210 130 v70 M290 130 v70 M170 200 v70 M250 200 v70 M130 270 v70 M210 270 v70 M290 270 v70 M170 340 v60 M250 340 v60 M130 400 v60 M210 400 v60 M290 400 v60" opacity={0.55} />
          </g>
          <g transform="translate(196,470)"><Ico t="term" s={1.2} c={MUTED} /></g>
        </svg>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 46 }}>
        <Steps>
          <Step duration={260}>
            <RuleCard c={RED} t="Default-DROP" d="alles Routing ist verboten, bis eine Regel es erlaubt" chip="iptables -P FORWARD DROP" />
          </Step>
          <Step duration={260}>
            <RuleCard c={BLUE} t="Stateful" d="Antworten auf erlaubte Verbindungen dürfen zurück" chip="-m state --state ESTABLISHED,RELATED" />
          </Step>
          <Step duration={260}>
            <RuleCard c={AMBER} t="Pinholes" d="Internet → nur Proxy :80 · Intern → frei · Logs → SIEM :514" />
          </Step>
          <Step duration={260}>
            <RuleCard c={GREEN} t="backend_fw" d="dasselbe Prinzip nochmal — noch strenger, vor dem SIEM" />
          </Step>
        </Steps>
      </div>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 08 — WireGuard VPN
// ─────────────────────────────────────────────────────────────────────────────

const Vpn: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow c={CYAN}>REMOTE ACCESS</Eyebrow>
    <div style={{ height: 24 }} />
    <H2>WireGuard: der geheime Tunnel.</H2>

    <svg width={1680} height={330} viewBox="0 0 1680 330" style={{ display: 'block', marginTop: 48 }}>
      {/* Tunnel */}
      <path className="sd-flow" d="M340,150 H1080" stroke={CYAN} strokeWidth={3} opacity={0.7} />
      <path className="sd-flow" d="M340,206 H1080" stroke={CYAN} strokeWidth={3} opacity={0.7} />

      {/* fliessende Pakete im Tunnel */}
      <circle r={7} fill={CYAN}><animateMotion dur="3s" repeatCount="indefinite" path="M350,178 H1070" /></circle>
      <circle r={7} fill={CYAN}><animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M350,178 H1070" /></circle>
      <circle r={7} fill={CYAN}><animateMotion dur="3s" begin="2s" repeatCount="indefinite" path="M350,178 H1070" /></circle>

      {/* remote_client */}
      <rect x={40} y={108} width={280} height={112} rx={12} fill={`${CYAN}14`} stroke={`${CYAN}88`} strokeWidth={2} />
      <g transform="translate(162,122)"><Ico t="laptop" s={1.5} c={CYAN} /></g>
      <text x={180} y={186} textAnchor="middle" fontFamily={MONO} fontSize={25} fontWeight={700} fill="#eef1f7">remote_client</text>
      <text x={180} y={212} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={MUTED}>10.8.0.2 · Aussenstelle</text>

      {/* Schloss in Tunnelmitte */}
      <circle cx={710} cy={178} r={44} fill="#0b0d12" stroke={CYAN} strokeWidth={2.5} />
      <g transform="translate(692,160)"><Ico t="lock" s={1.5} c={CYAN} /></g>
      <text x={710} y={252} textAnchor="middle" fontFamily={MONO} fontSize={18} fill={CYAN}>ChaCha20 verschlüsselt</text>

      {/* edge_fw */}
      <rect x={1080} y={88} width={140} height={180} rx={12} fill={`${AMBER}16`} stroke={AMBER} strokeWidth={2.5} />
      <g transform="translate(1118,128)"><Ico t="wall" s={1.9} c={AMBER} /></g>
      <text x={1150} y={234} textAnchor="middle" fontFamily={MONO} fontSize={24} fontWeight={700} fill="#eef1f7">edge_fw</text>
      <text x={1150} y={258} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={MUTED}>wg0 · 10.8.0.1</text>

      {/* Ziele rechts */}
      <line x1={1220} y1={128} x2={1330} y2={64} stroke={GREEN} strokeWidth={3} />
      <line x1={1220} y1={178} x2={1330} y2={168} stroke={GREEN} strokeWidth={3} />
      <line x1={1220} y1={228} x2={1330} y2={272} stroke={RED} strokeWidth={3} />

      <rect x={1330} y={26} width={290} height={76} rx={12} fill={`${GREEN}12`} stroke={`${GREEN}66`} strokeWidth={2} />
      <text x={1362} y={58} fontFamily={MONO} fontSize={25} fontWeight={700} fill={GREEN}>DMZ ✓</text>
      <text x={1362} y={86} fontFamily={MONO} fontSize={16} fill={MUTED}>Web über Proxy</text>

      <rect x={1330} y={130} width={290} height={76} rx={12} fill={`${GREEN}12`} stroke={`${GREEN}66`} strokeWidth={2} />
      <text x={1362} y={162} fontFamily={MONO} fontSize={25} fontWeight={700} fill={GREEN}>INTERN ✓</text>
      <text x={1362} y={190} fontFamily={MONO} fontSize={16} fill={MUTED}>interne Dienste</text>

      <rect x={1330} y={234} width={290} height={76} rx={12} fill={`${RED}12`} stroke={`${RED}66`} strokeWidth={2} />
      <text x={1362} y={266} fontFamily={MONO} fontSize={25} fontWeight={700} fill={RED}>BACKEND ✗</text>
      <text x={1362} y={294} fontFamily={MONO} fontSize={16} fill={MUTED}>kein VPN-Zugriff — nie</text>

      <g className="sd-glow" stroke={RED} strokeWidth={5} strokeLinecap="round">
        <path d="M1308,256 l16,16 M1324,256 l-16,16" />
      </g>
    </svg>

    <div style={{ display: 'flex', gap: 22, marginTop: 40 }}>
      <Chip c={CYAN}>UDP 51820</Chip>
      <Chip c={CYAN}>10.8.0.0/24</Chip>
      <Chip c={CYAN}>2 Peers · Public-Key-Auth</Chip>
      <Chip c={RED}>Policy: kein Backend-Zugriff</Chip>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 09 — DMZ & WAF
// ─────────────────────────────────────────────────────────────────────────────

const Waf: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow c={ORANGE}>SCHICHT 2 · DMZ</Eyebrow>
    <div style={{ height: 24 }} />
    <H2>Der Proxy nimmt die Schläge.</H2>

    <svg width={1680} height={430} viewBox="0 0 1680 430" style={{ display: 'block', marginTop: 40 }}>
      {/* Angreifer */}
      <rect x={40} y={120} width={220} height={180} rx={12} fill={`${RED}14`} stroke={`${RED}88`} strokeWidth={2} />
      <g transform="translate(127,142)"><Ico t="globe" s={1.9} c={RED} /></g>
      <text x={150} y={222} textAnchor="middle" fontFamily={MONO} fontSize={25} fontWeight={700} fill="#eef1f7">internet_</text>
      <text x={150} y={250} textAnchor="middle" fontFamily={MONO} fontSize={25} fontWeight={700} fill="#eef1f7">client</text>
      <text x={150} y={280} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={MUTED}>böse Absichten</text>

      {/* Spur 1: erlaubter Request */}
      <path d="M280,170 H1360" stroke={GREEN} strokeWidth={3} opacity={0.35} />
      <circle r={7} fill={GREEN}>
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M280,170 H1360" />
      </circle>
      <text x={320} y={146} fontFamily={MONO} fontSize={20} fill={GREEN}>GET /index.html → 200 ✓</text>

      {/* Spur 2: Angriff */}
      <path d="M280,254 H600" stroke={RED} strokeWidth={3} opacity={0.35} />
      <circle r={7} fill={RED}>
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M280,254 H592" />
        <animate attributeName="opacity" values="1;1;1;0" keyTimes="0;0.7;0.88;1" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <text x={320} y={232} fontFamily={MONO} fontSize={20} fill={RED}>/?id=1' OR 1=1 → 403 ✗</text>

      {/* WAF */}
      <rect x={620} y={110} width={300} height={200} rx={14} fill={`${ORANGE}16`} stroke={ORANGE} strokeWidth={2.5} />
      <circle cx={770} cy={168} r={40} fill="#0b0d12" stroke={`${ORANGE}88`} strokeWidth={2} />
      <g transform="translate(752,150)"><Ico t="shield" s={1.5} c={ORANGE} /></g>
      <text x={770} y={238} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill="#eef1f7">rev_proxy</text>
      <text x={770} y={266} textAnchor="middle" fontFamily={MONO} fontSize={19} fill={ORANGE}>WAF · 10.0.10.20</text>
      <text x={770} y={292} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={MUTED}>einziger sichtbarer Dienst</text>
      <g className="sd-glow" stroke={RED} strokeWidth={5} strokeLinecap="round">
        <path d="M592,246 l16,16 M608,246 l-16,16" />
      </g>

      {/* Webserver */}
      <rect x={1360} y={130} width={230} height={160} rx={12} fill={`${ORANGE}0e`} stroke={`${ORANGE}55`} strokeWidth={2} strokeDasharray="6 6" />
      <circle cx={1475} cy={168} r={38} fill="#0b0d12" stroke={`${ORANGE}55`} strokeWidth={2} />
      <g transform="translate(1457,150)"><Ico t="server" s={1.5} c={MUTED} /></g>
      <text x={1475} y={226} textAnchor="middle" fontFamily={MONO} fontSize={25} fontWeight={700} fill="#eef1f7">dmz_host</text>
      <text x={1475} y={254} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={MUTED}>versteckt dahinter</text>

      {/* Alarmlinie zum SIEM */}
      <path className="sd-flow" d="M770,310 V375 H1475" stroke={AMBER} strokeWidth={2.5} fill="none" opacity={0.75} />
      <circle r={6} fill={AMBER}>
        <animateMotion dur="3s" repeatCount="indefinite" path="M770,310 V375 H1475" />
      </circle>
      <text x={800} y={410} fontFamily={MONO} fontSize={19} fill={AMBER}>WAF_ALERT → SIEM</text>
    </svg>

    <div style={{ display: 'flex', gap: 22, marginTop: 26 }}>
      <Chip c={RED}>union.*select</Chip>
      <Chip c={RED}>or.*1=1</Chip>
      <Chip c={RED}>&lt;script&gt;</Chip>
      <Chip c={ORANGE}>return 403 — und jeder Treffer wird gemeldet</Chip>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 10 — IDS (Hub-Trick)
// ─────────────────────────────────────────────────────────────────────────────

const Ids: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow c={GREEN}>SCHICHT 3 · ERKENNEN</Eyebrow>
    <div style={{ height: 24 }} />
    <H2>Der Trick: Switch wird zum Hub.</H2>

    <svg width={1680} height={360} viewBox="0 0 1680 360" style={{ display: 'block', marginTop: 40 }}>
      {/* Firewall-Port */}
      <rect x={40} y={120} width={220} height={124} rx={12} fill={`${AMBER}14`} stroke={`${AMBER}88`} strokeWidth={2} />
      <g transform="translate(132,138)"><Ico t="wall" s={1.5} c={AMBER} /></g>
      <text x={150} y={196} textAnchor="middle" fontFamily={MONO} fontSize={23} fontWeight={700} fill="#eef1f7">edge_fw</text>
      <text x={150} y={224} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={MUTED}>Traffic kommt rein</text>

      {/* Switch */}
      <rect x={420} y={130} width={300} height={104} rx={14} fill={`${MUTED}14`} stroke={`${MUTED}77`} strokeWidth={2.5} />
      <circle cx={480} cy={130} r={6} fill={AMBER} />
      <circle cx={540} cy={130} r={6} fill={ORANGE} />
      <circle cx={600} cy={130} r={6} fill={GREEN} />
      <circle cx={660} cy={130} r={6} fill={MUTED} />
      <text x={570} y={182} textAnchor="middle" fontFamily={MONO} fontSize={26} fontWeight={700} fill="#eef1f7">dmz_switch</text>
      <text x={570} y={212} textAnchor="middle" fontFamily={MONO} fontSize={17} fill={GREEN}>Hub-Modus: flutet alles</text>

      {/* Kabel */}
      <g stroke={LINE} strokeWidth={3} fill="none">
        <path d="M260,182 H420" />
        <path d="M720,160 C820,160 830,70 940,70" />
        <path d="M720,182 H940" />
        <path d="M720,204 C820,204 830,294 940,294" />
      </g>

      {/* Frame kommt an ... */}
      <circle r={7} fill={AMBER}>
        <animateMotion dur="2.8s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.4;1" calcMode="linear" path="M260,182 H414" />
      </circle>
      {/* ... und wird an ALLE Ports vervielfacht */}
      <circle r={6} fill={ORANGE}>
        <animateMotion dur="2.8s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.4;0.75;1" calcMode="linear" path="M720,160 C820,160 830,70 940,70" />
      </circle>
      <circle r={6} fill={ORANGE}>
        <animateMotion dur="2.8s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.4;0.75;1" calcMode="linear" path="M720,182 H940" />
      </circle>
      <circle r={6} fill={GREEN}>
        <animateMotion dur="2.8s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.4;0.75;1" calcMode="linear" path="M720,204 C820,204 830,294 940,294" />
      </circle>

      {/* Ports */}
      <rect x={940} y={34} width={250} height={72} rx={12} fill={`${ORANGE}12`} stroke={`${ORANGE}66`} strokeWidth={2} />
      <text x={970} y={64} fontFamily={MONO} fontSize={23} fontWeight={700} fill="#eef1f7">rev_proxy</text>
      <text x={970} y={90} fontFamily={MONO} fontSize={17} fill={MUTED}>sieht jeden Frame</text>

      <rect x={940} y={146} width={250} height={72} rx={12} fill={`${ORANGE}12`} stroke={`${ORANGE}66`} strokeWidth={2} />
      <text x={970} y={176} fontFamily={MONO} fontSize={23} fontWeight={700} fill="#eef1f7">dmz_host</text>
      <text x={970} y={202} fontFamily={MONO} fontSize={17} fill={MUTED}>sieht jeden Frame</text>

      <rect x={940} y={258} width={250} height={84} rx={12} fill={`${GREEN}14`} stroke={GREEN} strokeWidth={2.5} />
      <g transform="translate(962,276)"><Ico t="eye" s={1.5} c={GREEN} /></g>
      <text x={1014} y={294} fontFamily={MONO} fontSize={23} fontWeight={700} fill={GREEN}>ids</text>
      <text x={1014} y={320} fontFamily={MONO} fontSize={17} fill={MUTED}>meldet Verdacht</text>

      {/* Alarm */}
      <path className="sd-flow" d="M1190,300 H1420" stroke={AMBER} strokeWidth={2.5} opacity={0.75} />
      <circle r={6} fill={AMBER}>
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M1190,300 H1420" />
      </circle>
      <text x={1224} y={284} fontFamily={MONO} fontSize={19} fill={AMBER}>IDS_ALERT → SIEM</text>

      {/* Regel */}
      <rect x={1420} y={234} width={230} height={132} rx={12} fill={`${GREEN}0e`} stroke={`${GREEN}44`} strokeWidth={2} />
      <text x={1444} y={272} fontFamily={MONO} fontSize={19} fill={GREEN}>tcpdump-Filter:</text>
      <text x={1444} y={302} fontFamily={MONO} fontSize={18} fill="#eef1f7">SYN &amp; Port ≠ 80</text>
      <text x={1444} y={332} fontFamily={MONO} fontSize={18} fill={MUTED}>= Port-Scan</text>
    </svg>

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, marginTop: 30 }}>
      <Chip c={GREEN}>ip link set dev dmz_switch type bridge ageing_time 0</Chip>
      <Chip c={MUTED}>MAC-Learning aus → jede Nachricht an alle Ports — die IDS hört mit</Chip>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 11 — SIEM & Logging-Pipeline
// ─────────────────────────────────────────────────────────────────────────────

const Siem: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow c={GREEN}>SCHICHT 4 · SEHEN</Eyebrow>
    <div style={{ height: 24 }} />
    <H2>Am Ende leuchtet das Dashboard.</H2>

    <svg width={1680} height={240} viewBox="0 0 1680 240" style={{ display: 'block', marginTop: 36 }}>
      {/* Quellen */}
      <rect x={30} y={20} width={220} height={80} rx={12} fill={`${ORANGE}14`} stroke={`${ORANGE}88`} strokeWidth={2} />
      <text x={60} y={52} fontFamily={MONO} fontSize={24} fontWeight={700} fill="#eef1f7">WAF</text>
      <text x={60} y={80} fontFamily={MONO} fontSize={16} fill={MUTED}>geblockte Angriffe</text>

      <rect x={30} y={140} width={220} height={80} rx={12} fill={`${GREEN}14`} stroke={`${GREEN}88`} strokeWidth={2} />
      <text x={60} y={172} fontFamily={MONO} fontSize={24} fontWeight={700} fill="#eef1f7">IDS</text>
      <text x={60} y={200} fontFamily={MONO} fontSize={16} fill={MUTED}>Scan-Alarme</text>

      {/* Sammelleitung */}
      <path d="M250,60 H400 V120" stroke={AMBER} strokeWidth={3} fill="none" opacity={0.4} />
      <path d="M250,180 H400 V120" stroke={AMBER} strokeWidth={3} fill="none" opacity={0.4} />
      <path className="sd-flow" d="M400,120 H1140" stroke={AMBER} strokeWidth={3} />
      <text x={470} y={98} fontFamily={MONO} fontSize={19} fill={AMBER}>syslog · UDP 514</text>

      {/* fliegende Logs */}
      <circle r={7} fill={AMBER}><animateMotion dur="3s" repeatCount="indefinite" path="M250,60 H400 V120 H1140" /></circle>
      <circle r={7} fill={AMBER}><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M250,180 H400 V120 H1140" /></circle>

      {/* Firewall-Tore auf dem Weg */}
      <circle cx={684} cy={120} r={30} fill="#0b0d12" stroke={LINE} strokeWidth={2} />
      <g transform="translate(662,98)"><Ico t="wall" s={2} c={MUTED} /></g>
      <text x={684} y={172} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={MUTED}>edge_fw</text>
      <circle cx={914} cy={120} r={30} fill="#0b0d12" stroke={LINE} strokeWidth={2} />
      <g transform="translate(892,98)"><Ico t="wall" s={2} c={MUTED} /></g>
      <text x={914} y={172} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={MUTED}>backend_fw</text>

      {/* SIEM */}
      <rect x={1140} y={42} width={270} height={140} rx={14} fill={`${GREEN}16`} stroke={GREEN} strokeWidth={2.5} />
      <g transform="translate(1252,58)"><Ico t="funnel" s={1.9} c={GREEN} /></g>
      <text x={1275} y={126} textAnchor="middle" fontFamily={MONO} fontSize={25} fontWeight={700} fill="#eef1f7">backend_siem</text>
      <text x={1275} y={154} textAnchor="middle" fontFamily={MONO} fontSize={18} fill={GREEN}>socat · udp-recv :514</text>
      <text x={1275} y={178} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={MUTED}>≈ 30 Zeilen Shell</text>

      {/* Dashboard */}
      <path d="M1410,112 H1470" stroke={GREEN} strokeWidth={3} opacity={0.4} />
      <rect x={1470} y={52} width={190} height={128} rx={14} fill={`${GREEN}12`} stroke={`${GREEN}66`} strokeWidth={2} />
      <g transform="translate(1541,72)"><Ico t="monitor" s={2} c={GREEN} /></g>
      <text x={1565} y={146} textAnchor="middle" fontFamily={MONO} fontSize={21} fontWeight={700} fill={GREEN}>SOC-Dash</text>
      <text x={1565} y={170} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={MUTED}>refresh 1s</text>
    </svg>

    {/* Dashboard-Mock */}
    <div style={{ marginTop: 36, background: '#0a0c08', border: `1.5px solid ${GREEN}44`, borderRadius: 'var(--osd-radius)', padding: '26px 36px', fontFamily: MONO }}>
      <div style={{ fontSize: 22, color: GREEN, letterSpacing: '0.1em' }}>SIEM SOC DASHBOARD — 10.0.50.10</div>
      <div style={{ height: 1, background: `${GREEN}33`, margin: '16px 0' }} />
      <Steps>
        <Step duration={300}>
          <div style={{ fontSize: 25, color: GREEN, lineHeight: 1.7 }}>
            <span className="sd-glow">▌</span> WAF_ALERT: 403 /?id=1' OR 1=1 — von 10.0.0.10
          </div>
        </Step>
        <Step duration={300}>
          <div style={{ fontSize: 25, color: GREEN, lineHeight: 1.7 }}>
            <span className="sd-glow">▌</span> IDS_ALERT: Verdächtiger Port-Zugriff (Scan) erkannt!
          </div>
        </Step>
        <Step duration={300}>
          <div style={{ fontSize: 23, color: MUTED, marginTop: 10 }}>
            Seite aktualisiert sich automatisch jede Sekunde<span className="sd-blink">▊</span>
          </div>
        </Step>
      </Steps>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 12 — Angriffsszenario (Demo)
// ─────────────────────────────────────────────────────────────────────────────

const DemoCard = ({ n, t, cmd, res, c }: { n: string; t: string; cmd: string; res: string; c: string }) => (
  <div style={{ flex: 1, border: `1.5px solid ${c}44`, background: `${c}0a`, borderRadius: 'var(--osd-radius)', padding: '30px 36px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: c, border: `1.5px solid ${c}66`, borderRadius: 8, padding: '2px 12px' }}>{n}</span>
      <span style={{ fontFamily: MONO, fontSize: 27, fontWeight: 700, color: 'var(--osd-text)', letterSpacing: '0.06em' }}>{t}</span>
    </div>
    <div style={{ marginTop: 22, background: '#0a0c08', border: `1px solid ${LINE}`, borderRadius: 10, padding: '16px 22px', fontFamily: MONO, fontSize: 22, color: '#eef1f7' }}>
      <span style={{ color: GREEN }}>internet_client:~#</span> {cmd}
    </div>
    <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 22, color: c }}>
      <span className="sd-glow">●</span> {res}
    </div>
  </div>
);

const Demo: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow c={RED}>LIVE-DEMO</Eyebrow>
    <div style={{ height: 24 }} />
    <H2>Greif uns an — wir sind bereit.</H2>

    <div style={{ display: 'flex', gap: 28, marginTop: 70 }}>
      <Steps>
        <Step duration={280}>
          <DemoCard n="1" t="PORTSCAN" cmd="nmap 10.0.10.0/24" res="IDS_ALERT → SIEM" c={RED} />
        </Step>
        <Step duration={280}>
          <DemoCard n="2" t="SQL-INJECTION" cmd="curl '/?id=1' OR 1=1" res="403 Forbidden · WAF_ALERT → SIEM" c={ORANGE} />
        </Step>
        <Step duration={280}>
          <DemoCard n="3" t="ERGEBNIS" cmd="# Dashboard beobachten" res="Angriff erkannt. Gemeldet. Blockiert." c={GREEN} />
        </Step>
      </Steps>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 13 — Fazit
// ─────────────────────────────────────────────────────────────────────────────

const FazitCard = ({ t, d, icon, c }: { t: string; d: string; icon: IconT; c: string }) => (
  <div style={{ flex: 1, border: `1.5px solid ${c}44`, background: `${c}0a`, borderRadius: 'var(--osd-radius)', padding: '36px 40px' }}>
    <svg width={52} height={52} viewBox="0 0 24 24"><Ico t={icon} s={2.1} c={c} /></svg>
    <div style={{ fontSize: 32, fontWeight: 800, marginTop: 22, color: 'var(--osd-text)' }}>{t}</div>
    <div style={{ fontSize: 26, lineHeight: 1.5, color: MUTED, marginTop: 12 }}>{d}</div>
  </div>
);

const Fazit: Page = () => (
  <section style={{ ...fill, background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: 120, position: 'relative' }}>
    <GlobalFx />
    <Eyebrow>FAZIT</Eyebrow>
    <div style={{ height: 26 }} />
    <H2>Was wir gelernt haben.</H2>

    <div style={{ display: 'flex', gap: 28, marginTop: 64 }}>
      <FazitCard t="Schichten wirken" d="Kein einzelnes System ist perfekt — zusammen halten sie stand." icon="shield" c={RED} />
      <FazitCard t="Wenig genügt" d="Alpine, nginx und Shell-Befehle bauen ein komplettes SOC." icon="mountain" c={AMBER} />
      <FazitCard t="Sehen ist Schützen" d="Ohne Logging bleibt jeder Angriff unsichtbar." icon="eye" c={GREEN} />
    </div>

    <div style={{ display: 'flex', gap: 22, marginTop: 52 }}>
      <Chip c={MUTED}>Nächste Schritte:</Chip>
      <Chip c={AMBER}>ICMP-Regel entfernen</Chip>
      <Chip c={AMBER}>VPN-Keys aus dem Repo</Chip>
      <Chip c={AMBER}>Management-Netz isolieren</Chip>
    </div>

    {/* kleine Sonne als Schlussbild */}
    <div style={{ position: 'absolute', right: 140, bottom: 130, width: 120, height: 120 }}>
      <div className="sd-sun" style={{ position: 'absolute', inset: 18, borderRadius: '50%', background: `radial-gradient(circle at 38% 34%, #ffd57a, ${AMBER} 60%, #d98a10)` }} />
      <div className="sd-orbit" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px dashed ${AMBER}40` }}>
        <div style={{ position: 'absolute', left: '50%', top: -4, width: 9, height: 9, marginLeft: -4.5, borderRadius: '50%', background: AMBER }} />
      </div>
    </div>
    <div style={{ position: 'absolute', right: 140, bottom: 84, fontFamily: MONO, fontSize: 24, color: AMBER }}>
      Danke — Fragen?<span className="sd-blink"> ▊</span>
    </div>

    <Foot />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// Exporte
// ─────────────────────────────────────────────────────────────────────────────

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

Cover.transition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'sun-dmz · Security-Lab',
  createdAt: '2026-10-06T15:23:05.027Z',
};

export const notes: (string | undefined)[] = [
  'Begrüßung. Ein Satz vorweg: Wir haben ein komplettes Firmennetz als Sicherheits-Lab gebaut — ausschließlich mit Linux-Containern, ohne eine einzige Lizenz.',
  'Die Ausgangsfrage: Wie lernt man Netzwerk-Sicherheit, ohne ein Rechenzentrum zu mieten? Die Zahlen links nacheinander aufbauen. 11 Nodes, 8 Netze, 2 Firewalls — alles auf einem Laptop.',
  'Kurz durch den Werkzeugkasten gehen. Pointe: Jedes Werkzeug ist Standard-Linux — das Lab ließe sich 1:1 auf echte Router übertragen.',
  'Defense in Depth erklären: Nicht eine Mauer, sondern fünf Schichten. Schritt für Schritt von außen nach innen arbeiten. Der rote Pfeil rechts prallt an den Schichten ab.',
  'Das Herzstück: Die Topologie. Erst die Zonen zeigen (rot/amber/blau/grün), dann die bewegten Pakete: Grün = erlaubter Traffic, Rot = an der Firewall blockiert, Amber = Logs auf dem Weg zum SIEM, Cyan = VPN-Tunnel. Hier ruhig eine Minute verweilen.',
  'Der Adressplan zeigt die saubere Struktur: Jede Zone ein eigenes /24. Das Backend (grün) ist die am stärksten geschützte Zone.',
  'Schicht 1: Die edge_fw. Wichtigste Botschaft: Default-DROP — erst mal ist alles verboten. Dann stateful inspection, dann gezielte Ausnahmen (Pinholes). Die zweite Firewall (backend_fw) wiederholt das Prinzip vor dem SIEM.',
  'WireGuard: Der Tunnel für die Außenstelle. Die Policy-Karten rechts sind die Kernbotschaft: VPN-Nutzer dürfen viel — aber NIEMALS ins Backend. Verschlüsselung mit ChaCha20, Public-Key-Authentifizierung.',
  'Schicht 2: In der DMZ nimmt der Reverse Proxy die Schläge. Zwei Spuren im Diagramm: Grün (normaler Request) kommt durch bis zum Webserver, Rot (SQL-Injection) wird mit 403 blockiert und gemeldet.',
  'Der eleganteste Trick des Projekts: ageing_time 0 macht die Bridge zum Hub — sie flutet jeden Frame an alle Ports. So hört die IDS passiv den gesamten DMZ-Verkehr mit, ganz ohne Port-Mirroring.',
  'Die Log-Pipeline: WAF und IDS schicken Alarme per syslog (UDP 514) durch BEIDE Firewalls bis zum SIEM. Aus ~30 Zeilen Shell wird ein Live-Dashboard, das sich pro Sekunde selbst aktualisiert.',
  'Die Live-Demo als Story: Port-Scan und SQL-Injection von außen — beide Angriffe werden erkannt, blockiert und landen im Dashboard. Das ist der Beweis, dass die Architektur funktioniert.',
  'Abschluss: Drei Erkenntnisse, dann ehrlich die nächsten Schritte (ICMP-Regel raus, VPN-Keys aus dem Repo, Management-Netz isolieren). Danach Fragen.',
];

export default [
  Cover,
  Idee,
  Stack,
  Layers,
  Topologie,
  Adressplan,
  EdgeFw,
  Vpn,
  Waf,
  Ids,
  Siem,
  Demo,
  Fazit,
] satisfies Page[];
