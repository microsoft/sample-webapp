import { test, expect } from '@playwright/test';

test.describe('Dashboard page', () => {
  test('should display dashboard heading', async ({ page }) => {
    await page.goto('/dashboard');

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

  test('should add, toggle, and delete a todo item', async ({ page }) => {
    await page.goto('/dashboard');

    const todoList = page.getByTestId('todo-list');
    await expect(todoList.getByRole('listitem')).toHaveCount(3);

    await page.getByPlaceholder('Add a new task...').fill('Buy groceries');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(todoList.getByRole('listitem')).toHaveCount(4);
    await expect(todoList.getByText('Buy groceries')).toBeVisible();

    const toggleCheckbox = page.getByRole('checkbox', { name: 'Toggle Buy groceries' });
    await expect(toggleCheckbox).not.toBeChecked();
    await toggleCheckbox.check();
    await expect(toggleCheckbox).toBeChecked();

    await page.getByRole('button', { name: 'Delete Buy groceries' }).click();
    await expect(todoList.getByRole('listitem')).toHaveCount(3);
    await expect(todoList.getByText('Buy groceries')).not.toBeVisible();
  });

  test('should toggle theme to dark mode and persist across reload', async ({ page }) => {
    await page.goto('/dashboard');

    const themeToggle = page.getByRole('button', { name: /Switch to .* mode/ });
    await expect(themeToggle).toHaveAccessibleName('Switch to dark mode');

    await themeToggle.click();

    await expect(themeToggle).toHaveAccessibleName('Switch to light mode');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: /Switch to .* mode/ })).toHaveAccessibleName('Switch to light mode');
  });

  test('should not add a todo for empty or whitespace-only input', async ({ page }) => {
    await page.goto('/dashboard');

    const todoList = page.getByTestId('todo-list');
    await expect(todoList.getByRole('listitem')).toHaveCount(3);

    await page.getByRole('button', { name: 'Add' }).click();
    await expect(todoList.getByRole('listitem')).toHaveCount(3);

    await page.getByPlaceholder('Add a new task...').fill('   ');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(todoList.getByRole('listitem')).toHaveCount(3);
  });

  test('should filter Recent Activity by search query and show an empty state for no matches', async ({ page }) => {
    await page.goto('/dashboard');

    const searchBox = page.getByRole('searchbox', { name: 'Search activity' });
    await expect(searchBox).toBeVisible();

    const dataRows = page.locator('#activity-table tbody tr');
    await expect(dataRows).toHaveCount(3);

    await searchBox.fill('Bob');
    await expect(dataRows).toHaveCount(1);
    await expect(dataRows).toContainText('Bob');
    await expect(page.locator('#activity-table tbody')).not.toContainText('Alice');
    await expect(page.locator('#activity-table tbody')).not.toContainText('Charlie');

    await searchBox.fill('zzz');
    await expect(dataRows).toHaveCount(0);
    await expect(page.locator('#activity-empty')).toHaveText('No matching activity found.');

    await searchBox.fill('');
    await expect(dataRows).toHaveCount(3);
    await expect(page.locator('#activity-empty')).toHaveCount(0);
  });

  test('should clear completed todos and update the summary count', async ({ page }) => {
    await page.goto('/dashboard');

    const summary = page.locator('#todo-summary');
    const todoList = page.getByTestId('todo-list');
    const clearCompleted = page.locator('#clear-completed');

    // One todo ("Deploy to staging") starts completed on mount.
    await expect(todoList.getByRole('listitem')).toHaveCount(3);
    await expect(summary).toHaveText('1 of 3 tasks completed');
    await expect(clearCompleted).toBeVisible();

    // Mark a second todo done; the summary recalculates.
    await page.getByRole('checkbox', { name: 'Toggle Review pull requests' }).check();
    await expect(summary).toHaveText('2 of 3 tasks completed');

    // Clearing removes every completed todo, leaving only the unfinished one.
    await clearCompleted.click();

    await expect(todoList.getByRole('listitem')).toHaveCount(1);
    await expect(todoList.getByText('Write documentation')).toBeVisible();
    await expect(todoList.getByText('Deploy to staging')).toHaveCount(0);
    await expect(todoList.getByText('Review pull requests')).toHaveCount(0);
    await expect(summary).toHaveText('0 of 1 tasks completed');

    // With no completed todos remaining, the button is no longer rendered.
    await expect(clearCompleted).toHaveCount(0);
  });
});
