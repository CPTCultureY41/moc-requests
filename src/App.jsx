import { useState } from "react";

const DEPARTMENTS = { Admin: "Admin", "Visual Media": "Visual Media", Design: "Design", Sound: "Sound" };

const REQUEST_TYPES = [
  { id: "admin", label: "Admin Request", dept: "Admin", complex: false, description: "Leadership-directed requests & general admin", icon: "⚙️" },
  { id: "photography", label: "Photography", dept: "Visual Media", complex: false, description: "Photographer needed for an event or session", icon: "📷" },
  { id: "video", label: "Video Production", dept: "Visual Media", complex: true, description: "Video creation, editing, or filming", icon: "🎬" },
  { id: "graphic_design", label: "Graphic Design", dept: "Design", complex: true, description: "Digital graphics, posters, social media content", icon: "🎨" },
  { id: "art_production", label: "Art Production / Décor", dept: "Design", complex: true, description: "Physical décor, set design, stage production", icon: "🖼️" },
  { id: "sound", label: "Sound & Equipment", dept: "Sound", complex: false, description: "Sound support, recording, or equipment loan", icon: "🎙️" },
];

const SIMPLE_STAGES = ["Pending", "Received", "In Progress", "Ready"];
const STORAGE_KEY = "moc_requests_v2";

function loadRequests() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveRequests(reqs) { localStorage.setItem(STORAGE_KEY, JSON.stringify(reqs)); }
function genId() { return "REQ-" + Date.now().toString(36).toUpperCase(); }

