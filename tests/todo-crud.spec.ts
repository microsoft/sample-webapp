import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'dashboard.todos.v1';

test.describe('Todo CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.removeItem(key);
    }, STORAGE_KEY);
    await page.goto('/dashboard');
  });

  test('should add, toggle, and delete a todo', async ({ page }) => {
    const todoList = page.getByTestId('todo-list');
    const todoCount = page.getByTestId('todo-count');

    // Step 1: Observe default todo list — 3 items, "Deploy to staging" checked, 2 items left
    await expect(todoList.locator('li')).toHaveCount(3);
    await expect(page.getByRole('checkbox', { name: 'Toggle Deploy to staging' })).toBeChecked();
    await expect(todoCount).toHaveText('2 items left');

    // Step 2: Add "Run CI pipeline" via Enter key
    const input = page.getByRole('textbox', { name: 'Add a new task...' });
    await input.fill('Run CI pipeline');
    await input.press('Enter');

    await expect(page.getByText('Run CI pipeline')).toBeVisible();
    await expect(todoList.locator('li')).toHaveCount(4);
    await expect(page.getByRole('checkbox', { name: 'Toggle Run CI pipeline' })).not.toBeChecked();
    await expect(todoCount).toHaveText('3 items left');
    await expect(input).toHaveValue('');

    // Step 3: Toggle "Review pull requests" to done
    await page.getByRole('checkbox', { name: 'Toggle Review pull requests' }).check();
    await expect(page.getByRole('checkbox', { name: 'Toggle Review pull requests' })).toBeChecked();
    await expect(todoCount).toHaveText('2 items left');

    // Step 4: Uncheck "Review pull requests"
    await page.getByRole('checkbox', { name: 'Toggle Review pull requests' }).uncheck();
    await expect(page.getByRole('checkbox', { name: 'Toggle Review pull requests' })).not.toBeChecked();
    await expect(todoCount).toHaveText('3 items left');

    // Step 5: Delete "Run CI pipeline"
    await page.getByRole('button', { name: 'Delete Run CI pipeline' }).click();
    await expect(page.getByText('Run CI pipeline')).not.toBeVisible();
    await expect(todoCount).toHaveText('2 items left');
  });
});
