import apiClient from "@/lib/apiClient";
import type { Role } from "@/app/admin/role-management/_local/types";

export type GetRolesResponse = {
  success: boolean;
  data: {
    roles: Role[];
  };
};

export type CreateRolePayload = Omit<Role, "id">;

export type CreateRoleResponse = {
  success: boolean;
  message?: string;
  data: Role;
};

export type DeleteRoleResponse = {
  success: boolean;
  message?: string;
};

export async function getRoles(): Promise<Role[]> {
  const { data } = await apiClient.get<GetRolesResponse>("/roles");
  return data.data.roles;
}

export async function createRole(payload: CreateRolePayload): Promise<Role> {
  const { data } = await apiClient.post<CreateRoleResponse>("/roles", payload);
  return data.data;
}

export async function deleteRole(id: string): Promise<void> {
  await apiClient.delete<DeleteRoleResponse>(`/roles/${id}`);
}

export type UpdateRolePayload = Partial<Omit<Role, "id">>;

export type UpdateRoleResponse = {
  success: boolean;
  message?: string;
  data: Role;
};

export async function updateRole(
  id: string,
  payload: UpdateRolePayload,
): Promise<Role> {
  const { data } = await apiClient.put<UpdateRoleResponse>(
    `/roles/${id}`,
    payload,
  );
  return data.data;
}
