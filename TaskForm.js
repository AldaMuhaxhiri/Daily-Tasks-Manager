
import { useState } from "react";


import './TaskForm.css'; 

//prompt onAdd
export default function TaskForm({ onAdd }) {

  // State variable 'taskName' to track the input value for a new task.

  const [taskName, setTaskName] = useState('');

// nuk lejon gjendjen default pas submitit
  function handleSubmit(ev) {
    ev.preventDefault();
    onAdd(taskName);
    setTaskName('');
  }

  // JSX structura e add taskave dhe submit butonit.
  
  return (
    <form onSubmit={handleSubmit} className="task-form">
      {/* Button for adding a task */}
      <button className="add-button">+</button>

      {/* Input field per emrat e taskave */}
      <input
        type="text"
        value={taskName}
        onChange={ev => setTaskName(ev.target.value)}
        placeholder="Add your task..."
      />
    </form>
  );
}
