export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Status =
  | "Open"
  | "In Progress"
  | "Pending Customer"
  | "Resolved"
  | "Closed"
  | "Cancelled";

export interface Ticket {
  id: string; // e.g. ST-2024-0156
  customer: string; // e.g. Alice Brown
  subject: string; // e.g. Internet connection issues
  priority: Priority;
  status: Status;
  assignee: string; // e.g. Sarah Wilson
  createdAgo: string; // e.g. 2 Hours Ago
}
