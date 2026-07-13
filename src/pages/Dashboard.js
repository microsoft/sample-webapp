import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const initialTodos = [
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

function Dashboard() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [isChartsLoading, setIsChartsLoading] = useState(true);
  const [activityQuery, setActivityQuery] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsChartsLoading(false);
    }, 900);

    return () => clearTimeout(timerId);
  }, []);

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

  const query = activityQuery.trim().toLowerCase();
  const filteredActivity = query
    ? activityData.filter((row) =>
        `${row.user} ${row.action} ${row.date}`.toLowerCase().includes(query)
      )
    : activityData;

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
        <p className="todo-summary" id="todo-summary">
          {todos.filter(t => t.done).length} of {todos.length} tasks completed
        </p>
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
        <ul className="todo-list" data-testid="todo-list">
          {todos.map(todo => (
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
          ))}
        </ul>
        {todos.some(t => t.done) && (
          <button
            type="button"
            className="btn"
            id="clear-completed"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        )}
      </section>

      <section>
        <h2>Recent Activity</h2>
        <div className="form-group">
          <label htmlFor="activity-search">Search activity</label>
          <input
            type="search"
            id="activity-search"
            placeholder="Filter by user or action"
            value={activityQuery}
            onChange={(e) => setActivityQuery(e.target.value)}
          />
        </div>
        <p className="activity-count" id="activity-count">
          Showing {filteredActivity.length} of {activityData.length}
        </p>
        <table id="activity-table">
          <thead>
            <tr><th>User</th><th>Action</th><th>Date</th></tr>
          </thead>
          <tbody>
            {filteredActivity.map((row, i) => (
              <tr key={i}>
                <td>{row.user}</td>
                <td>{row.action}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredActivity.length === 0 && (
          <p id="activity-empty">No matching activity found.</p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
