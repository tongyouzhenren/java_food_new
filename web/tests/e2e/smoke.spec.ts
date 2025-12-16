import { test, expect } from '@playwright/test';

test.describe('应用可用性', () => {
  test('首页可以打开并渲染', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/外卖点餐网站演示/);
    await expect(page.locator('#app')).toBeVisible();
  });
});
