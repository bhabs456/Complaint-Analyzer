export default function Sidebar({ page, setPage, menuOpen, onNavigate, role }) {
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "O", roles: ['user', 'admin'] },
    { id: "map", label: "Map View", icon: "M", roles: ['admin'] },
    { id: "complaints", label: "Complaints", icon: "=", roles: ['user', 'admin'] },
    { id: "add", label: "Add Complaint", icon: "+", roles: ['user', 'admin'] },
    { id: "analytics", label: "Analytics", icon: "~", roles: ['admin'] },
  ];
  
  const filteredNav = NAV.filter(n => n.roles.includes(role || 'user'));

  return (
    <aside className={`app-sidebar ${menuOpen ? "is-open" : ""}`}>
      <div style={{ padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 700 }}>CL</div>
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>CivicLens</div>
            <div style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.5px" }}>INTELLIGENCE PLATFORM</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "8px 12px", flex: 1 }}>
        {filteredNav.map(n => (
          <button
            key={n.id}
            onClick={() => {
              setPage(n.id);
              onNavigate?.();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              marginBottom: 2,
              background: page === n.id ? "rgba(59,130,246,0.18)" : "transparent",
              color: page === n.id ? "#60a5fa" : "#94a3b8",
              fontWeight: page === n.id ? 600 : 400,
              fontSize: 14,
              textAlign: "left",
              transition: "all .15s",
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: "center", lineHeight: 1, fontWeight: 700 }}>{n.icon}</span>
            {n.label}
            {page === n.id && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#3b82f6" }} />}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{role === 'admin' ? 'AD' : 'US'}</div>
          <div>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>{role === 'admin' ? 'Administrator' : 'Citizen User'}</div>
            <div style={{ color: "#475569", fontSize: 11 }}>CivicLens Account</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
