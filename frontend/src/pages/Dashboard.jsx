import { useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#6366f1"];

export default function Dashboard({ area, setArea, complaints, onStatusUpdate }) {
  const [timeframe, setTimeframe] = useState("month");
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending = total - resolved;
  const urgent = complaints.filter(c => c.priority === "High").length;

  const typeBreakdown = useMemo(() => {
    const map = {};
    complaints.forEach(c => { map[c.type] = (map[c.type] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  const aiInsightNode = useMemo(() => {
    if (total === 0) {
      return <>No active complaints in <b style={{ color: "#fff" }}>{area === "All Areas" ? "the system" : area}</b>. Operations are nominal.</>;
    }
    
    const topType = typeBreakdown.length ? [...typeBreakdown].sort((a, b) => b.value - a.value)[0].name : "issues";
    const resRate = Math.round((resolved / total) * 100);
    
    if (area !== "All Areas") {
      if (urgent >= 2) {
        return <>Critical alert for <b style={{ color: "#fff" }}>{area}</b>: <b style={{ color: "#ef4444" }}>{urgent} high-priority cases</b> pending. Immediate intervention recommended.</>;
      }
      if (resRate < 50 && pending >= 2) {
        return <>Resolution rate in <b style={{ color: "#fff" }}>{area}</b> is low (<b style={{ color: "#f59e0b" }}>{resRate}%</b>). Prioritize clearing the backlog of {pending} pending cases.</>;
      }
      return <>System detected high volume of <b style={{ color: "#fff" }}>{topType}</b> in <b style={{ color: "#fff" }}>{area}</b>. Consider allocating specialized maintenance teams to this sector.</>;
    } else {
      if (resRate < 40) {
        return <>System-wide resolution rate is critically low at <b style={{ color: "#f59e0b" }}>{resRate}%</b>. Widespread bottlenecks detected.</>;
      }
      return <>System detected high volume of <b style={{ color: "#fff" }}>{topType}</b> across all areas. Consider reallocating maintenance teams.</>;
    }
  }, [total, resolved, pending, urgent, typeBreakdown, area]);

  const dynamicTrendData = useMemo(() => {
    const map = new Map();
    const now = new Date();
    
    let filterMs = 0;
    if (timeframe === "week") filterMs = 7 * 24 * 60 * 60 * 1000;
    if (timeframe === "month") filterMs = 30 * 24 * 60 * 60 * 1000;
    if (timeframe === "year") filterMs = 365 * 24 * 60 * 60 * 1000;

    complaints.forEach(c => {
      if (!c.date) return;
      const d = new Date(c.date);
      if (now - d > filterMs) return;

      let key;
      if (timeframe === "year") {
        key = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      } else {
        key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      
      const sortKey = timeframe === "year" 
        ? new Date(d.getFullYear(), d.getMonth(), 1).getTime() 
        : new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      
      if (!map.has(key)) map.set(key, { key, sortKey, complaints: 0 });
      map.get(key).complaints += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
  }, [complaints, timeframe]);

  const recent = useMemo(() => {
    return [...complaints].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  }, [complaints]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard label="Total Complaints" value={total} icon="📋" accent="#3b82f6" sub={`${resolved} resolved so far`} />
        <StatCard label="Pending Cases" value={pending} icon="⏳" accent="#f59e0b" sub="Awaiting action" />
        <StatCard label="Resolution Rate" value={`${total ? Math.round((resolved / total) * 100) : 0}%`} icon="✅" accent="#10b981" sub="Average clearance" />
        <StatCard label="Urgent Alerts" value={urgent} icon="🚨" accent="#ef4444" sub="Immediate attention" />
      </div>

      {/* AI Insights Banner */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 24 }}>✨</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>AI Insights Engine Active</div>
          <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
            {aiInsightNode}
          </div>
        </div>
        <button 
          onClick={() => setArea("All Areas")} 
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
        >
          {area === "All Areas" ? "Viewing All Areas" : `Reset to All Areas`}
        </button>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 18 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Category Breakdown</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={typeBreakdown} cx="50%" cy="45%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                {typeBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip wrapperStyle={{ fontSize: 12 }} />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12, paddingTop: 20, lineHeight: "24px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Filing Trend</div>
            <select 
              value={timeframe} 
              onChange={e => setTimeframe(e.target.value)} 
              style={{ border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, padding: "2px 6px", outline: "none", color: "#475569" }}
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dynamicTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="key" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} dx={-10} />
              <Tooltip wrapperStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Complaints */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 22, overflowX: "auto" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Recent Complaints</div>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "12px 0", color: "#64748b", fontSize: 12, fontWeight: 600 }}>ID</th>
              <th style={{ padding: "12px 0", color: "#64748b", fontSize: 12, fontWeight: 600 }}>Date</th>
              <th style={{ padding: "12px 0", color: "#64748b", fontSize: 12, fontWeight: 600 }}>Title</th>
              <th style={{ padding: "12px 0", color: "#64748b", fontSize: 12, fontWeight: 600 }}>Type</th>
              <th style={{ padding: "12px 0", color: "#64748b", fontSize: 12, fontWeight: 600 }}>Priority</th>
              <th style={{ padding: "12px 0", color: "#64748b", fontSize: 12, fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 0", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{c.id}</td>
                <td style={{ padding: "14px 0", fontSize: 13, color: "#475569" }}>{new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td style={{ padding: "14px 0", fontSize: 13, color: "#475569", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={`${c.title}\n\n${c.desc}`}>{c.title ? c.title : "No Title"}</td>
                <td style={{ padding: "14px 0" }}>
                  <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                    {c.type}
                  </span>
                </td>
                <td style={{ padding: "14px 0" }}>
                  <span style={{ 
                    background: c.priority === "High" ? "#fef2f2" : c.priority === "Medium" ? "#fffbeb" : "#ecfdf5", 
                    color: c.priority === "High" ? "#ef4444" : c.priority === "Medium" ? "#f59e0b" : "#10b981", 
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 
                  }}>
                    {c.priority}
                  </span>
                </td>
                <td style={{ padding: "14px 0", fontSize: 13, color: c.status === "Resolved" ? "#10b981" : "#f59e0b", fontWeight: 600 }}>
                  {c.status}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr><td colSpan="6" style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
