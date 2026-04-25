import { useEffect, useRef } from "react";
import { STATUS_COLORS } from "../data/mockData";

export default function MapView({ complaints }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.L) return;
    const L = window.L;
    if (!instanceRef.current) {
      instanceRef.current = L.map(mapRef.current, { zoomControl: true }).setView([28.61, 77.21], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(instanceRef.current);
    }
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    complaints.forEach(c => {
      const color = c.priority === "High" ? "#ef4444" : c.priority === "Medium" ? "#f59e0b" : "#22c55e";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const marker = L.marker([c.lat, c.lng], { icon })
        .addTo(instanceRef.current)
        .bindPopup(`<div style="font-family:sans-serif;min-width:160px"><b style="color:#1e3a5f">${c.id}</b><br/><span style="color:#6b7280;font-size:12px">${c.type} · ${c.area}</span><br/><span style="background:${STATUS_COLORS[c.status]};color:#fff;padding:2px 7px;border-radius:9999px;font-size:11px;display:inline-block;margin-top:4px">${c.status}</span><br/><p style="margin:6px 0 0;font-size:12px;color:#374151">${c.desc}</p></div>`);
      markersRef.current.push(marker);
    });
  }, [complaints]);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 460 }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
