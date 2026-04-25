import { useState } from "react";
import { AREAS, TYPE_COLORS } from "../data/mockData";

export default function AddComplaint({ onAdd }) {
  const [form, setForm] = useState({ type: "Garbage", area: "New Delhi", lat: "", lng: "", desc: "", status: "Pending", priority: "Medium" });
  const [submitted, setSubmitted] = useState(false);

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.desc) return;
    const id = `CMP-${String(Math.floor(Math.random() * 900) + 100)}`;
    onAdd({ ...form, id, date: new Date().toISOString().split("T")[0], lat: parseFloat(form.lat) || 28.63 + Math.random() * 0.05, lng: parseFloat(form.lng) || 77.21 + Math.random() * 0.05 });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ type: "Garbage", area: "New Delhi", lat: "", lng: "", desc: "", status: "Pending", priority: "Medium" });
  };

  const Field = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = { border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#0f172a", outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", padding: "22px 26px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>File a New Complaint</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Report a civic issue to the municipal authority</div>
      </div>
      <div style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
        {submitted && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", color: "#16a34a", fontSize: 14, fontWeight: 500 }}>
            ✅ Complaint submitted successfully
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Complaint Type">
            <select value={form.type} onChange={e => handle("type", e.target.value)} style={inputStyle}>
              {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Area / Location">
            <select value={form.area} onChange={e => handle("area", e.target.value)} style={inputStyle}>
              {AREAS.filter(a => a !== "All Areas").map(a => <option key={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Latitude (optional)">
            <input type="text" value={form.lat} onChange={e => handle("lat", e.target.value)} placeholder="e.g. 28.6358" style={inputStyle} />
          </Field>
          <Field label="Longitude (optional)">
            <input type="text" value={form.lng} onChange={e => handle("lng", e.target.value)} placeholder="e.g. 77.2245" style={inputStyle} />
          </Field>
          <Field label="Priority">
            <select value={form.priority} onChange={e => handle("priority", e.target.value)} style={inputStyle}>
              {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => handle("status", e.target.value)} style={inputStyle}>
              {["Pending", "In Progress", "Resolved"].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.desc} onChange={e => handle("desc", e.target.value)} rows={3} placeholder="Describe the issue in detail…"
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
        </Field>
        <button onClick={submit}
          style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "fit-content", letterSpacing: "0.2px" }}>
          Submit Complaint →
        </button>
      </div>
    </div>
  );
}
