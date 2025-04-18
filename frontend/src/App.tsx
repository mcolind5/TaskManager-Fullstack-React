// Equivalent of main.ts

import { useState, useEffect } from 'react';
import { fetchTasks, addTask, deleteTask } from './api';
import { Task } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Load initial tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await fetchTasks();
        setTasks(loadedTasks); // Updates the state and triggers a re-render
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, []); // Empty [] means "run once"

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const addedTask = await addTask(newTaskText);
      setTasks([...tasks, addedTask]); // Creates new array with the added task (cause React likes immutability)
      setNewTaskText('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  // No need to manually find DOM elements like with vanilla TS
  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Task Manager</h1>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Enter a new task"
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.map(task => ( // Replaces forEach loop
          // Helps React track list items (similar to my data-id attribute)
          <li key={task.id}> 
            {task.text}
            <button
              onClick={() => handleDeleteTask(task.id)} // onClick replaces addEventListener
              className="delete-btn"
            >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;