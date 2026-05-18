import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'dashboard.todos.v1';

test.describe('Todo persistence', () => {
  test('should persist todos across page reload via localStorage', async ({ page }) => {
    // Clear localStorage only on first load; sessionStorage flag survives reloads
    await page.addInitScript((key) => {
      if (!sessionStorage.getItem('__test_cleared')) {
        localStorage.removeItem(key);
        sessionStorage.setItem('__test_cleared', '1');
      }
    }, STORAGE_KEY);
    await page.goto('/dashboard');

    const todoList = page.getByTestId('todo-list');
    const todoCount = page.getByTestId('todo-count');

    // Step 1: Add "Persist me" and toggle "Review pull requests" to done
    await page.getByRole('textbox', { name: 'Add a new task...' }).fill('Persist me');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('checkbox', { name: 'Toggle Review pull requests' }).check();

    await expect(todoList.locator('li')).toHaveCount(4);
    await expect(page.getByRole('checkbox', { name: 'Toggle Persist me' })).not.toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Toggle Review pull requests' })).toBeChecked();

    // Step 2: Reload — same 4 todos with same states; count unchanged
    await page.reload();
    await expect(todoList.locator('li')).toHaveCount(4);
    await expect(page.getByRole('checkbox', { name: 'Toggle Persist me' })).not.toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Toggle Review pull requests' })).toBeChecked();
    await expect(todoCount).toHaveText('2 items left');

    // Step 3: Delete "Persist me", reload — 3 todos, "Review pull requests" still checked
    await page.getByRole('button', { name: 'Delete Persist me' }).click();
    await page.reload();
    await expect(todoList.locator('li')).toHaveCount(3);
    await expect(page.getByText('Persist me')).not.toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Toggle Review pull requests' })).toBeChecked();
  });
});
