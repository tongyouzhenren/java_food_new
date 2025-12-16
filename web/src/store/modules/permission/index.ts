import { defineStore } from 'pinia';
import { PermissionCheckPayload, PermissionState } from './types';

const DEFAULT_POLICIES: Record<string, string[]> = {
  admin: ['*'],
  user: ['profile:update', 'account:password:update', 'profile:2fa'],
  auditor: ['profile:read'],
};

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    activeRoles: [],
    explicitPermissions: [],
    rolePolicies: DEFAULT_POLICIES,
  }),
  getters: {
    rolePermissions(state): string[] {
      const permissions = new Set<string>();
      state.activeRoles.forEach((role) => {
        const byRole = state.rolePolicies[role];
        byRole?.forEach((item) => permissions.add(item));
      });
      return Array.from(permissions);
    },
    grantedPermissions(): string[] {
      const merged = new Set<string>([...this.explicitPermissions, ...this.rolePermissions]);
      return Array.from(merged);
    },
    hasRole: (state) => (role: string) => state.activeRoles.includes(role),
    hasAnyRole: (state) => (roles?: string[]) => !roles?.length || roles.some((role) => state.activeRoles.includes(role)),
    can(): (permission: string) => boolean {
      return (permission: string) => this.grantedPermissions.includes('*') || this.grantedPermissions.includes(permission);
    },
    canAny(): (permissions?: string[]) => boolean {
      return (permissions?: string[]) => {
        if (!permissions?.length) return true;
        return permissions.some((permission) => this.can(permission));
      };
    },
  },
  actions: {
    syncFromUser(payload?: { roles?: string[]; permissions?: string[] }) {
      this.activeRoles = payload?.roles || [];
      this.explicitPermissions = payload?.permissions || [];
    },
    updateRolePolicies(policies: Record<string, string[]>) {
      this.rolePolicies = policies;
    },
    canAccess(binding?: PermissionCheckPayload | string | string[]) {
      if (!binding) return true;
      if (typeof binding === 'string') {
        return this.can(binding);
      }
      if (Array.isArray(binding)) {
        return this.canAny(binding);
      }
      const rolesAllowed = this.hasAnyRole(binding.roles);
      const permissionAllowed = binding.requireAll
        ? (binding.permissions || []).every((permission) => this.can(permission))
        : this.canAny(binding.permissions);
      return rolesAllowed && permissionAllowed;
    },
    reset() {
      this.activeRoles = [];
      this.explicitPermissions = [];
    },
  },
  persist: {
    key: 'permission',
    storage: localStorage,
    paths: ['activeRoles', 'explicitPermissions'],
  },
});
