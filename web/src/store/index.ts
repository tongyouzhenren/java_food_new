import { createPinia } from 'pinia';

import { useAppStore } from './modules/app';
import { useUserStore } from './modules/user';
import { usePermissionStore } from './modules/permission';
import { useDashboardStore } from './modules/dashboard';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// ✅ 所有 store 都导出
export {
  useAppStore,
  useUserStore,
  usePermissionStore,
  useDashboardStore,
};

export default pinia;
