import type { App } from 'vue';
import { setupPermissionDirectives } from './permission';

export function setupDirectives(app: App) {
  setupPermissionDirectives(app);
}
