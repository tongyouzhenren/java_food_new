import { createRouter, createWebHistory } from 'vue-router';
import root from './root';

import { ADMIN_USER_TOKEN, USER_TOKEN } from '/@/store/constants';

// 路由权限白名单
export const allowList = ['adminLogin', 'login', 'register', 'portal', 'search', 'detail', '403', '404'];
// 前台登录地址
const loginRoutePath = '/index/login';
// 后台登录地址
const adminLoginRoutePath = '/adminLogin';

const router = createRouter({
  history: createWebHistory(),
  routes: root,
});

router.beforeEach(async (to, from, next) => {
  console.log('路由跳转:', to.path, from.path);

  /** 1. 后台路由处理 **/
  if (to.path.startsWith('/admin')) {
    const adminToken = localStorage.getItem(ADMIN_USER_TOKEN) || localStorage.getItem('ADMIN_USER_TOKEN');

    if (adminToken) {
      if (to.path === adminLoginRoutePath) {
        next({ path: '/' });
      } else {
        next();
      }
    } else {
      if (allowList.includes(to.name as string)) {
        // 在免登录名单，直接进入
        next();
      } else {
        next({ path: adminLoginRoutePath, query: { redirect: to.fullPath } });
      }
    }
    return; // <--- 关键修改：处理完就返回，不让它继续往下走
  }

  /** 2. 前台路由处理 **/
  if (to.path.startsWith('/index')) {
    const userToken = localStorage.getItem(USER_TOKEN) || localStorage.getItem('USER_TOKEN');

    if (userToken) {
      if (to.path === loginRoutePath) {
        next({ path: '/index/portal' });
      } else {
        next();
      }
    } else {
      if (allowList.includes(to.name as string)) {
        // 在免登录名单，直接进入
        next();
      } else {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      }
    }
    return; // <--- 关键修改：处理完就返回
  }

  /** 3. 兜底处理 (修复白屏问题的关键) **/
  // 如果既不是 /admin 开头，也不是 /index 开头 (比如根路径 / 或插件路径)，直接放行
  next();
});

router.afterEach((_to) => {
  // 回到顶部
  document.getElementById('html')?.scrollTo(0, 0);
});

export default router;
