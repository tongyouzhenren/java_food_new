export interface PermissionState {
  activeRoles: string[];
  explicitPermissions: string[];
  rolePolicies: Record<string, string[]>;
}

export interface PermissionCheckPayload {
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
}
