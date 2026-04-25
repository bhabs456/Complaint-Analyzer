export const AREAS = ["All Areas", "New Delhi", "South Delhi", "East Delhi", "West Delhi"];

export const ALL_COMPLAINTS = [
  { id: "CMP-001", type: "Garbage", area: "New Delhi", status: "Pending", date: "2024-06-01", lat: 28.635, lng: 77.224, priority: "High", desc: "Overflowing bins near Connaught Place" },
  { id: "CMP-002", type: "Water", area: "South Delhi", status: "Resolved", date: "2024-06-02", lat: 28.527, lng: 77.218, priority: "Medium", desc: "Water pipeline leakage on Ring Road" },
  { id: "CMP-003", type: "Road", area: "East Delhi", status: "In Progress", date: "2024-06-03", lat: 28.648, lng: 77.298, priority: "High", desc: "Potholes near Laxmi Nagar metro" },
  { id: "CMP-004", type: "Electricity", area: "West Delhi", status: "Pending", date: "2024-06-03", lat: 28.654, lng: 77.101, priority: "Low", desc: "Street light outage near Rajouri Garden" },
  { id: "CMP-005", type: "Garbage", area: "New Delhi", status: "Pending", date: "2024-06-04", lat: 28.641, lng: 77.219, priority: "High", desc: "Garbage dumping at Paharganj" },
  { id: "CMP-006", type: "Water", area: "New Delhi", status: "In Progress", date: "2024-06-05", lat: 28.633, lng: 77.209, priority: "Medium", desc: "Low water pressure in Karol Bagh" },
  { id: "CMP-007", type: "Road", area: "South Delhi", status: "Pending", date: "2024-06-05", lat: 28.521, lng: 77.225, priority: "High", desc: "Broken footpath at Greater Kailash" },
  { id: "CMP-008", type: "Sanitation", area: "East Delhi", status: "Resolved", date: "2024-06-06", lat: 28.655, lng: 77.302, priority: "Low", desc: "Open drain near Preet Vihar" },
  { id: "CMP-009", type: "Noise", area: "West Delhi", status: "Pending", date: "2024-06-07", lat: 28.661, lng: 77.098, priority: "Medium", desc: "Illegal construction noise in Janakpuri" },
  { id: "CMP-010", type: "Garbage", area: "South Delhi", status: "Pending", date: "2024-06-07", lat: 28.513, lng: 77.231, priority: "High", desc: "Uncollected waste in Saket market" },
  { id: "CMP-011", type: "Water", area: "East Delhi", status: "Pending", date: "2024-06-08", lat: 28.642, lng: 77.295, priority: "High", desc: "Contaminated water supply in Mayur Vihar" },
  { id: "CMP-012", type: "Road", area: "New Delhi", status: "Resolved", date: "2024-06-08", lat: 28.629, lng: 77.232, priority: "Low", desc: "Pothole filled on Lodhi Road" },
  { id: "CMP-013", type: "Electricity", area: "South Delhi", status: "In Progress", date: "2024-06-09", lat: 28.519, lng: 77.209, priority: "Medium", desc: "Power fluctuation in Malviya Nagar" },
  { id: "CMP-014", type: "Sanitation", area: "West Delhi", status: "Pending", date: "2024-06-09", lat: 28.658, lng: 77.108, priority: "High", desc: "Overflowing sewer in Subhash Nagar" },
  { id: "CMP-015", type: "Garbage", area: "East Delhi", status: "In Progress", date: "2024-06-10", lat: 28.651, lng: 77.308, priority: "Medium", desc: "Waste piling near Anand Vihar bus terminal" },
];

export const TREND_DATA = {
  "All Areas":    [{ w: "Wk 1", v: 18 }, { w: "Wk 2", v: 24 }, { w: "Wk 3", v: 20 }, { w: "Wk 4", v: 31 }, { w: "Wk 5", v: 28 }, { w: "Wk 6", v: 35 }],
  "New Delhi":    [{ w: "Wk 1", v: 6 },  { w: "Wk 2", v: 9 },  { w: "Wk 3", v: 7 },  { w: "Wk 4", v: 11 }, { w: "Wk 5", v: 9 },  { w: "Wk 6", v: 13 }],
  "South Delhi":  [{ w: "Wk 1", v: 4 },  { w: "Wk 2", v: 5 },  { w: "Wk 3", v: 6 },  { w: "Wk 4", v: 8 },  { w: "Wk 5", v: 7 },  { w: "Wk 6", v: 9 }],
  "East Delhi":   [{ w: "Wk 1", v: 5 },  { w: "Wk 2", v: 6 },  { w: "Wk 3", v: 4 },  { w: "Wk 4", v: 7 },  { w: "Wk 5", v: 8 },  { w: "Wk 6", v: 7 }],
  "West Delhi":   [{ w: "Wk 1", v: 3 },  { w: "Wk 2", v: 4 },  { w: "Wk 3", v: 3 },  { w: "Wk 4", v: 5 },  { w: "Wk 5", v: 4 },  { w: "Wk 6", v: 6 }],
};

export const INSIGHTS = {
  "All Areas": [
    { icon: "🔴", level: "critical", text: "New Delhi has the highest unresolved garbage complaints (3 open cases)" },
    { icon: "📈", level: "warning", text: "Water issues increased by 35% this week in South Delhi" },
    { icon: "⚡", level: "warning", text: "West Delhi requires immediate attention — sewer overflow reported" },
    { icon: "✅", level: "info", text: "East Delhi sanitation complaints resolved 20% faster this month" },
  ],
  "New Delhi": [
    { icon: "🔴", level: "critical", text: "3 high-priority garbage complaints remain unresolved in central zones" },
    { icon: "💧", level: "warning", text: "Water pressure complaints spiked in Karol Bagh this week" },
    { icon: "🛣️", level: "info", text: "Road maintenance completed — Lodhi Road pothole resolved" },
  ],
  "South Delhi": [
    { icon: "📈", level: "warning", text: "Water issue complaints up 35% compared to last week" },
    { icon: "🗑️", level: "critical", text: "Saket market waste collection pending for 3+ days" },
    { icon: "🔌", level: "info", text: "Electricity fluctuation in Malviya Nagar under investigation" },
  ],
  "East Delhi": [
    { icon: "💧", level: "critical", text: "Contaminated water supply reported in Mayur Vihar — urgent action needed" },
    { icon: "🗑️", level: "warning", text: "Anand Vihar garbage backlog growing — collector unavailable" },
    { icon: "✅", level: "info", text: "Preet Vihar open drain resolved within 24 hours" },
  ],
  "West Delhi": [
    { icon: "🔴", level: "critical", text: "Subhash Nagar sewer overflow flagged as health hazard" },
    { icon: "🔊", level: "warning", text: "Illegal construction noise complaints unresolved in Janakpuri" },
    { icon: "💡", level: "info", text: "Street light outage in Rajouri Garden awaiting engineer dispatch" },
  ],
};

export const TYPE_COLORS = { Garbage: "#ef4444", Water: "#3b82f6", Road: "#f59e0b", Electricity: "#8b5cf6", Sanitation: "#10b981", Noise: "#6b7280" };
export const STATUS_COLORS = { Pending: "#ef4444", Resolved: "#10b981", "In Progress": "#f59e0b" };
export const LEVEL_STYLES = { critical: "bg-red-50 border-red-200 text-red-800", warning: "bg-amber-50 border-amber-200 text-amber-800", info: "bg-blue-50 border-blue-200 text-blue-800" };
