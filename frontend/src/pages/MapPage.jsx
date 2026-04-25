import { useState, useEffect } from "react";
import MapView from "../components/MapView";

export default function MapPage({ complaints }) {
  const [leafletLoaded, setLeafletLoaded] = useState(!!window.L);

  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  const high = complaints.filter(c => c.priority === "High").length;
  const med = complaints.filter(c => c.priority === "Medium").length;
  const low = complaints.filter(c => c.priority === "Low").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[["High Priority", high, "#ef4444"], ["Medium Priority", med, "#f59e0b"], ["Low Priority", low, "#22c55e"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: c, flexShrink: 0 }} />
            <div><div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{v}</div><div style={{ fontSize: 12, color: "#94a3b8" }}>{l}</div></div>
          </div>
        ))}
      </div>
      {leafletLoaded ? <MapView complaints={complaints} /> : (
        <div style={{ background: "#f8fafc", borderRadius: 16, height: 460, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", border: "1px solid #e2e8f0" }}>Loading map…</div>
      )}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "14px 18px", display: "flex", gap: 24 }}>
        {[["🔴 High Priority", "#ef4444"], ["🟡 Medium Priority", "#f59e0b"], ["🟢 Low Priority", "#22c55e"]].map(([l]) => (
          <span key={l} style={{ fontSize: 13, color: "#475569" }}>{l}</span>
        ))}
        <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: "auto" }}>Click markers for details</span>
      </div>
    </div>
  );
}
