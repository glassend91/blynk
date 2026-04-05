import type { PermissionGroup, Role } from "./types";

// Permission catalogue grouped as in the PNGs
export const permissionGroups: PermissionGroup[] = [
  {
    key: "user",
    title: "User Management Permissions",
    items: [
      { key: "user.view", title: "View Users" },
      { key: "user.invite", title: "Invite New Users" },
      { key: "user.edit", title: "Edit User Roles & Details" },
      { key: "user.delete", title: "Delete Users" },
      { key: "roles.create", title: "Create & Edit Roles" },
    ],
  },
  {
    key: "content",
    title: "Content & Product Management Permissions",
    items: [
      { key: "plans.view", title: "View Service Plans" },
      { key: "plans.create", title: "Create & Edit Service Plans" },
      { key: "plans.delete", title: "Delete Service Plans" },
      { key: "plans.publish", title: "Publish / Unpublish Service Plans" },
      { key: "tech.manage", title: "Manage Technician Network" },
    ],
  },
  {
    key: "marketing",
    title: "Marketing & Website Content Permissions",
    items: [
      { key: "web.edit", title: "Edit Website Content" },
      { key: "seo.manage", title: "Manage SEO Settings" },
      { key: "analytics.view", title: "View Analytics Dashboard" },
      { key: "testimonials.manage", title: "Manage Customer Testimonials" },
    ],
  },
  {
    key: "support",
    title: "Customer & Support Management Permissions",
    items: [
      { key: "profiles.view", title: "View Customer Profiles & Services" },
      { key: "notes.manage", title: "View & Add Customer Notes" },
      { key: "tickets.manage", title: "Manage Support Tickets (Zendesk)" },
      { key: "services.manage", title: "Manage Customer Services (Add/Remove Plans)" },
      { key: "sim.manage", title: "Manage Physical SIM Orders" },
      { key: "billing.credits_refunds", title: "Can Issue Credits and Refunds" },
    ],
  },
  {
    key: "system",
    title: "Technical & System Management Permissions",
    items: [
      { key: "sys.settings", title: "Access System Settings & Integrations" },
      { key: "sys.logs", title: "View System Logs" },
    ],
  },
];

// Seed roles to match “Admin / Content Manager / Support Agent / Technician Manager”
const allowAll = Object.fromEntries(
  permissionGroups.flatMap((g) => g.items.map((i) => [i.key, true]))
);

const allowSubset = (keys: string[]) =>
  Object.fromEntries(permissionGroups.flatMap((g) =>
    g.items.map((i) => [i.key, keys.includes(i.key)])
  ));

export const rolesSeed: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all system features and settings",
    usersCount: 2,
    badge: "Default",
    permissions: allowAll, // Admin gets all permissions including billing.credits_refunds
  },
  {
    id: "2",
    name: "Content Manager",
    description: "Manage website content, service plans, and SEO settings",
    usersCount: 7,
    badge: "Default",
    permissions: allowSubset([
      "plans.view", "plans.create", "plans.publish",
      "web.edit", "seo.manage", "analytics.view", "testimonials.manage"
    ]), // billing.credits_refunds disabled by default
  },
  {
    id: "3",
    name: "Support Agent",
    description: "Handle customer support tickets and manage customer interactions",
    usersCount: 2,
    badge: "Default",
    permissions: allowSubset([
      "profiles.view", "notes.manage", "tickets.manage", "services.manage"
    ]), // billing.credits_refunds disabled by default
  },
  {
    id: "4",
    name: "Technician Manager",
    description: "Manage technician network and store locations",
    usersCount: 5,
    badge: "Medium",
    permissions: allowSubset(["tech.manage", "plans.view", "sys.logs"]), // billing.credits_refunds disabled by default
  },
];
