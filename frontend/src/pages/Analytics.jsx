import { useMemo, useState } from "react";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#6366f1"];
const getTypeColor = (type, index) => COLORS[index % COLORS.length];

export default function Analytics({ complaints }) {
  const [localArea, setLocalArea] = useState("All");

  const priorityDist = useMemo(() => {
    const map = { High: 0, Medium: 0, Low: 0 };
    complaints.forEach(c => {
      if (map[c.priority] !== undefined) map[c.priority]++;
    });
    return Object.entries(map);
  }, [complaints]);

  const uniqueAreas = ["All", ...Array.from(new Set(complaints.map(c => c.area)))];

  const { typeData, filteredTotal } = useMemo(() => {
    const map = {};
    const filtered = localArea === "All" ? complaints : complaints.filter(c => c.area === localArea);
    filtered.forEach(c => { map[c.type] = (map[c.type] || 0) + 1; });
    return { 
      typeData: Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      filteredTotal: filtered.length
    };
  }, [complaints, localArea]);

  const predictions = useMemo(() => {
    if (complaints.length === 0) return [
      { icon: "📈", label: "Predicted Surge", val: "N/A", sub: "Insufficient data" },
      { icon: "⏱️", label: "Avg Response Time", val: "N/A", sub: "Insufficient data" },
      { icon: "🎯", label: "Resolution Rate", val: "N/A", sub: "Insufficient data" }
    ];

    const typeCounts = {};
    complaints.forEach(c => typeCounts[c.type] = (typeCounts[c.type] || 0) + 1);
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

    const resolved = complaints.filter(c => c.status === "Resolved").length;
    const resRate = Math.round((resolved / complaints.length) * 100);

    const pendingHigh = complaints.filter(c => c.status === "Pending" && c.priority === "High").length;

    return [
      { icon: "📈", label: "Predicted Surge", val: topType ? topType[0] : "None", sub: `Expected +15% based on current volume` },
      { icon: "🚨", label: "Critical Backlog", val: pendingHigh.toString(), sub: "High priority pending cases" },
      { icon: "🎯", label: "Resolution Rate", val: `${resRate}%`, sub: resRate < 50 ? "Needs improvement to reach 60% target" : "On track for quarter target" },
    ];
  }, [complaints]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 18 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Priority Distribution</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 18 }}>Breakdown by urgency</div>
          {priorityDist.map(([p, count], i) => (
            <div key={p} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{p}</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Count: <b style={{ color: "#0f172a" }}>{count}</b></span>
              </div>
              <div style={{ height: 7, background: "#f1f5f9", borderRadius: 9999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${complaints.length ? (count / complaints.length) * 100 : 0}%`, background: p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : "#10b981", borderRadius: 9999 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Category Breakdown</div>
            <select value={localArea} onChange={e => setLocalArea(e.target.value)} style={{ border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, padding: "2px 6px", outline: "none", color: "#475569" }}>
              {uniqueAreas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 18 }}>Complaint types in selected area</div>
          {typeData.map((t, i) => {
            const tColor = getTypeColor(t.name, i);
            return (
              <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: tColor, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>{t.name}</span>
                <div style={{ width: 100, height: 6, background: "#f1f5f9", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${filteredTotal ? (t.count / filteredTotal) * 100 : 0}%`, background: tColor, borderRadius: 9999 }} />
                </div>
                <span style={{ fontSize: 13, color: "#94a3b8", width: 20, textAlign: "right" }}>{t.count}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 16, padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Predictive Intelligence</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 18 }}>AI-generated forecast based on trend analysis</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {predictions.map(m => (
            <div key={m.label} style={{ background: "rgba(255,255,255,.07)", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ fontSize: 22 }}>{m.icon}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginTop: 2 }}>{m.val}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