const DEPT_STYLES = {
  Admin: { accent: "#818CF8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)" },
  "Visual Media": { accent: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
  Design: { accent: "#C084FC", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)" },
  Sound: { accent: "#34D399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #0A0A0A; color: #F2EFE9; min-height: 100vh; -webkit-font-smoothing: antialiased; }
.nav { background: rgba(10,10,10,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid #1E1E1E; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
.nav-brand { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: #F2EFE9; letter-spacing: 0.5px; }
.nav-brand span { color: #C9A84C; }
.nav-tabs { display: flex; gap: 2px; }
.nav-tab { padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: #666; cursor: pointer; transition: all 0.2s; }
.nav-tab:hover { color: #F2EFE9; background: #1A1A1A; }
.nav-tab.active { color: #C9A84C; background: rgba(201,168,76,0.1); }
.hero-section { background: linear-gradient(135deg, #0F0F0F 0%, #141414 50%, #0F0F0F 100%); border-bottom: 1px solid #1E1E1E; padding: 56px 32px 48px; position: relative; overflow: hidden; }
.hero-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 60%); pointer-events: none; }
.hero-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #C9A84C; margin-bottom: 14px; }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 5vw, 56px); font-weight: 300; line-height: 1.05; color: #F2EFE9; margin-bottom: 14px; letter-spacing: -0.5px; }
.hero-title em { font-style: italic; color: #C9A84C; }
.hero-rule { width: 40px; height: 1px; background: #C9A84C; margin-bottom: 16px; }
.hero-sub { font-size: 14px; color: #666; line-height: 1.7; max-width: 480px; }
.main { max-width: 760px; margin: 0 auto; padding: 48px 32px 100px; }
.main.wide { max-width: 1140px; }
.section-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #444; margin-bottom: 20px; }
.type-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; margin-bottom: 32px; }
.type-card { border: 1px solid #1E1E1E; border-radius: 14px; padding: 20px; cursor: pointer; transition: all 0.25s; background: #111; text-align: left; }
.type-card:hover { border-color: #2E2E2E; transform: translateY(-2px); }
.type-icon { font-size: 24px; margin-bottom: 12px; display: block; }
.type-label { font-size: 14px; font-weight: 600; color: #F2EFE9; margin-bottom: 5px; }
.type-desc { font-size: 12px; color: #555; line-height: 1.5; }
.type-dept-tag { display: inline-block; margin-top: 12px; font-size: 10px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; padding: 3px 8px; border-radius: 20px; }
.form-card { background: #111; border: 1px solid #1E1E1E; border-radius: 16px; padding: 32px; margin-bottom: 20px; }
.form-card-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: #F2EFE9; margin-bottom: 24px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
@media (max-width: 540px) { .form-row { grid-template-columns: 1fr; } }
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 11px; font-weight: 600; color: #555; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
.form-input, .form-textarea { width: 100%; padding: 12px 16px; border: 1px solid #222; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px; color: #F2EFE9; background: #0F0F0F; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
.form-input::placeholder, .form-textarea::placeholder { color: #333; }
.form-input:focus, .form-textarea:focus { border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }
.form-textarea { min-height: 110px; resize: vertical; line-height: 1.6; }
.form-hint { font-size: 11px; color: #444; margin-top: 6px; line-height: 1.5; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-top: 1px solid #1A1A1A; }
.toggle-label { font-size: 14px; font-weight: 500; color: #F2EFE9; }
.toggle-sub { font-size: 12px; color: #555; margin-top: 3px; }
.toggle { width: 44px; height: 24px; background: #222; border-radius: 20px; border: none; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; margin-left: 20px; }
.toggle.on { background: #C9A84C; }
.toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.4); }
.toggle.on::after { transform: translateX(20px); }
.divider { border: none; border-top: 1px solid #1A1A1A; margin: 24px 0; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 10px; border: none; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: #C9A84C; color: #0A0A0A; font-weight: 600; }
.btn-primary:hover { background: #D4B55E; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,76,0.3); }
.btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-ghost { background: transparent; color: #666; border: 1px solid #222; }
.btn-ghost:hover { border-color: #444; color: #F2EFE9; }
.btn-sm { padding: 8px 16px; font-size: 12px; }
.actions-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.success-wrap { text-align: center; padding: 80px 20px; }
.success-icon { font-size: 52px; margin-bottom: 24px; display: block; }
.success-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: #F2EFE9; margin-bottom: 8px; }
.success-ref { display: inline-block; background: rgba(201,168,76,0.1); color: #C9A84C; border: 1px solid rgba(201,168,76,0.3); font-size: 13px; font-weight: 600; padding: 8px 20px; border-radius: 20px; margin-bottom: 20px; letter-spacing: 1px; }
.success-sub { font-size: 14px; color: #555; margin-bottom: 40px; line-height: 1.7; }
.tracker-search { display: flex; gap: 10px; margin-bottom: 28px; }
.req-result-card { background: #111; border: 1px solid #1E1E1E; border-radius: 16px; padding: 24px 28px; }
.req-ref-tag { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #444; text-transform: uppercase; margin-bottom: 4px; }
.req-title-text { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: #F2EFE9; margin-bottom: 4px; }
.req-meta-text { font-size: 12px; color: #555; margin-bottom: 20px; }
.team-note { margin-top: 16px; padding: 12px 16px; background: rgba(201,168,76,0.07); border: 1px solid rgba(201,168,76,0.15); border-radius: 10px; font-size: 13px; color: #C9A84C; line-height: 1.6; }
.stages { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.stage-pill { font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px; background: #1A1A1A; color: #444; }
.stage-pill.done { background: rgba(52,211,153,0.1); color: #34D399; }
.stage-pill.current { background: #C9A84C; color: #0A0A0A; }
.progress-wrap { margin-top: 16px; }
.progress-track { height: 4px; background: #1A1A1A; border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #C9A84C, #D4B55E); border-radius: 10px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
.progress-pct { font-size: 12px; color: #555; }
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.filter-chip { padding: 6px 14px; border-radius: 20px; border: 1px solid #1E1E1E; background: transparent; font-size: 12px; font-weight: 500; color: #555; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
.filter-chip:hover { border-color: #333; color: #F2EFE9; }
.filter-chip.active { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.08); }
.req-row { background: #111; border: 1px solid #1A1A1A; border-radius: 14px; padding: 20px 24px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
.req-row:hover { border-color: #2E2E2E; background: #141414; transform: translateY(-1px); }
.req-row-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.req-row-left { flex: 1; }
.req-row-id { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #333; text-transform: uppercase; margin-bottom: 3px; }
.req-row-title { font-size: 15px; font-weight: 500; color: #F2EFE9; margin-bottom: 4px; }
.req-row-meta { font-size: 12px; color: #444; }
.dept-pill { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; flex-shrink: 0; }
.meeting-tag { display: inline-block; margin-left: 10px; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; background: rgba(251,146,60,0.1); color: #FB923C; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
.modal { background: #111; border: 1px solid #1E1E1E; border-radius: 20px; padding: 36px; max-width: 600px; width: 100%; max-height: 88vh; overflow-y: auto; }
.modal-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
.modal-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: #F2EFE9; }
.detail-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.detail-item { display: flex; gap: 16px; align-items: flex-start; }
.detail-key { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #333; min-width: 100px; padding-top: 2px; flex-shrink: 0; }
.detail-val { font-size: 14px; color: #CCC; line-height: 1.6; }
.update-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #333; margin-bottom: 14px; }
.stage-select { width: 100%; padding: 11px 16px; border: 1px solid #222; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 14px; color: #F2EFE9; background: #0F0F0F; cursor: pointer; outline: none; margin-bottom: 16px; }
.progress-slider { width: 100%; margin: 8px 0 4px; accent-color: #C9A84C; }
.note-textarea { width: 100%; padding: 12px 16px; border: 1px solid #222; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 13px; color: #F2EFE9; background: #0F0F0F; resize: vertical; min-height: 80px; outline: none; line-height: 1.6; transition: border-color 0.2s; margin-top: 10px; }
.note-textarea::placeholder { color: #333; }
.note-textarea:focus { border-color: #C9A84C; }
.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 40px; margin-bottom: 14px; opacity: 0.4; }
.empty-text { font-size: 14px; color: #444; }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
@media (max-width: 640px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
.stat-card { background: #111; border: 1px solid #1A1A1A; border-radius: 12px; padding: 16px 20px; }
.stat-num { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #F2EFE9; line-height: 1; margin-bottom: 4px; }
.stat-label { font-size: 11px; color: #444; font-weight: 500; }
`;

function DeptPill({ dept }) {
  const s = DEPT_STYLES[dept] || { accent: "#666", bg: "rgba(102,102,102,0.1)", border: "rgba(102,102,102,0.2)" };
  return <span className="dept-pill" style={{ background: s.bg, color: s.accent, border: `1px solid ${s.border}` }}>{dept}</span>;
}

function StageTracker({ stage }) {
  const idx = SIMPLE_STAGES.indexOf(stage);
  return <div className="stages">{SIMPLE_STAGES.map((s, i) => <span key={s} className={`stage-pill ${i < idx ? "done" : i === idx ? "current" : ""}`}>{s}</span>)}</div>;
}

function ProgressBar({ progress }) {
  return <div className="progress-wrap"><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><div className="progress-pct">{progress}% complete</div></div>;
}

function RequestForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ name: "", contact: "", eventName: "", deadline: "", description: "", wantMeeting: false, notes: "" });
  const typeObj = REQUEST_TYPES.find(t => t.id === sel);
  function set(f, v) { setForm(p => ({ ...p, [f]: v })); }
  function canSubmit() { return form.name && form.contact && form.eventName && form.deadline && form.description; }
  function handleSubmit() {
    const req = { id: genId(), type: sel, typeLabel: typeObj.label, dept: typeObj.dept, complex: typeObj.complex, submittedAt: new Date().toISOString(), ...form, progress: 0, stage: "Pending", notes_internal: "" };
    const all = loadRequests(); all.unshift(req); saveRequests(all); onSubmit(req);
  }
  if (step === 1) return (
    <div><style>{css}</style>
      <div className="hero-section">
        <div className="hero-eyebrow">Ministry of Culture</div>
        <h1 className="hero-title">Submit a <em>request</em></h1>
        <div className="hero-rule" />
        <p className="hero-sub">Select the type of support you need. Your request will be routed to the right team automatically.</p>
      </div>
      <div className="main">
        <div className="section-label">What do you need?</div>
        <div className="type-grid">
          {REQUEST_TYPES.map(t => {
            const ds = DEPT_STYLES[t.dept];
            const isSel = sel === t.id;
            return <button key={t.id} className={`type-card ${isSel ? "selected" : ""}`} style={isSel ? { borderColor: ds.accent, background: ds.bg, boxShadow: `0 0 0 1px ${ds.accent}` } : {}} onClick={() => setSel(t.id)}>
              <span className="type-icon">{t.icon}</span>
              <div className="type-label">{t.label}</div>
              <div className="type-desc">{t.description}</div>
              <span className="type-dept-tag" style={{ background: ds.bg, color: ds.accent }}>{t.dept}</span>
            </button>;
          })}
        </div>
        <div className="actions-row"><span /><button className="btn btn-primary" disabled={!sel} onClick={() => setStep(2)}>Continue →</button></div>
      </div>
    </div>
  );
  return (
    <div><style>{css}</style>
      <div className="hero-section">
        <div className="hero-eyebrow">{typeObj.icon} {typeObj.label}</div>
        <h1 className="hero-title">Tell us what <em>you need</em></h1>
        <div className="hero-rule" />
        <p className="hero-sub">The more detail you give us, the better we can serve you.</p>
      </div>
      <div className="main">
        <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)} style={{ marginBottom: 24 }}>← Back</button>
        <div className="form-card">
          <div className="form-card-title">Your details</div>
          <div className="form-row">
            <div><label className="form-label">Full name</label><input className="form-input" placeholder="Your name" value={form.name} onChange={e => set("name", e.target.value)} /></div>
            <div><label className="form-label">Telegram / phone</label><input className="form-input" placeholder="@username or number" value={form.contact} onChange={e => set("contact", e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div><label className="form-label">Event / project name</label><input className="form-input" placeholder="e.g. Sunday Service, Tribe Night" value={form.eventName} onChange={e => set("eventName", e.target.value)} /></div>
            <div><label className="form-label">Deadline</label><input className="form-input" type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} /></div>
          </div>
        </div>
        <div className="form-card">
          <div className="form-card-title">Request details</div>
          <div className="form-group">
            <label className="form-label">Describe your request</label>
            <textarea className="form-textarea" placeholder={
              typeObj.id === "sound" ? "What equipment or sound support do you need? Include event details, setup time, venue…" :
              typeObj.id === "photography" ? "What needs to be captured? Event type, location, duration, style preferences…" :
              typeObj.id === "video" ? "What is this video for? Concept, desired length, tone, where it will be shown…" :
              typeObj.id === "graphic_design" ? "What needs to be designed? Platform, format, dimensions, content to include…" :
              typeObj.id === "art_production" ? "Describe the décor or production setup. Venue, theme, scale, specific elements…" :
              "Describe your request in as much detail as possible."
            } value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          {typeObj.complex && <div className="form-group"><label className="form-label">Reference files or links <span style={{ color: "#333", fontWeight: 400 }}>(optional)</span></label><input className="form-input" placeholder="Google Drive link, mood board, reference URL…" value={form.notes} onChange={e => set("notes", e.target.value)} /><p className="form-hint">You can also send files directly on Telegram after submitting.</p></div>}
          {typeObj.complex && <><div className="divider" /><div className="toggle-row"><div><div className="toggle-label">Request a meeting first</div><div className="toggle-sub">Flag that you'd like to align on details before work begins</div></div><button className={`toggle ${form.wantMeeting ? "on" : ""}`} onClick={() => set("wantMeeting", !form.wantMeeting)} /></div></>}
        </div>
        <div className="actions-row"><span /><button className="btn btn-primary" disabled={!canSubmit()} onClick={handleSubmit}>Submit request →</button></div>
      </div>
    </div>
  );
}

function Success({ req, onNew, onTrack }) {
  return <div><style>{css}</style><div className="main"><div className="success-wrap">
    <span className="success-icon">✦</span>
    <h2 className="success-title">Request received</h2>
    <div className="success-ref">{req.id}</div>
    <p className="success-sub">Your request has been sent to the <strong style={{ color: "#F2EFE9" }}>{req.dept}</strong> team.<br />Save your reference number — you'll need it to track progress.</p>
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      <button className="btn btn-primary" onClick={onTrack}>Track this request</button>
      <button className="btn btn-ghost" onClick={onNew}>Submit another</button>
    </div>
  </div></div></div>;
}

function Tracker() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  function search() { setResult(loadRequests().find(r => r.id.toLowerCase() === ref.trim().toLowerCase()) || null); setSearched(true); }
  return <div><style>{css}</style>
    <div className="hero-section">
      <div className="hero-eyebrow">Ministry of Culture</div>
      <h1 className="hero-title">Track your <em>request</em></h1>
      <div className="hero-rule" />
      <p className="hero-sub">Enter your reference number to see the latest update from the team.</p>
    </div>
    <div className="main">
      <div className="tracker-search"><input className="form-input" placeholder="e.g. REQ-ABC123" value={ref} onChange={e => setRef(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} style={{ flex: 1 }} /><button className="btn btn-primary" onClick={search}>Search</button></div>
      {searched && !result && <div className="empty-state"><div className="empty-icon">◎</div><div className="empty-text">No request found with that reference number.</div></div>}
      {result && <div className="req-result-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div><div className="req-ref-tag">{result.id}</div><div className="req-title-text">{result.typeLabel} — {result.eventName}</div><div className="req-meta-text">Submitted {new Date(result.submittedAt).toLocaleDateString()} · Deadline {new Date(result.deadline).toLocaleDateString()}</div></div>
          <DeptPill dept={result.dept} />
        </div>
        {result.complex ? <ProgressBar progress={result.progress || 0} /> : <StageTracker stage={result.stage || "Pending"} />}
        {result.notes_internal && <div className="team-note"><strong>From the team:</strong> {result.notes_internal}</div>}
      </div>}
    </div>
  </div>;
}

function Dashboard() {
  const [requests, setRequests] = useState(loadRequests());
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const depts = ["All", ...Object.keys(DEPARTMENTS)];
  const filtered = filter === "All" ? requests : requests.filter(r => r.dept === filter);
  const sorted = [...filtered].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  function updateReq(id, changes) { const updated = requests.map(r => r.id === id ? { ...r, ...changes } : r); setRequests(updated); saveRequests(updated); setSelected(s => s?.id === id ? { ...s, ...changes } : s); }
  return <div><style>{css}</style>
    <div className="hero-section">
      <div className="hero-eyebrow">Ministry of Culture · Internal</div>
      <h1 className="hero-title">Requests <em>dashboard</em></h1>
      <div className="hero-rule" />
      <p className="hero-sub">All incoming requests, sorted by deadline.</p>
    </div>
    <div className="main wide">
      <div className="stats-row">
        {Object.keys(DEPARTMENTS).map(d => {
          const ds = DEPT_STYLES[d]; const count = requests.filter(r => r.dept === d).length;
          return <div className="stat-card" key={d} style={{ borderColor: count > 0 ? ds.border : "#1A1A1A" }}><div className="stat-num" style={{ color: count > 0 ? ds.accent : "#333" }}>{count}</div><div className="stat-label">{d}</div></div>;
        })}
      </div>
      <div className="filter-row">{depts.map(d => <button key={d} className={`filter-chip ${filter === d ? "active" : ""}`} onClick={() => setFilter(d)}>{d}{d !== "All" && <span style={{ opacity: 0.5 }}> ({requests.filter(r => r.dept === d).length})</span>}</button>)}</div>
      {sorted.length === 0 && <div className="empty-state"><div className="empty-icon">◎</div><div className="empty-text">No requests in this category yet.</div></div>}
      {sorted.map(req => <div key={req.id} className="req-row" onClick={() => setSelected(req)}>
        <div className="req-row-header">
          <div className="req-row-left">
            <div className="req-row-id">{req.id}</div>
            <div className="req-row-title">{req.typeLabel} — {req.eventName}</div>
            <div className="req-row-meta">{req.name} · {req.contact} · Deadline {new Date(req.deadline).toLocaleDateString()}{req.wantMeeting && <span className="meeting-tag">Meeting requested</span>}</div>
          </div>
          <DeptPill dept={req.dept} />
        </div>
        {req.complex ? <ProgressBar progress={req.progress || 0} /> : <StageTracker stage={req.stage || "Pending"} />}
      </div>)}
      {selected && <div className="modal-overlay" onClick={() => setSelected(null)}><div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top">
          <div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#333", textTransform: "uppercase", marginBottom: 6 }}>{selected.id}</div><div className="modal-title">{selected.typeLabel}</div></div>
          <DeptPill dept={selected.dept} />
        </div>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-key">Submitted by</span><span className="detail-val">{selected.name}</span></div>
          <div className="detail-item"><span className="detail-key">Contact</span><span className="detail-val">{selected.contact}</span></div>
          <div className="detail-item"><span className="detail-key">Event</span><span className="detail-val">{selected.eventName}</span></div>
          <div className="detail-item"><span className="detail-key">Deadline</span><span className="detail-val">{new Date(selected.deadline).toLocaleDateString()}</span></div>
          <div className="detail-item"><span className="detail-key">Description</span><span className="detail-val">{selected.description}</span></div>
          {selected.notes && <div className="detail-item"><span className="detail-key">References</span><span className="detail-val">{selected.notes}</span></div>}
          {selected.wantMeeting && <div className="detail-item"><span className="detail-key">Meeting</span><span className="detail-val" style={{ color: "#FB923C" }}>Requester wants to meet first</span></div>}
        </div>
        <div className="divider" />
        <div className="update-label">Update status</div>
        {selected.complex
          ? <div><label className="form-label">Progress — {selected.progress || 0}%</label><input type="range" min={0} max={100} step={5} className="progress-slider" value={selected.progress || 0} onChange={e => updateReq(selected.id, { progress: Number(e.target.value) })} /></div>
          : <select className="stage-select" value={selected.stage || "Pending"} onChange={e => updateReq(selected.id, { stage: e.target.value })}>{SIMPLE_STAGES.map(s => <option key={s}>{s}</option>)}</select>}
        <label className="form-label" style={{ marginTop: 16 }}>Note to requester <span style={{ color: "#333", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
        <textarea className="note-textarea" placeholder="Add a message visible to the requester when they track their request…" value={selected.notes_internal || ""} onChange={e => updateReq(selected.id, { notes_internal: e.target.value })} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}><button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button></div>
      </div></div>}
    </div>
  </div>;
}

export default function App() {
  const [tab, setTab] = useState("submit");
  const [submitted, setSubmitted] = useState(null);
  return <div><style>{css}</style>
    <nav className="nav">
      <div className="nav-brand">MOC <span>·</span> Requests System</div>
      <div className="nav-tabs">
        <button className={`nav-tab ${tab === "submit" ? "active" : ""}`} onClick={() => { setTab("submit"); setSubmitted(null); }}>Submit</button>
        <button className={`nav-tab ${tab === "track" ? "active" : ""}`} onClick={() => setTab("track")}>Track</button>
        <button className={`nav-tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>Dashboard</button>
      </div>
    </nav>
    {tab === "submit" && !submitted && <RequestForm onSubmit={req => setSubmitted(req)} />}
    {tab === "submit" && submitted && <Success req={submitted} onNew={() => setSubmitted(null)} onTrack={() => { setTab("track"); setSubmitted(null); }} />}
    {tab === "track" && <Tracker />}
    {tab === "dashboard" && <Dashboard />}
  </div>;
}
