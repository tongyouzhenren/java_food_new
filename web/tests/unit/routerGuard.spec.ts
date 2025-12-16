import router, { allowList } from '/@/router';
import { beforeEach, describe, expect, it } from 'vitest';

const navigate = async (path: string) => {
  await router.push(path);
  await router.isReady();
  return router.currentRoute.value.fullPath;
};

describe('router guards', () => {
  beforeEach(async () => {
    localStorage.clear();
    await router.replace('/');
  });

  it('redirects unauthenticated admin users to admin login', async () => {
    const fullPath = await navigate('/admin/thing');
    expect(fullPath).toContain('/adminLogin');
  });

  it('allows admin route when admin token exists', async () => {
    localStorage.setItem('ADMIN_USER_TOKEN', 'token');
    const fullPath = await navigate('/admin/thing');
    expect(fullPath).toBe('/admin/thing');
  });

  it('prevents logged-in front users from hitting login again', async () => {
    localStorage.setItem('USER_TOKEN', 'token');
    const fullPath = await navigate('/index/login');
    expect(fullPath).toBe('/index/portal');
  });

  it('respects allow list without a token', async () => {
    const fullPath = await navigate('/index/login');
    expect(allowList).toContain(router.currentRoute.value.name as string);
    expect(fullPath).toBe('/index/login');
  });
});
