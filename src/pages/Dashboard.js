import React, { useEffect, useMemo, useState } from 'react';
import './Dashboard.css';

const TODOS_STORAGE_KEY = 'dashboard.todos.v1';

const defaultTodos = [
  { id: 1, text: 'Review pull requests', done: false },
  { id: 2, text: 'Deploy to staging', done: true },
  { id: 3, text: 'Write documentation', done: false },
];

const activityData = [
  { user: 'Alice', action: 'Created account', date: '2026-05-14' },
  { user: 'Bob', action: 'Placed order', date: '2026-05-13' },
  { user: 'Charlie', action: 'Updated profile', date: '2026-05-12' },
];

const FILTERS = ['all', 'active', 'completed'];

function loadTodos() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultTodos;
  }
  try {
    const raw = window.localStorage.getItem(TODOS_STORAGE_KEY);
    if (!raw) return defaultTodos;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultTodos;
    return parsed
      .filter(t => t && typeof t.text === 'string')
      .map(t => ({ id: t.id ?? Date.now(), text: t.text, done: !!t.done }));
  } catch {
    return defaultTodos;
  }
}

function Dashboard() {
  const [todos, setTodos] = useState(loadTodos);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    } catch {
      /* storage may be full or unavailable; ignore */
    }
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), done: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.done));
  };

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.done);
    if (filter === 'completed') return todos.filter(t => t.done);
    return todos;
  }, [todos, filter]);

  const remainingCount = todos.filter(t => !t.done).length;
  const hasCompleted = todos.some(t => t.done);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Users</h3>
          <p className="stat" id="user-count">128</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p className="stat" id="revenue">$12,450</p>
        </div>
        <div className="card">
          <h3>Orders</h3>
          <p className="stat" id="order-count">340</p>
        </div>
      </div>

      <section className="todo-section">
        <h2>Todo List</h2>
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            id="new-todo"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>

        <div className="todo-toolbar" role="toolbar" aria-label="Todo filters">
          <div className="todo-filters" role="group" aria-label="Filter todos">
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                className={`todo-filter${filter === f ? ' active' : ''}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <span className="todo-count" data-testid="todo-count" aria-live="polite">
            {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
          </span>
          <button
            type="button"
            className="todo-clear-completed"
            onClick={clearCompleted}
            disabled={!hasCompleted}
          >
            Clear completed
          </button>
        </div>

        <ul className="todo-list" data-testid="todo-list">
          {visibleTodos.length === 0 ? (
            <li className="todo-empty" data-testid="todo-empty">
              {filter === 'completed'
                ? 'No completed tasks yet.'
                : filter === 'active'
                  ? 'No active tasks. Nice work!'
                  : 'No tasks yet. Add one above to get started.'}
            </li>
          ) : (
            visibleTodos.map(todo => (
              <li key={todo.id} className={todo.done ? 'done' : ''}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Toggle ${todo.text}`}
                />
                <span>{todo.text}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2>Recent Activity</h2>
        <table id="activity-table">
          <thead>
            <tr><th>User</th><th>Action</th><th>Date</th></tr>
          </thead>
          <tbody>
            {activityData.map((row, i) => (
              <tr key={i}>
                <td>{row.user}</td>
                <td>{row.action}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Dashboard;
