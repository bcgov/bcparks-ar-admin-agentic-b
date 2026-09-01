// criterion: @R-23.2
import { test, expect } from '@playwright/test';

test.describe('App shell smoke (TEST-003)', () => {
  test('loads root shell with expected title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/A&R Admin/);
    await expect(page.locator('app-root')).toBeVisible();
  });
});
