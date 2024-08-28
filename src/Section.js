import React, { useState, useRef } from "react";
import Task from "./Task";
import './Section.css';

function Section({ section, updateSection, deleteSection, onDragStart, onDragOver, onDrop }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title || "No Name");
  const [showTasks, setShowTasks] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const sectionRef = useRef(null);

  const sectionProgress = () => {
    const completedTasks = section.tasks.filter((task) => task.completed).length;
    return section.tasks.length
      ? Math.round((completedTasks / section.tasks.length) * 100)
      : 0;
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    updateSection({ ...section, title: title.trim() || "No Name" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleSave();
    }
  };

  const toggleShowTasks = () => {
    setShowTasks(!showTasks);
  };

  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = section.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    updateSection({ ...section, tasks: updatedTasks });
  };

  const handleTaskDelete = (taskId) => {
    const updatedTasks = section.tasks.filter(task => task.id !== taskId);
    updateSection({ ...section, tasks: updatedTasks });
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now(), // simple unique id generator
        text: newTaskText,
        completed: false,
        notes: ""
      };
      updateSection({
        ...section,
        tasks: [...section.tasks, newTask]
      });
      setNewTaskText("");
      setIsAddingTask(false);
    }
  };

  return (
    <div
      className="section"
      ref={sectionRef}
      draggable
      onDragStart={(e) => onDragStart(e, section.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, section.id)}
    >
      <div className="section-header">
        {isEditingTitle ? (
          <div className="title-container">
            <input
              className="section-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown} // Add this line to handle Enter key press
            />
            <div className="buttons">
              <button className="save-title-btn" onClick={handleTitleSave}>
                Save
              </button>
              <button className="delete-section-btn" onClick={() => deleteSection(section.id)}>
                X
              </button>
              <button className="toggle-tasks-btn" onClick={toggleShowTasks}>
                {showTasks ? "Hide Tasks" : "Show Tasks"}
              </button>
            </div>
          </div>
        ) : (
          <div className="title-container">
            <span className="section-title-display">{title}</span>
            <div className="section-progress">
              Section Progress: {sectionProgress()}%
              <div className="progress-bar">
                <div
                  className="progress-bar-inner"
                  style={{ width: `${sectionProgress()}%` }}
                ></div>
              </div>
            </div>
            <div className="buttons">
              <button
                className="edit-title-btn"
                onClick={() => setIsEditingTitle(true)}
              >
                Edit
              </button>
              <button className="delete-section-btn" onClick={() => deleteSection(section.id)}>
                X
              </button>
              <button className="toggle-tasks-btn" onClick={toggleShowTasks}>
                {showTasks ? "Hide Tasks" : "Show Tasks"}
              </button>
            </div>
          </div>
        )}
      </div>
      {showTasks && (
        <div className="tasks-list">
          {section.tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              updateTask={handleTaskUpdate}
              deleteTask={handleTaskDelete}
            />
          ))}
          <div className="add-task-container">
            {isAddingTask && (
              <div className="add-task-form">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="New task"
                />
                <button className="save-task-btn" onClick={handleAddTask}>
                  Add Task
                </button>
              </div>
            )}
            <button
              className="add-task-btn"
              onClick={() => setIsAddingTask(!isAddingTask)}
            >
              {isAddingTask ? "Cancel" : "Add Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Section;
