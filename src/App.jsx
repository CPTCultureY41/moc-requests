import { useState } from "react";

const DEPARTMENTS = { Admin: "Admin", "Visual Media": "Visual Media", Design: "Design", Sound: "Sound" };

const REQUEST_TYPES = [
  { id: "admin", label: "Admin Request", dept: "Admin", complex: false, description: "General admin or leadership-directed requests", icon: "⚙️" },
  { id: "photography", label: "Photography", dept: "Visual Media", complex: false, description: "Photographer needed for an event or session", icon: "📷" },
  { id: "video", label: "Video Production", dept: "Visual Media", complex: true, description: "Video creation, editing, or filming", icon: "🎬" },
  { id: "graphic_design", label: "Graphic Design", dept: "Design", complex: true, description: "Digital graphics, posters, social media content", icon: "🎨" },
  { id: "art_production", label: "Art Production / Décor", dept: "Design", complex: true, description: "Physical décor, set design, stage production", icon: "🖼️" },
  { id: "sound", label: "Sound & Equipment", dept: "Sound", complex: false, description: "Sound support, recording, or equipment loan", icon: "🎙️" },
];

const SIMPLE_STAGES = ["Pending", "Received", "In Progress", "Ready"];
const STORAGE_KEY = "moc_requests_v1";

function loadRequests() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function saveRequests(reqs) { localStorage.setItem(STORAGE_KEY, JSON.stringify(reqs)); }
function genId() { return "REQ-" + Date.now().toString(36).toUpperCase(); }

