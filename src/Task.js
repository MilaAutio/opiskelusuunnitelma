import React, { useState } from "react";
import './Task.css';

function Task({ task, updateTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text || "No Name");
  const [notes, setNotes] = useState(task.notes || "");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSave = () => {
    setIsEditing(false);
    updateTask({ ...task, text: text.trim() || "No Name", notes });
  };

  const toggleCompleted = () => {
    updateTask({ ...task, completed: !task.completed });
  };

  return (
    <div className="task">
      <div className="task-checkbox-container">
        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleCompleted}
            className="task-checkbox"
          />
          <span className="checkbox-checkmark"></span>
        </label>
      </div>
      {isEditing ? (
        <div className="edit-task-container">
          <div>
            <input
              className="task-text"
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Task"
            />
            <textarea
              className="task-notes-input"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes"
            />
          </div>
          <button className="save-task-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <div className="show-task-container">
          <div>
            <div className="task-text-container">
              <span className={`task-text ${task.completed ? "completed" : ""}`}>
                {text}
              </span>
            </div>
            {notes && (
              <div className="task-notes">
                <div className="task-notes-display">{notes}</div>
              </div>
            )}
          </div>
          <button
            className="edit-task-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Task
          </button>
        </div>
      )}
      <button className="delete-task-btn" onClick={() => deleteTask(task.id)}>
        X
      </button>
    </div>
  );
}

export default Task;
