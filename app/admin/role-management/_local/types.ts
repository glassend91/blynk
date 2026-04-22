export type PermissionKey = string;

export type PermissionItem = {
  key: PermissionKey;
  title: string;
  hint?: string;
  type?: "boolean" | "number";
};

export type PermissionGroup = {
  key: string;
  title: string;
  items: PermissionItem[];
};

export type Role = {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  badge?: "Default" | "Medium";
  permissions: Record<PermissionKey, boolean>;
  monthlyCreditLimit: number;
};
