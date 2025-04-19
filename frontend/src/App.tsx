import { useState, useEffect } from 'react';
import { fetchTasks, addTask, deleteTask } from './api';
import { Task } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTaskText.trim();
    if (!text) return;

    await addTask(text);
    setNewTaskText('');
    const fetchedTasks = await fetchTasks();
    setTasks(fetchedTasks);
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    const fetchedTasks = await fetchTasks();
    setTasks(fetchedTasks);
  };

  return (
    <div>
      <h1 className="task-header">My Tasks:</h1>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Enter a task"
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.text}
            <button
              className="delete-btn"
              onClick={() => handleDeleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;