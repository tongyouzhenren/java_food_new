import type { App, DirectiveBinding } from 'vue';
import { usePermissionStore } from '/@/store/modules/permission';
import type { PermissionCheckPayload } from '/@/store/modules/permission/types';

type PermissionValue = string | string[] | PermissionCheckPayload;

const resolveAllowed = (binding: DirectiveBinding<PermissionValue>) => {
  const permissionStore = usePermissionStore();
  return permissionStore.canAccess(binding.value);
};

const PermissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    if (!resolveAllowed(binding)) {
      el.parentNode?.removeChild(el);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    if (!resolveAllowed(binding)) {
      el.parentNode?.removeChild(el);
    }
  },
};

const DisabledDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    const allow = resolveAllowed(binding);
    if (!allow) {
      el.setAttribute('disabled', 'true');
      el.classList.add('is-permission-disabled');
      const title = el.getAttribute('title');
      if (!title) {
        el.setAttribute('title', '当前账号无权限执行该操作');
      }
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    const allow = resolveAllowed(binding);
    if (!allow) {
      el.setAttribute('disabled', 'true');
      el.classList.add('is-permission-disabled');
    } else {
      el.removeAttribute('disabled');
      el.classList.remove('is-permission-disabled');
    }
  },
};

export function setupPermissionDirectives(app: App) {
  app.directive('permission', PermissionDirective);
  app.directive('permission-disabled', DisabledDirective);
}
