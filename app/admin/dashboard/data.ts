export const KPI = [
  { title: "Total Users", value: 2847, delta: "+12% from last month", trend: "up" as const, icon: "user" },
  { title: "Active Services", value: 1234, delta: "+8% from last month", trend: "up" as const, icon: "box" },
  { title: "Pending Orders", value: 47,   delta: "-23% from last month", trend: "down" as const, icon: "card" },
  { title: "Open Tickets",  value: 23,   delta: "+5% from last month", trend: "up" as const, icon: "headset" },
];

export const ACTIVITY = [
  { title: "New user registration",   by: "Sarah Johnson", time: "2 minutes ago" },
  { title: "SIM card provisioned",    by: "Mike Chen",     time: "15 minutes ago" },
  { title: "Support ticket resolved", by: "Emma Davis",    time: "1 hour ago" },
  { title: "NBN service activated",   by: "Tom Wilson",    time: "2 hours ago" },
];

export const TASKS = [
  "Review pending SIM orders",
  "Verify new customer applications",
  "Update service plan pricing",
  "NBN service activated",
];

export const ACTIONS = [
  { label: "Add User", icon: "user" },
  { label: "New Service Plan", icon: "box" },
  { label: "Verify Customer", icon: "profile" },
  { label: "Process SIM Order", icon: "sim" },
];
