import { test as setup, expect } from '@playwright/test';

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_USER_EMAIL) throw new Error('TEST_USER_EMAIL is not set');
if (!TEST_USER_PASSWORD) throw new Error('TEST_USER_PASSWORD is not set');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Username' }).fill(TEST_USER_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*dashboard/);

  await page.context().storageState({ path: '.testing-agent/auth/storageState.json' });
});
