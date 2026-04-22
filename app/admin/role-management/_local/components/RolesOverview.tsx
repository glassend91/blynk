"use client";

import RoleCard from "./RoleCard";
import type { Role } from "../types";

export default function RolesOverview({
  roles,
  onEdit,
  onRemove,
  onViewUsers,
}: {
  roles: Role[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onViewUsers: (id: string, name: string) => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {roles.map((r) => (
        <RoleCard
          key={r.id}
          role={r}
          onEdit={onEdit}
          onRemove={onRemove}
          onViewUsers={onViewUsers}
        />
      ))}
    </div>
  );
}
