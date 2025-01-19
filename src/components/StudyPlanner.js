import React, { useState, useEffect } from 'react';
import Section from './Section';
import axios from 'axios';
import '../styles/App.css';

function StudyPlanner() {
  const [sections, setSections] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [draggedSectionId, setDraggedSectionId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchSections(token);
    }
  }, []);

  const fetchSections = async (token) => {
    try {
      const response = await axios.get('https://api.milaa.fi/api/sections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSections(response.data);
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    saveSections();
  }, [sections, isInitialLoad]);

  const saveSections = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (!isInitialLoad) {
        await axios.post('https://api.milaa.fi/api/sections', sections, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error('Error saving sections:', error);
    }
  };

  const addSection = () => {
    const newSection = { id: Date.now(), title: '', tasks: [] };
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
    setSections(sections.filter((section) => section.id !== id));
  };

  const overallProgress = () => {
    const totalTasks = sections.reduce(
      (acc, section) => acc + section.tasks.length,
      0
    );
    const completedTasks = sections.reduce(
      (acc, section) =>
        acc + section.tasks.filter((task) => task.completed).length,
      0
    );
    return totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const handleDragStart = (e, id) => {
    setDraggedSectionId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedSectionIndex = sections.findIndex((s) => s.id === draggedSectionId);
    const targetSectionIndex = sections.findIndex((s) => s.id === targetId);

    if (draggedSectionIndex === -1 || targetSectionIndex === -1) return;

    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(draggedSectionIndex, 1);
    updatedSections.splice(targetSectionIndex, 0, movedSection);

    setSections(updatedSections);
    setDraggedSectionId(null);
  };

  return (
    <div>
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

export default StudyPlanner;