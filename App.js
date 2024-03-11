// App.js

import './App.css';
import TaskForm from "./TaskForm";
import Task from "./Task";
import { useEffect, useState } from "react";
import axios from 'axios';

// Funksioni baze qe shfaq the Daily Task Manager .
function App() {
  // variablat te cilat menagjojne taskat, thenjet dhe daten
  const [tasks, setTasks] = useState([]);
  const [showMotivationalAlert, setShowMotivationalAlert] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // mbethyesi i cili e update local storage kur ndryshon tasku
  useEffect(() => {
    if (tasks.length === 0) return;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    checkTasksCompletion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // useeffect qe load te dhenat nga localstorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    setTasks(storedTasks || []);
    checkTasksCompletion();
    setCurrentDate(getFormattedDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // async funksion qe kthen dhe merr te dhenat nga API
  async function fetchMotivationalQuote() {
    try {
      const response = await axios.get('https://type.fit/api/quotes');
      const randomIndex = Math.floor(Math.random() * response.data.length);
      const motivationalQuote = response.data[randomIndex].text;
      window.alert(`Be proud of yourself!\n\nDaily Motivation:\n"${motivationalQuote}"`);
    } catch (error) {
      console.error('Error fetching motivational quote:', error);
    }
  }

  // funksioni i cili shikon taskat per te kthyer true/false motivationalAlert display
  function checkTasksCompletion() {
    const numberComplete = tasks.filter(t => t.done).length;
    const numberTotal = tasks.length;

    if (numberTotal > 0 && numberComplete === numberTotal && !showMotivationalAlert) {
      setShowMotivationalAlert(true);
      fetchMotivationalQuote();
    } else if (numberComplete !== numberTotal) {
      setShowMotivationalAlert(false);
    }
  }

  // Funksioni per te shtuar nje task te ri ne varg
  function addTask(name) {
    setTasks(prev => [...prev, { name, done: false }]);
  }

  // funksioni per te hequr nje index specifik nga vargu
  function removeTask(indexToRemove) {
    setTasks(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  // Funksioni qe fshin taskat por nuk ka display te thenjes 
  function removeAllTasks() {
    setTasks([]);
    setShowMotivationalAlert(false);
  }

  // Funksioni per update te nje tasku me index specifik 
  function updateTaskDone(taskIndex, newDone) {
    setTasks(prev => {
      const newTasks = [...prev];
      newTasks[taskIndex].done = newDone;
      return newTasks;
    });
  }

  // Funksioni qe kthen mesazh bazuar ne perqindje te kompletimit 
  function getMessage() {
    const percentage = (tasks.length > 0) ? (tasks.filter(t => t.done).length / tasks.length) * 100 : 0;
    if (percentage === 0) {
      return 'Let\'s get started! Add at least one task! 🚀';
    }
    if (percentage === 100) {
      return 'Fantastic job! You\'ve completed everything! 🎉';
    }
    return 'Keep it up! You\'re on your way to a productive day! 💪';
  }

  // Funksioni qe mundeson rename te nje indexi specifik
  function renameTask(index, newName) {
    setTasks(prev => {
      const newTasks = [...prev];
      newTasks[index].name = newName;
      return newTasks;
    });
  }

  // Funksioni qe lejon current date display
  function getFormattedDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('sq-AL', options);
    return currentDate;
  }
  

  // Rendering e kontentit baze te detyres
  return (
    <main>
      <h1>Your Daily Task Manager 🌟</h1>
      <h3>{currentDate}</h3>
      <h2>{tasks.filter(t => t.done).length}/{tasks.length} Tasks Completed</h2>
      <TaskForm onAdd={addTask} />
      {tasks.map((task, index) => (
        <Task
          key={index}
          {...task}
          onRename={newName => renameTask(index, newName)}
          onTrash={() => removeTask(index)}
          onToggle={done => updateTaskDone(index, done)}
        />
      ))}
      <p className="message">{getMessage()}</p>
      {showMotivationalAlert && (
        <div className="motivational-alert">
          <p> Be proud of yourself!</p>
          <button onClick={removeAllTasks}>Done for the day!</button>
        </div>
      )}
    </main>
  );
}

export default App;
