import { test, expect } from '@playwright/test';

test.describe('Dashboard page', () => {
  test('should display dashboard heading', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  });

  test('should display stat cards for Users, Revenue, and Orders', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Users', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Revenue', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Orders', level: 3 })).toBeVisible();

    await expect(page.locator('#user-count')).not.toBeEmpty();
    await expect(page.locator('#revenue')).not.toBeEmpty();
    await expect(page.locator('#order-count')).not.toBeEmpty();
  });

  test('should display correct values in stat cards', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.locator('#user-count')).toHaveText('128');
    await expect(page.locator('#revenue')).toHaveText('$12,450');
    await expect(page.locator('#order-count')).toHaveText('340');
  });

  test('should display Recent Activity table with data', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Recent Activity', level: 2 })).toBeVisible();

    const table = page.locator('#activity-table');
    await expect(table).toBeVisible();

    await expect(table.getByRole('columnheader', { name: 'User' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Action' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Date' })).toBeVisible();

    const rows = table.locator('tbody tr');
    await expect(rows).not.toHaveCount(0);
  });

  test('should display correct data in each activity table row', async ({ page }) => {
    await page.goto('/dashboard');

    const rows = page.locator('#activity-table tbody tr');
    await expect(rows).toHaveCount(3);

    const firstRow = rows.nth(0);
    await expect(firstRow.getByRole('cell', { name: 'Alice' })).toBeVisible();
    await expect(firstRow.getByRole('cell', { name: 'Created account' })).toBeVisible();
    await expect(firstRow.getByRole('cell', { name: '2026-05-14' })).toBeVisible();

    const secondRow = rows.nth(1);
    await expect(secondRow.getByRole('cell', { name: 'Bob' })).toBeVisible();
    await expect(secondRow.getByRole('cell', { name: 'Placed order' })).toBeVisible();
    await expect(secondRow.getByRole('cell', { name: '2026-05-13' })).toBeVisible();

    const thirdRow = rows.nth(2);
    await expect(thirdRow.getByRole('cell', { name: 'Charlie' })).toBeVisible();
    await expect(thirdRow.getByRole('cell', { name: 'Updated profile' })).toBeVisible();
    await expect(thirdRow.getByRole('cell', { name: '2026-05-12' })).toBeVisible();
  });
});
