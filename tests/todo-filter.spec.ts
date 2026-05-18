import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'dashboard.todos.v1';

test.describe('Todo filtering and clear completed', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.removeItem(key);
    }, STORAGE_KEY);
    await page.goto('/dashboard');
  });

  test('should filter todos by status', async ({ page }) => {
    const todoList = page.getByTestId('todo-list');

    // Step 1: "All" filter pressed by default, all 3 default todos visible
    await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    await expect(todoList.locator('li')).toHaveCount(3);

    // Step 2: Active filter — only 2 active todos; "Deploy to staging" hidden
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true');
    await expect(todoList.locator('li')).toHaveCount(2);
    await expect(page.getByText('Deploy to staging')).not.toBeVisible();

    // Step 3: Completed filter — only "Deploy to staging" visible
    await page.getByRole('button', { name: 'Completed', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Completed', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(todoList.locator('li')).toHaveCount(1);
    await expect(page.getByText('Deploy to staging')).toBeVisible();

    // Step 4: Switch back to All — all 3 visible again
    await page.getByRole('button', { name: 'All' }).click();
    await expect(todoList.locator('li')).toHaveCount(3);
  });

  test('should clear completed todos', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: 'Clear completed' });
    const todoCount = page.getByTestId('todo-count');

    // Step 1: Clear completed button is enabled (1 completed default todo)
    await expect(clearBtn).toBeEnabled();

    // Step 2: Click clear completed — "Deploy to staging" removed, 2 active remain
    await clearBtn.click();
    await expect(page.getByText('Deploy to staging')).not.toBeVisible();
    await expect(page.getByTestId('todo-list').locator('li')).toHaveCount(2);
    await expect(todoCount).toHaveText('2 items left');

    // Step 3: Button is now disabled (no completed todos)
    await expect(clearBtn).toBeDisabled();
  });

  test('should display empty state messages per filter', async ({ page }) => {
    const emptyState = page.getByTestId('todo-empty');

    // Step 1: Remove all todos to reach the empty "all" state
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await page.getByRole('button', { name: 'Delete Review pull requests' }).click();
    await page.getByRole('button', { name: 'Delete Write documentation' }).click();
    await expect(emptyState).toHaveText('No tasks yet. Add one above to get started.');

    // Step 2: Add a todo and verify it shows under Active filter
    await page.getByRole('textbox', { name: 'Add a new task...' }).fill('Test task');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByText('Test task')).toBeVisible();

    // Step 3: Completed filter shows empty message
    await page.getByRole('button', { name: 'Completed', exact: true }).click();
    await expect(emptyState).toHaveText('No completed tasks yet.');

    // Step 4: Toggle todo to completed, then Active shows empty message
    await page.getByRole('button', { name: 'All' }).click();
    await page.getByRole('checkbox', { name: 'Toggle Test task' }).check();
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(emptyState).toHaveText('No active tasks. Nice work!');
  });
});