const C = { bg: "#F9F9F8", surface: "#FFFFFF", border: "#E8E8E4", borderLight: "#F0F0EC", text: "#1A1A1A", muted: "#6B6B6B", light: "#9B9B9B", accent: "#2D6A4F", accentLight: "#E8F2EE", accentSoft: "#D1E8DC", dept: { Admin: { bg: "#EEF2FF", color: "#3730A3", border: "#C7D2FE" }, "Visual Media": { bg: "#FFF7ED", color: "#9A3412", border: "#FED7AA" }, Design: { bg: "#FDF4FF", color: "#7E22CE", border: "#E9D5FF" }, Sound: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" } } };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:wght@300;400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#F9F9F8;color:#1A1A1A;min-height:100vh;-webkit-font-smoothing:antialiased}
.nav{background:#fff;border-bottom:1px solid #E8E8E4;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:60px;position:sticky;top:0;z-index:100}
.nav-brand{font-family:'Fraunces',serif;font-size:18px;font-weight:300;color:#1A1A1A}
.nav-brand span{color:#2D6A4F}
.nav-tabs{display:flex;gap:4px}
.nav-tab{padding:6px 14px;border-radius:6px;border:none;background:transparent;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;color:#6B6B6B;cursor:pointer;transition:all .15s}
.nav-tab:hover{background:#F0F0EC;color:#1A1A1A}
.nav-tab.active{background:#E8F2EE;color:#2D6A4F}
.main{max-width:720px;margin:0 auto;padding:40px 24px 80px}
.main.wide{max-width:1100px}
.hero{margin-bottom:40px}
.hero-label{font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#2D6A4F;margin-bottom:10px}
.hero-title{font-family:'Fraunces',serif;font-size:32px;font-weight:300;line-height:1.2;color:#1A1A1A;margin-bottom:8px}
.hero-sub{font-size:14px;color:#6B6B6B;line-height:1.6}
.card{background:#fff;border:1px solid #E8E8E4;border-radius:12px;padding:28px;margin-bottom:16px}
.type-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin-bottom:8px}
.type-card{border:1.5px solid #E8E8E4;border-radius:10px;padding:16px;cursor:pointer;transition:all .15s;background:#fff;text-align:left}
.type-card:hover,.type-card.selected{border-color:#2D6A4F;background:#E8F2EE}
.type-icon{font-size:22px;margin-bottom:8px}
.type-label{font-size:13px;font-weight:600;color:#1A1A1A;margin-bottom:3px}
.type-desc{font-size:11px;color:#6B6B6B;line-height:1.4}
.type-dept{display:inline-block;margin-top:8px;font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px}
.form-section{margin-bottom:24px}
.form-label{display:block;font-size:12px;font-weight:600;color:#6B6B6B;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px}
.form-input,.form-textarea{width:100%;padding:11px 14px;border:1.5px solid #E8E8E4;border-radius:8px;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;background:#fff;transition:border-color .15s;outline:none}
.form-input:focus,.form-textarea:focus{border-color:#2D6A4F}
.form-textarea{min-height:100px;resize:vertical;line-height:1.6}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:500px){.form-row{grid-template-columns:1fr}}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-top:1px solid #F0F0EC}
.toggle-title{font-size:14px;font-weight:500;color:#1A1A1A}
.toggle-sub{font-size:12px;color:#6B6B6B;margin-top:2px}
.toggle{width:40px;height:22px;background:#E8E8E4;border-radius:20px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;margin-left:16px}
.toggle.on{background:#2D6A4F}
.toggle::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;background:white;border-radius:50%;transition:transform .2s}
.toggle.on::after{transform:translateX(18px)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:11px 22px;border-radius:8px;border:none;font-family:'Inter',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}
.btn-primary{background:#2D6A4F;color:white}
.btn-primary:hover{background:#235a40}
.btn-primary:disabled{opacity:.5;cursor:not-allowed}
.btn-ghost{background:transparent;color:#6B6B6B;border:1.5px solid #E8E8E4}
.btn-ghost:hover{border-color:#2D6A4F;color:#2D6A4F}
.btn-sm{padding:7px 14px;font-size:12px}
.success-wrap{text-align:center;padding:60px 20px}
.success-icon{font-size:48px;margin-bottom:20px}
.success-title{font-family:'Fraunces',serif;font-size:26px;font-weight:300;margin-bottom:10px}
.success-ref{display:inline-block;background:#E8F2EE;color:#2D6A4F;font-size:13px;font-weight:600;padding:6px 16px;border-radius:20px;margin-bottom:16px;letter-spacing:.5px}
.success-sub{font-size:14px;color:#6B6B6B;margin-bottom:32px}
.tracker-search{margin-bottom:24px;display:flex;gap:10px}
.req-card{background:#fff;border:1px solid #E8E8E4;border-radius:12px;padding:20px 24px;margin-bottom:12px}
.req-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.req-ref{font-size:11px;font-weight:700;letter-spacing:1px;color:#9B9B9B}
.req-title{font-size:15px;font-weight:600;color:#1A1A1A;margin-top:2px}
.req-meta{font-size:12px;color:#6B6B6B;margin-top:4px}
.dept-badge{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:4px 10px;border-radius:20px;flex-shrink:0}
.progress-bar{height:6px;background:#F0F0EC;border-radius:10px;margin:12px 0 6px;overflow:hidden}
.progress-fill{height:100%;background:#2D6A4F;border-radius:10px;transition:width .4s}
.progress-label{font-size:12px;color:#6B6B6B}
.stages{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.stage-dot{font-size:11px;font-weight:500;padding:4px 10px;border-radius:20px;background:#F0F0EC;color:#9B9B9B}
.stage-dot.done{background:#D1E8DC;color:#2D6A4F}
.stage-dot.current{background:#2D6A4F;color:white}
.dash-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.filter-btn{padding:6px 14px;border-radius:20px;border:1.5px solid #E8E8E4;background:#fff;font-size:12px;font-weight:500;color:#6B6B6B;cursor:pointer;transition:all .15s}
.filter-btn:hover,.filter-btn.active{border-color:#2D6A4F;color:#2D6A4F;background:#E8F2EE}
.dash-req{background:#fff;border:1px solid #E8E8E4;border-radius:12px;padding:18px 22px;margin-bottom:10px;cursor:pointer;transition:border-color .15s}
.dash-req:hover{border-color:#2D6A4F}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px}
.modal{background:#fff;border-radius:16px;padding:32px;max-width:580px;width:100%;max-height:85vh;overflow-y:auto}
.modal-title{font-family:'Fraunces',serif;font-size:22px;font-weight:300;margin-bottom:20px}
.detail-row{display:flex;gap:12px;margin-bottom:12px;align-items:flex-start}
.detail-key{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#9B9B9B;min-width:110px;padding-top:2px}
.detail-val{font-size:14px;color:#1A1A1A;line-height:1.5}
.status-select{padding:7px 12px;border:1.5px solid #E8E8E4;border-radius:8px;font-size:13px;font-family:'Inter',sans-serif;color:#1A1A1A;background:#fff;cursor:pointer;margin-top:8px;width:100%}
.progress-input{width:100%;margin-top:12px;accent-color:#2D6A4F}
.empty{text-align:center;padding:60px 20px;color:#6B6B6B}
.empty-icon{font-size:36px;margin-bottom:12px}
.section-title{font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#9B9B9B;margin-bottom:16px}
.hint{font-size:12px;color:#6B6B6B;margin-top:6px}
.divider{border:none;border-top:1px solid #F0F0EC;margin:24px 0}
`;

function DeptBadge({ dept }) {
  const s = C.dept[dept] || { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
  return <span className="dept-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{dept}</span>;
}

function StageTracker({ stage }) {
  const idx = SIMPLE_STAGES.indexOf(stage);
  return <div className="stages">{SIMPLE_STAGES.map((s, i) => <span key={s} className={`stage-dot ${i < idx ? "done" : i === idx ? "current" : ""}`}>{s}</span>)}</div>;
}

function ProgressTracker({ progress }) {
  return <div><div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><div className="progress-label">{progress}% complete</div></div>;
}

function RequestForm({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState({ name: "", contact: "", eventName: "", deadline: "", description: "", wantMeeting: false, notes: "" });
  const typeObj = REQUEST_TYPES.find(t => t.id === selectedType);
  function set(f, v) { setForm(p => ({ ...p, [f]: v })); }
  function canSubmit() { return form.name && form.contact && form.eventName && form.deadline && form.description; }
  function handleSubmit() {
    const req = { id: genId(), type: selectedType, typeLabel: typeObj.label, dept: typeObj.dept, complex: typeObj.complex, submittedAt: new Date().toISOString(), ...form, progress: 0, stage: "Pending", notes_internal: "" };
    const all = loadRequests(); all.unshift(req); saveRequests(all); onSubmit(req);
  }
  if (step === 1) return (
    <div><style>{css}</style>
      <div className="hero"><div className="hero-label">Ministry of Culture</div><h1 className="hero-title">Submit a request</h1><p className="hero-sub">Select the type of support you need and we'll route it to the right team.</p></div>
      <div className="card"><p className="section-title">What do you need?</p>
        <div className="type-grid">{REQUEST_TYPES.map(t => {
          const ds = C.dept[t.dept];
          return <button key={t.id} className={`type-card ${selectedType === t.id ? "selected" : ""}`} onClick={() => setSelectedType(t.id)}>
            <div className="type-icon">{t.icon}</div><div className="type-label">{t.label}</div><div className="type-desc">{t.description}</div>
            <span className="type-dept" style={{ background: ds.bg, color: ds.color }}>{t.dept}</span>
          </button>;
        })}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><button className="btn btn-primary" disabled={!selectedType} onClick={() => setStep(2)}>Continue →</button></div>
    </div>
  );
  return (
    <div><style>{css}</style>
      <div className="hero">
        <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)} style={{ marginBottom: 16 }}>← Back</button>
        <div className="hero-label">{typeObj.icon} {typeObj.label}</div>
        <h1 className="hero-title">Tell us what you need</h1>
        <p className="hero-sub">Fill in the details so we can prepare properly.</p>
      </div>
      <div className="card">
        <div className="form-row form-section">
          <div><label className="form-label">Your name</label><input className="form-input" placeholder="Full name" value={form.name} onChange={e => set("name", e.target.value)} /></div>
          <div><label className="form-label">Contact (Telegram / phone)</label><input className="form-input" placeholder="@username or number" value={form.contact} onChange={e => set("contact", e.target.value)} /></div>
        </div>
        <div className="form-row form-section">
          <div><label className="form-label">Event / project name</label><input className="form-input" placeholder="e.g. Sunday Service, Tribe Night" value={form.eventName} onChange={e => set("eventName", e.target.value)} /></div>
          <div><label className="form-label">Deadline / date needed by</label><input className="form-input" type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} /></div>
        </div>
        <div className="form-section"><label className="form-label">Describe your request</label>
          <textarea className="form-textarea" placeholder={
            typeObj.id === "sound" ? "What equipment or sound support do you need? Include event details, setup time, etc." :
            typeObj.id === "photography" ? "What needs to be photographed? Location, event type, duration, style…" :
            typeObj.id === "video" ? "What is the video for? Concept, length, tone, where it will be shown…" :
            typeObj.id === "graphic_design" ? "What needs to be designed? Platform, dimensions, content to include…" :
            typeObj.id === "art_production" ? "Describe the décor or setup. Venue, theme, scale, specific elements…" :
            "Describe your request in as much detail as possible."
          } value={form.description} onChange={e => set("description", e.target.value)} />
        </div>
        {typeObj.complex && <div className="form-section"><label className="form-label">Reference files or links (optional)</label><input className="form-input" placeholder="Paste a Google Drive link, mood board, or reference URL" value={form.notes} onChange={e => set("notes", e.target.value)} /><p className="hint">You can also send files directly on Telegram after submitting.</p></div>}
        <hr className="divider" />
        {typeObj.complex && <div className="toggle-row"><div><div className="toggle-title">Request a meeting</div><div className="toggle-sub">Suggest a brief meeting to align on details before work begins</div></div><button className={`toggle ${form.wantMeeting ? "on" : ""}`} onClick={() => set("wantMeeting", !form.wantMeeting)} /></div>}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><button className="btn btn-primary" disabled={!canSubmit()} onClick={handleSubmit}>Submit request</button></div>
    </div>
  );
}

function Success({ req, onNew, onTrack }) {
  return <div><style>{css}</style><div className="success-wrap">
    <div className="success-icon">✅</div><h2 className="success-title">Request submitted</h2>
    <div className="success-ref">{req.id}</div>
    <p className="success-sub">Your request has been sent to the <strong>{req.dept}</strong> department.<br />Save your reference number to track progress.</p>
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      <button className="btn btn-primary" onClick={onTrack}>Track my request</button>
      <button className="btn btn-ghost" onClick={onNew}>Submit another</button>
    </div>
  </div></div>;
}

function Tracker() {
  const [refInput, setRefInput] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  function search() { setResult(loadRequests().find(r => r.id.toLowerCase() === refInput.trim().toLowerCase()) || null); setSearched(true); }
  return <div><style>{css}</style>
    <div className="hero"><div className="hero-label">Ministry of Culture</div><h1 className="hero-title">Track your request</h1><p className="hero-sub">Enter your reference number to see the latest status.</p></div>
    <div className="card">
      <div className="tracker-search"><input className="form-input" placeholder="e.g. REQ-ABC123" value={refInput} onChange={e => setRefInput(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} style={{ flex: 1 }} /><button className="btn btn-primary" onClick={search}>Search</button></div>
      {searched && !result && <div className="empty"><div className="empty-icon">🔍</div><p>No request found with that reference.</p></div>}
      {result && <div className="req-card">
        <div className="req-header"><div><div className="req-ref">{result.id}</div><div className="req-title">{result.typeLabel} — {result.eventName}</div><div className="req-meta">Submitted {new Date(result.submittedAt).toLocaleDateString()} · Deadline {new Date(result.deadline).toLocaleDateString()}</div></div><DeptBadge dept={result.dept} /></div>
        {result.complex ? <ProgressTracker progress={result.progress || 0} /> : <StageTracker stage={result.stage || "Pending"} />}
        {result.notes_internal && <div style={{ marginTop: 14, padding: "10px 14px", background: "#E8F2EE", borderRadius: 8, fontSize: 13, color: "#2D6A4F" }}><strong>Note from the team:</strong> {result.notes_internal}</div>}
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
    <div className="hero"><div className="hero-label">Ministry of Culture · Internal</div><h1 className="hero-title">Requests dashboard</h1><p className="hero-sub">{requests.length} total request{requests.length !== 1 ? "s" : ""} · sorted by deadline</p></div>
    <div className="dash-filters">{depts.map(d => <button key={d} className={`filter-btn ${filter === d ? "active" : ""}`} onClick={() => setFilter(d)}>{d}{d !== "All" && <span style={{ marginLeft: 4, opacity: .6 }}>({requests.filter(r => r.dept === d).length})</span>}</button>)}</div>
    {sorted.length === 0 && <div className="empty"><div className="empty-icon">📭</div><p>No requests yet in this category.</p></div>}
    {sorted.map(req => <div key={req.id} className="dash-req" onClick={() => setSelected(req)}>
      <div className="req-header"><div><div className="req-ref">{req.id}</div><div className="req-title">{req.typeLabel} — {req.eventName}</div><div className="req-meta">{req.name} · {req.contact} · Deadline {new Date(req.deadline).toLocaleDateString()}{req.wantMeeting && <span style={{ marginLeft: 8, background: "#FFF7ED", color: "#9A3412", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>Meeting requested</span>}</div></div><DeptBadge dept={req.dept} /></div>
      {req.complex ? <ProgressTracker progress={req.progress || 0} /> : <StageTracker stage={req.stage || "Pending"} />}
    </div>)}
    {selected && <div className="modal-overlay" onClick={() => setSelected(null)}><div className="modal" onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}><h2 className="modal-title">{selected.typeLabel}</h2><DeptBadge dept={selected.dept} /></div>
      <div className="detail-row"><span className="detail-key">Ref</span><span className="detail-val">{selected.id}</span></div>
      <div className="detail-row"><span className="detail-key">Submitted by</span><span className="detail-val">{selected.name}</span></div>
      <div className="detail-row"><span className="detail-key">Contact</span><span className="detail-val">{selected.contact}</span></div>
      <div className="detail-row"><span className="detail-key">Event</span><span className="detail-val">{selected.eventName}</span></div>
      <div className="detail-row"><span className="detail-key">Deadline</span><span className="detail-val">{new Date(selected.deadline).toLocaleDateString()}</span></div>
      <div className="detail-row"><span className="detail-key">Description</span><span className="detail-val">{selected.description}</span></div>
      {selected.notes && <div className="detail-row"><span className="detail-key">References</span><span className="detail-val">{selected.notes}</span></div>}
      {selected.wantMeeting && <div className="detail-row"><span className="detail-key">Meeting</span><span className="detail-val" style={{ color: "#9A3412" }}>Requester wants to meet first</span></div>}
      <hr className="divider" />
      <p className="section-title">Update status</p>
      {selected.complex
        ? <div><label className="form-label">Progress ({selected.progress || 0}%)</label><input type="range" min={0} max={100} step={5} className="progress-input" value={selected.progress || 0} onChange={e => updateReq(selected.id, { progress: Number(e.target.value) })} /></div>
        : <div><label className="form-label">Stage</label><select className="status-select" value={selected.stage || "Pending"} onChange={e => updateReq(selected.id, { stage: e.target.value })}>{SIMPLE_STAGES.map(s => <option key={s}>{s}</option>)}</select></div>}
      <div style={{ marginTop: 16 }}><label className="form-label">Note to requester (optional)</label><textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="Add a message visible to the requester on their tracker…" value={selected.notes_internal || ""} onChange={e => updateReq(selected.id, { notes_internal: e.target.value })} /></div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}><button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button></div>
    </div></div>}
  </div>;
}

export default function App() {
  const [tab, setTab] = useState("submit");
  const [submitted, setSubmitted] = useState(null);
  return <div><style>{css}</style>
    <nav className="nav">
      <div className="nav-brand">MOC <span>·</span> Requests</div>
      <div className="nav-tabs">
        <button className={`nav-tab ${tab === "submit" ? "active" : ""}`} onClick={() => { setTab("submit"); setSubmitted(null); }}>Submit</button>
        <button className={`nav-tab ${tab === "track" ? "active" : ""}`} onClick={() => setTab("track")}>Track</button>
        <button className={`nav-tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>Dashboard</button>
      </div>
    </nav>
    <div className={`main ${tab === "dashboard" ? "wide" : ""}`}>
      {tab === "submit" && !submitted && <RequestForm onSubmit={req => setSubmitted(req)} />}
      {tab === "submit" && submitted && <Success req={submitted} onNew={() => setSubmitted(null)} onTrack={() => { setTab("track"); setSubmitted(null); }} />}
      {tab === "track" && <Tracker />}
      {tab === "dashboard" && <Dashboard />}
    </div>
  </div>;
}
