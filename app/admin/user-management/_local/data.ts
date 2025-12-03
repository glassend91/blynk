// Admin role label displayed in the UI – now dynamic from backend Roles
export type Role = string;
export type Status = "Active" | "Inactive" | "Pending";

export type UserRow = {
  id: number;
  userId?: string; // real DB id when loaded from API
  name: string;
  email: string;
  type?: string;
  role: Role;
  status: Status;
  lastLogin: string;
  created: string;
};

export const initialUsers: UserRow[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@telco.com",
    type: "NBN",
    role: "Administrator",
    status: "Active",
    lastLogin: "2 Hours Ago",
    created: "2024-01-15",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@telco.com",
    type: "MBL",
    role: "Support Manager",
    status: "Active",
    lastLogin: "1 Day Ago",
    created: "G/872/2000",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@telco.com",
    type: "MBB",
    role: "Content Editor",
    status: "Inactive",
    lastLogin: "1 Week Ago",
    created: "G/1818/1999",
  },
  {
    id: 4,
    name: "Tom Wilson",
    email: "tom.wilson@telco.com",
    type: "SME",
    role: "Technical Support",
    status: "Pending",
    lastLogin: "Never",
    created: "G/2338/2002",
  },
];

export const allRoles: Array<Role | "All Roles"> = ["All Roles"];

export const allStatuses: Array<Status | "All Status"> = ["All Status", "Active", "Inactive", "Pending"];
