import React, { useState } from "react";
import './Task.css';

function Task({ task, updateTask, deleteTask }) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [text, setText] = useState(task.text || "No Name");
  const [notes, setNotes] = useState(task.notes || "");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextSave = () => {
    setIsEditingText(false);
    updateTask({ ...task, text: text.trim() || "No Name" });
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleNotesSave = () => {
    setIsEditingNotes(false);
    updateTask({ ...task, notes });
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
      {isEditingText ? (
        <div>
          <input
            className="task-text"
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Task"
          />
          <button className="save-task-btn" onClick={handleTextSave}>
            Save
          </button>
        </div>
      ) : (
        <div>
          <span className={`task-text ${task.completed ? "completed" : ""}`}>
            {text}
          </span>
          <button
            className="edit-task-btn"
            onClick={() => setIsEditingText(true)}
          >
            Edit
          </button>
        </div>
      )}
      <div className="task-notes">
        {isEditingNotes ? (
          <div>
            <textarea
              className="task-notes-input"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes"
            />
            <button className="save-notes-btn" onClick={handleNotesSave}>
              Save Notes
            </button>
          </div>
        ) : (
          <div>
            <div className="task-notes-display">{notes || "No notes"}</div>
            <button
              className="edit-notes-btn"
              onClick={() => setIsEditingNotes(true)}
            >
              Add/Edit Notes
            </button>
          </div>
        )}
      </div>
      <button className="delete-task-btn" onClick={() => deleteTask(task.id)}>
        Delete Task
      </button>
    </div>
  );
}

export default Task;