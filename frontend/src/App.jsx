import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import AddComplaint from "./pages/AddComplaint";
import Analytics from "./pages/Analytics";
import "./App.css";

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const mapPriority = (p) => {
  if (p === "urgent") return "High";
  if (p === "important") return "Medium";
  if (p === "low") return "Low";
  return capitalize(p) || "Low";
};

const PAGE_TITLES = {
  dashboard: "Overview Dashboard",
  map: "Map View",
  complaints: "Complaints Registry",
  add: "File a Complaint",
  analytics: "Analytics & Insights"
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [state, setState] = useState("Delhi");
  const [area, setArea] = useState("All Areas");
  const [complaints, setComplaints] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/complaints")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(c => ({
          id: `CMP-${c.id}`,
          type: c.category === "uncertain" ? "Garbage" : capitalize(c.category),
          state: c.state || "Delhi",
          area: c.area || "Delhi",
          status: capitalize(c.status) || "Pending",
          priority: mapPriority(c.priority),
          date: new Date(c.created_at).toISOString().split("T")[0],
          desc: c.description,
          title: c.title,
          lat: 28.63 + Math.random() * 0.05,
          lng: 77.21 + Math.random() * 0.05
        }));
        formatted.sort((a, b) => b.id.localeCompare(a.id));
        setComplaints(formatted);
      })
      .catch(err => console.error("Error fetching complaints:", err));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  const uniqueStates = useMemo(() => {
    const states = new Set(complaints.map(c => c.state).filter(Boolean));
    return Array.from(states);
  }, [complaints]);

  const uniqueAreas = useMemo(() => {
    const areas = new Set(
      complaints
        .filter(c => c.state === state)
        .map(c => c.area)
        .filter(Boolean)
    );
    return ["All Areas", ...Array.from(areas)];
  }, [complaints, state]);

  const filtered = useMemo(() => {
    let res = complaints.filter(c => c.state === state);
    if (area !== "All Areas") {
      res = res.filter(c => c.area === area);
    }
    return res;
  }, [state, area, complaints]);

  const onStatusUpdate = async (id, status) => {
    const numericId = parseInt(id.replace("CMP-", ""), 10);
    try {
      await fetch(`http://127.0.0.1:5000/complaints/${numericId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toLowerCase() })
      });
      setComplaints(cs => cs.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const onAdd = async (complaint) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: complaint.desc,
          area: complaint.area,
          status: complaint.status.toLowerCase()
        })
      });
      const data = await res.json();

      const newC = {
        id: `CMP-${data.id}`,
        type: data.category === "uncertain" ? "Garbage" : capitalize(data.category),
        area: complaint.area,
        status: capitalize(complaint.status),
        priority: mapPriority(data.priority),
        date: new Date().toISOString().split("T")[0],
        desc: data.description,
        title: data.title,
        lat: complaint.lat || 28.63 + Math.random() * 0.05,
        lng: complaint.lng || 77.21 + Math.random() * 0.05
      };
      setComplaints(cs => [newC, ...cs]);
    } catch (err) {
      console.error("Error adding complaint:", err);
    }
  };

  return (
    <div className="app-shell">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {menuOpen && <button className="app-sidebar-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
      <Sidebar
        page={page}
        setPage={setPage}
        menuOpen={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />

      <div className="app-main">
        <div className="app-topbar">
          <div className="app-topbar-inner">
            <button className="app-menu-button" onClick={() => setMenuOpen(open => !open)}>
              Menu
            </button>

            <div className="app-page-heading">
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{PAGE_TITLES[page]}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
            </div>

            <div className="app-controls">
              <div className="app-filter">
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>State</span>
                <select
                  value={state}
                  onChange={e => {
                    setState(e.target.value);
                    setArea("All Areas");
                  }}
                >
                  {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="app-filter">
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Area</span>
                <select value={area} onChange={e => setArea(e.target.value)}>
                  {uniqueAreas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Live</span>
            </div>
          </div>
        </div>

        <div className="app-content">
          {page === "dashboard" && <Dashboard area={area} setArea={setArea} complaints={filtered} onStatusUpdate={onStatusUpdate} />}
          {page === "map" && <MapPage complaints={filtered} />}
          {page === "complaints" && <ComplaintsPage complaints={filtered} onStatusUpdate={onStatusUpdate} />}
          {page === "add" && <AddComplaint onAdd={onAdd} />}
          {page === "analytics" && <Analytics complaints={filtered} />}
        </div>
      </div>
    </div>
  );
}
