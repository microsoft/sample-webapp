# Test Plan

## Application

Sample Web App — a React SPA with login, dashboard (stat cards, activity table, todo list), and navigation. The `feature/todo-persistence-filter` branch adds todo CRUD, localStorage persistence, filtering (All/Active/Completed), and a "Clear completed" action to the dashboard.

## Suites

### Todo CRUD

1. **Add, toggle, and delete a todo** — `tests/todo-crud.spec.ts`
   - Preconditions: Authenticated user on `/dashboard`; localStorage cleared so default todos load
   - Step/Expectation Pairs:
     1. Step: Observe the default todo list
        Expectation: 3 default items visible; "Deploy to staging" is checked; count shows "2 items left"
     2. Step: Type "Run CI pipeline" in the new-todo input and press Enter
        Expectation: "Run CI pipeline" appears as the 4th item (unchecked); count shows "3 items left"; input is cleared
     3. Step: Check the "Review pull requests" checkbox
        Expectation: Checkbox becomes checked; count decreases to "2 items left"
     4. Step: Uncheck the "Review pull requests" checkbox
        Expectation: Checkbox becomes unchecked; count returns to "3 items left"
     5. Step: Click the delete button (×) on "Run CI pipeline"
        Expectation: "Run CI pipeline" is removed from the list; count shows "2 items left"

### Todo Filtering & Clear Completed

2. **Filter todos by status** — `tests/todo-filter.spec.ts`
   - Preconditions: Authenticated user on `/dashboard`; localStorage cleared so default todos load (1 completed, 2 active)
   - Step/Expectation Pairs:
     1. Step: Observe the "All" filter is pressed by default
        Expectation: "All" button has `aria-pressed="true"`; all 3 default todos are visible
     2. Step: Click the "Active" filter button
        Expectation: "Active" button has `aria-pressed="true"`; only 2 active todos are visible; "Deploy to staging" is hidden
     3. Step: Click the "Completed" filter button
        Expectation: "Completed" button has `aria-pressed="true"`; only "Deploy to staging" is visible
     4. Step: Click the "All" filter button
        Expectation: All 3 todos are visible again

3. **Clear completed removes done todos** — `tests/todo-filter.spec.ts`
   - Preconditions: Authenticated user on `/dashboard`; default todos (1 completed)
   - Step/Expectation Pairs:
     1. Step: Observe "Clear completed" button is enabled
        Expectation: Button is not disabled
     2. Step: Click "Clear completed"
        Expectation: "Deploy to staging" is removed; only 2 active todos remain; count shows "2 items left"
     3. Step: Observe "Clear completed" button state
        Expectation: Button is now disabled (no completed todos)

4. **Empty state messages per filter** — `tests/todo-filter.spec.ts`
   - Preconditions: Authenticated user on `/dashboard`; localStorage cleared
   - Step/Expectation Pairs:
     1. Step: Clear all completed todos, then delete all remaining active todos
        Expectation: List shows "No tasks yet. Add one above to get started."
     2. Step: Add a new todo, then click "Active" filter
        Expectation: Active filter shows the new todo (it's active)
     3. Step: Click "Completed" filter
        Expectation: Shows "No completed tasks yet."
     4. Step: Toggle the todo to completed, then click "Active" filter
        Expectation: Shows "No active tasks. Nice work!"

### Todo Persistence

5. **Todos persist across page reload via localStorage** — `tests/todo-persistence.spec.ts`
   - Preconditions: Authenticated user on `/dashboard`; localStorage cleared so default todos load
   - Step/Expectation Pairs:
     1. Step: Add a new todo "Persist me" and toggle "Review pull requests" to done
        Expectation: 4 todos visible; "Persist me" is unchecked; "Review pull requests" is checked
     2. Step: Reload the page
        Expectation: Same 4 todos with same done/not-done states; count unchanged
     3. Step: Delete "Persist me" and reload the page
        Expectation: 3 todos visible; "Persist me" is gone; "Review pull requests" still checked
