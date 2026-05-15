import React, { useState } from 'react';
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

function Dashboard() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');

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
