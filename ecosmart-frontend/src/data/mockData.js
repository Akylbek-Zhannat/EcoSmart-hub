// ── Mock data for EcoSmart Hub demo ──────────────────────────────────────────

export const mockUser = {
  id: 1,
  name: "Zhannat Akylbek",
  email: "z.akylbek@ecosmart.kz",
  role: "Home Owner",
  avatar: "ZA",
  budget: 25000,
  tariff: 22.5,
  currency: "₸",
  apartment: "Almaty, Alatau District, Apt 47",
  notifications: { email: true, push: true, weekly: true, monthly: true },
};

export const dashboardStats = {
  currentKwh: 312.4,
  monthlyCost: 7029,
  predictedSaving: 3240,
  activeDevices: 8,
  budgetUsed: 7029,
  budgetTotal: 25000,
  co2Saved: 142,
  efficiency: 78,
};

export const dailyEnergy = [
  { hour: "00", kwh: 0.8, prev: 1.1 },
  { hour: "02", kwh: 0.5, prev: 0.7 },
  { hour: "04", kwh: 0.6, prev: 0.8 },
  { hour: "06", kwh: 1.4, prev: 1.6 },
  { hour: "08", kwh: 3.2, prev: 3.8 },
  { hour: "10", kwh: 2.8, prev: 3.1 },
  { hour: "12", kwh: 4.1, prev: 4.6 },
  { hour: "14", kwh: 3.9, prev: 4.2 },
  { hour: "16", kwh: 3.3, prev: 3.9 },
  { hour: "18", kwh: 5.2, prev: 5.8 },
  { hour: "20", kwh: 6.1, prev: 6.4 },
  { hour: "22", kwh: 2.4, prev: 2.9 },
];

export const weeklyEnergy = [
  { day: "Mon", kwh: 18.4, cost: 414 },
  { day: "Tue", kwh: 21.2, cost: 477 },
  { day: "Wed", kwh: 17.8, cost: 401 },
  { day: "Thu", kwh: 23.6, cost: 531 },
  { day: "Fri", kwh: 25.1, cost: 565 },
  { day: "Sat", kwh: 29.4, cost: 662 },
  { day: "Sun", kwh: 26.8, cost: 603 },
];

export const monthlyEnergy = [
  { month: "Oct", kwh: 380, cost: 8550 },
  { month: "Nov", kwh: 412, cost: 9270 },
  { month: "Dec", kwh: 495, cost: 11138 },
  { month: "Jan", kwh: 520, cost: 11700 },
  { month: "Feb", kwh: 441, cost: 9923 },
  { month: "Mar", kwh: 398, cost: 8955 },
  { month: "Apr", kwh: 345, cost: 7763 },
  { month: "May", kwh: 312, cost: 7020, partial: true },
];

export const deviceConsumption = [
  { name: "Air Conditioner", kwh: 98.4, pct: 31.5 },
  { name: "Heater",          kwh: 74.2, pct: 23.8 },
  { name: "Washing Machine", kwh: 42.1, pct: 13.5 },
  { name: "Refrigerator",    kwh: 38.8, pct: 12.4 },
  { name: "Lighting",        kwh: 28.6, pct: 9.2 },
  { name: "Smart Plugs",     kwh: 19.4, pct: 6.2 },
  { name: "Other",           kwh: 10.9, pct: 3.5 },
];

export const peakHours = [
  { hour: "06–08",  level: "medium" },
  { hour: "08–10",  level: "low"    },
  { hour: "10–12",  level: "low"    },
  { hour: "12–14",  level: "medium" },
  { hour: "14–16",  level: "low"    },
  { hour: "16–18",  level: "medium" },
  { hour: "18–22",  level: "high"   },
  { hour: "22–00",  level: "medium" },
];

