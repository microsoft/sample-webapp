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

const stats = [
  { id: 'user-count', label: 'Users', value: '128' },
  { id: 'revenue', label: 'Revenue', value: '$12,450' },
  { id: 'order-count', label: 'Orders', value: '340' },
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
      .filter((todo) => todo && typeof todo.text === 'string')
      .map((todo) => ({
        id: todo.id ?? Date.now(),
        text: todo.text,
        done: !!todo.done,
      }));
  } catch {
    return defaultTodos;
  }
}

function Dashboard() {
  const [todos, setTodos] = useState(loadTodos);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [isChartsLoading, setIsChartsLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsChartsLoading(false);
    }, 900);

    return () => clearTimeout(timerId);
  }, []);

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
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.done));
  };

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.done);
    if (filter === 'completed') return todos.filter((todo) => todo.done);

    return todos;
  }, [todos, filter]);

  const remainingCount = todos.filter((todo) => !todo.done).length;
  const hasCompleted = todos.some((todo) => todo.done);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid" aria-busy={isChartsLoading}>
        {stats.map((stat) => (
          <div className="card" key={stat.id}>
            <h3>{stat.label}</h3>
            {isChartsLoading ? (
              <div className="chart-skeleton" role="status" aria-label={`Loading ${stat.label} chart`} />
            ) : (
              <p className="stat" id={stat.id}>{stat.value}</p>
            )}
          </div>
        ))}
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
            {FILTERS.map((currentFilter) => (
              <button
                key={currentFilter}
                type="button"
                className={`todo-filter${filter === currentFilter ? ' active' : ''}`}
                aria-pressed={filter === currentFilter}
                onClick={() => setFilter(currentFilter)}
              >
                {currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}
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
            visibleTodos.map((todo) => (
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
