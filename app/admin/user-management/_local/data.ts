export type Role = "Administrator" | "Support Manager" | "Content Editor" | "Technical Support";
export type Status = "Active" | "Inactive" | "Pending";

export type UserRow = {
  id: number;
  name: string;
  email: string;
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
    role: "Administrator",
    status: "Active",
    lastLogin: "2 Hours Ago",
    created: "2024-01-15",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@telco.com",
    role: "Support Manager",
    status: "Active",
    lastLogin: "1 Day Ago",
    created: "G/872/2000",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@telco.com",
    role: "Content Editor",
    status: "Inactive",
    lastLogin: "1 Week Ago",
    created: "G/1818/1999",
  },
  {
    id: 4,
    name: "Tom Wilson",
    email: "tom.wilson@telco.com",
    role: "Technical Support",
    status: "Pending",
    lastLogin: "Never",
    created: "G/2338/2002",
  },
];

export const allRoles: Array<Role | "All Roles"> = [
  "All Roles",
  "Administrator",
  "Support Manager",
  "Content Editor",
  "Technical Support",
];

export const allStatuses: Array<Status | "All Status"> = ["All Status", "Active", "Inactive", "Pending"];
