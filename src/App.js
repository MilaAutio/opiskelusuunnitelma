import React, { useState, useEffect } from "react";
import axios from "axios";
import Section from "./Section";
import './App.css';

function App() {
  const [sections, setSections] = useState([]);
  const [draggedSectionId, setDraggedSectionId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Hae osiot backendista
    const fetchSections = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/sections');
        setSections(response.data);
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    // Tallenna osiot backend-palvelimelle
    const saveSections = async () => {
      try {
        if( !isInitialLoad ) {
          await axios.post('http://localhost:5001/api/sections', sections);
        }
      } catch (error) {
        console.error('Error saving sections:', error);
      }
    };

    saveSections();
  }, [sections, isInitialLoad]);

  const addSection = () => {
    const newSection = { id: Date.now(), title: "", tasks: [] };
    setSections([...sections, newSection]);
  };

  const updateSection = (updatedSection) => {
    setSections(
      sections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
  };

  const deleteSection = (id) => {
    console.log('delete: ' + id)
    setSections(sections.filter((section) => section.id !== id));
  };

  const overallProgress = () => {
    const totalTasks = sections.reduce(
      (acc, section) => acc + section.tasks.length,
      0
    );
    const completedTasks = sections.reduce(
      (acc, section) => acc + section.tasks.filter((task) => task.completed).length,
      0
    );
    return totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const handleDragStart = (e, id) => {
    setDraggedSectionId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedSectionIndex = sections.findIndex(s => s.id === draggedSectionId);
    const targetSectionIndex = sections.findIndex(s => s.id === targetId);

    if (draggedSectionIndex === -1 || targetSectionIndex === -1) return;

    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(draggedSectionIndex, 1);
    updatedSections.splice(targetSectionIndex, 0, movedSection);

    setSections(updatedSections);
    setDraggedSectionId(null);
  };

  return (
    <div className="app">
      <h1>Study Planner</h1>
      <div className="overall-progress">
        Overall Progress: {overallProgress()}%
        <div className="progress-bar">
          <div
            className="progress-bar-inner"
            style={{ width: `${overallProgress()}%` }}
          ></div>
        </div>
      </div>
      {sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          updateSection={updateSection}
          deleteSection={deleteSection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
      <button className="add-section-btn" onClick={addSection}>
        Add Section
      </button>
    </div>
  );
}

export default App;