export const devicesData = [
  {
    id: 1, name: "Air Conditioner", room: "Living Room", emoji: "❄️",
    color: "#60a5fa", bgColor: "rgba(96,165,250,0.12)",
    status: true, power: 1850, monthlyKwh: 98.4, monthlyCost: 2214,
  },
  {
    id: 2, name: "Smart Heater", room: "Bedroom", emoji: "🔥",
    color: "#f87171", bgColor: "rgba(248,113,113,0.12)",
    status: true, power: 1200, monthlyKwh: 74.2, monthlyCost: 1670,
  },
  {
    id: 3, name: "Washing Machine", room: "Bathroom", emoji: "🫧",
    color: "#a78bfa", bgColor: "rgba(167,139,250,0.12)",
    status: false, power: 0, monthlyKwh: 42.1, monthlyCost: 947,
  },
  {
    id: 4, name: "Refrigerator", room: "Kitchen", emoji: "🧊",
    color: "#4ade80", bgColor: "rgba(74,222,128,0.12)",
    status: true, power: 140, monthlyKwh: 38.8, monthlyCost: 873,
  },
  {
    id: 5, name: "Smart Lighting", room: "All Rooms", emoji: "💡",
    color: "#fbbf24", bgColor: "rgba(251,191,36,0.12)",
    status: true, power: 85, monthlyKwh: 28.6, monthlyCost: 644,
  },
  {
    id: 6, name: "Electric Kettle", room: "Kitchen", emoji: "☕",
    color: "#fb923c", bgColor: "rgba(251,146,60,0.12)",
    status: false, power: 0, monthlyKwh: 8.4, monthlyCost: 189,
  },
  {
    id: 7, name: "TV + Media Box", room: "Living Room", emoji: "📺",
    color: "#38bdf8", bgColor: "rgba(56,189,248,0.12)",
    status: true, power: 180, monthlyKwh: 18.2, monthlyCost: 410,
  },
  {
    id: 8, name: "Smart Plug Hub", room: "Office", emoji: "🔌",
    color: "#34d399", bgColor: "rgba(52,211,153,0.12)",
    status: true, power: 240, monthlyKwh: 19.4, monthlyCost: 437,
  },
];

export const recommendationsData = [
  {
    id: 1, emoji: "⏰", priority: "high",
    title: "Shift washing machine to off-peak hours",
    desc: "Your washing machine runs between 18:00–21:00 — the most expensive tariff window. Moving cycles to 23:00–06:00 will cut that device's cost nearly in half.",
    saving: 1260, status: "pending",
  },
  {
    id: 2, emoji: "❄️", priority: "high",
    title: "Air conditioner inefficient during peak tariff",
    desc: "The AC ran for 6.4 hours during yesterday's peak period (18:00–22:00). Pre-cooling the apartment before 17:30 and reducing runtime by 2h could save significantly.",
    saving: 890, status: "pending",
  },
  {
    id: 3, emoji: "🔥", priority: "medium",
    title: "Heater active 28% longer than usual",
    desc: "Average heater usage this week was 5.8 h/day vs a personal baseline of 4.5 h/day. Check insulation or lower the thermostat by 1–2 °C for similar comfort.",
    saving: 420, status: "accepted",
  },
  {
    id: 4, emoji: "💡", priority: "low",
    title: "Lights left on in unoccupied rooms",
    desc: "Motion sensors detected no presence in the kitchen and office for >2h while lights remained on. Enabling auto-off rules would reduce standby waste.",
    saving: 180, status: "pending",
  },
  {
    id: 5, emoji: "🧊", priority: "low",
    title: "Refrigerator door opened 47 times yesterday",
    desc: "Above average frequency may indicate the door seal needs checking or contents should be reorganised. A well-organised fridge reduces compressor cycles.",
    saving: 95, status: "ignored",
  },
  {
    id: 6, emoji: "📊", priority: "medium",
    title: "Budget on track — projected ₸3 240 savings this month",
    desc: "Based on your current consumption trend, you are on course to spend ₸7 800 vs last month's ₸11 040. Maintaining current habits secures this saving.",
    saving: 3240, status: "pending",
  },
];

export const monthlyReport = {
  month: "May 2026",
  totalKwh: 312.4,
  totalCost: 7029,
  prevCost: 11040,
  saving: 4011,
  savingPct: 36.3,
  budgetUsed: 28.1,
  budgetTotal: 25000,
  avgDaily: 10.1,
  co2Kg: 142,
  topDevices: [
    { name: "Air Conditioner", kwh: 98.4, cost: 2214, pct: 31.5 },
    { name: "Smart Heater",    kwh: 74.2, cost: 1670, pct: 23.8 },
    { name: "Washing Machine", kwh: 42.1, cost:  947, pct: 13.5 },
  ],
  recommendations: [
    "Shift washing machine usage to off-peak hours to save ₸1 260",
    "Pre-cool apartment before peak tariff window saves ₸890",
    "Reduce heater runtime by 1.3 h/day saves ₸420",
  ],
};
