import type { AsyncComponentLoader, DefineComponent } from 'vue';
import { defineAsyncComponent } from 'vue';

/**
 * 为了兼容不同环境（包括 Windows 下的绝对路径和 Vite 别名），
 * 先把 "/@/views/xxx" 规范化成相对路径再去模块表里查找。
 */
const viewModules = import.meta.glob('../views/**/*.vue');

function normalizePath(path: string) {
  // 把 "/@/views/foo/bar.vue" 转成 "../views/foo/bar.vue"
  if (path.startsWith('/@/views/')) {
    return path.replace('/@/views/', '../views/');
  }
  return path;
}

export function loadView(path: string) {
  const normalized = normalizePath(path);
  const loader = viewModules[normalized] || viewModules[path];

  if (!loader) {
    console.error(`[router] View not found: ${path}`);
    // 返回一个简单的兜底组件，避免出现空白页
    return defineAsyncComponent(() => import('../views/common/404.vue'));
  }

  return defineAsyncComponent({
    loader: loader as AsyncComponentLoader<DefineComponent>,
    delay: 120,
    timeout: 15000,
    suspensible: true,
  });
}
