import { useState } from "react";
import { STATUS_COLORS } from "../data/mockData";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#6366f1"];
const getTypeColor = (type, index) => COLORS[index % COLORS.length];

export default function ComplaintsPage({ complaints, onStatusUpdate }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const types = ["All", ...Array.from(new Set(complaints.map(c => c.type)))];
  const statuses = ["All", "Pending", "In Progress", "Resolved"];

  const filtered = complaints.filter(c => {
    const matchesSearch = search === "" || 
      c.desc?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase()) ||
      c.area?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch &&
      (typeFilter === "All" || c.type === typeFilter) &&
      (statusFilter === "All" || c.status === statusFilter);
  });

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginRight: 8 }}>All Complaints</div>
        <input 
          type="text" 
          placeholder="Search ID, Area, or Desc..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#374151", background: "#f8fafc", outline: "none", minWidth: 200 }}
        />
        {[["Type", types, typeFilter, setTypeFilter], ["Status", statuses, statusFilter, setStatusFilter]].map(([label, opts, val, set]) => (
          <select key={label} value={val} onChange={e => set(e.target.value)}
            style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#374151", background: "#f8fafc", cursor: "pointer", outline: "none" }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#94a3b8" }}>{filtered.length} complaints</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["ID", "Type", "Area", "Description", "Priority", "Status", "Date", "Action"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#94a3b8", fontWeight: 600, fontSize: 12, letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((c, i) => {
            const typeIdx = types.indexOf(c.type) - 1;
            const tColor = getTypeColor(c.type, typeIdx >= 0 ? typeIdx : 0);
            return (
              <tr key={c.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.2s" }} title={c.desc}>
                <td style={{ padding: "11px 16px", color: "#3b82f6", fontWeight: 600, whiteSpace: "nowrap" }}>{c.id}</td>
                <td style={{ padding: "11px 16px", color: "#0f172a", whiteSpace: "nowrap" }}>
                  <span style={{ background: `${tColor}18`, color: tColor, padding: "2px 9px", borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>{c.type}</span>
                </td>
                <td style={{ padding: "11px 16px", color: "#475569", whiteSpace: "nowrap" }}>{c.area}</td>
                <td style={{ padding: "11px 16px", color: "#6b7280", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.desc}</td>
                <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ color: c.priority === "High" ? "#ef4444" : c.priority === "Medium" ? "#f59e0b" : "#10b981", fontWeight: 700, fontSize: 12 }}>{c.priority}</span>
                </td>
                <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ background: `${STATUS_COLORS[c.status] || '#94a3b8'}18`, color: STATUS_COLORS[c.status] || '#94a3b8', padding: "3px 10px", borderRadius: 9999, fontWeight: 600, fontSize: 12 }}>{c.status}</span>
                </td>
                <td style={{ padding: "11px 16px", color: "#94a3b8", whiteSpace: "nowrap" }}>{c.date}</td>
                <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                  <select value={c.status} onChange={e => onStatusUpdate(c.id, e.target.value)}
                    style={{ border: "1px solid #e2e8f0", borderRadius: 7, padding: "5px 8px", fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer", outline: "none" }}>
                    {["Pending", "In Progress", "Resolved"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
