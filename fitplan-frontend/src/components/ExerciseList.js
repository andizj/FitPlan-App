import React, { useState } from 'react';
import { 
  exercises, 
  MUSCLE_GROUPS, 
  DIFFICULTY_LEVELS, 
  EXERCISE_CATEGORIES 
} from '../data/exercises';
import './ExerciseList.css';

const ExerciseList = () => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Filter Übungen basierend auf den ausgewählten Filtern
  const filteredExercises = exercises.filter(exercise => {
    const matchesMuscleGroup = selectedMuscleGroup === 'all' || 
      exercise.targetMuscles.includes(selectedMuscleGroup);
    const matchesDifficulty = selectedDifficulty === 'all' || 
      exercise.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || 
      exercise.type === selectedType;
    
    return matchesMuscleGroup && matchesDifficulty && matchesType;
  });

  return (
    <div className="exercise-list-container">
      <div className="filters">
        <select 
          value={selectedMuscleGroup} 
          onChange={(e) => setSelectedMuscleGroup(e.target.value)}
        >
          <option value="all">Alle Muskelgruppen</option>
          {Object.entries(MUSCLE_GROUPS).map(([key, value]) => (
            <option key={value} value={value}>
              {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
            </option>
          ))}
        </select>

        <select 
          value={selectedDifficulty} 
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="all">Alle Schwierigkeitsgrade</option>
          {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
            <option key={value} value={value}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">Alle Kategorien</option>
          {Object.entries(EXERCISE_CATEGORIES).map(([key, value]) => (
            <option key={value} value={value}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="exercise-grid">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-image">
              <img src={exercise.imageUrl} alt={exercise.name} />
            </div>
            <div className="exercise-info">
              <h3>{exercise.name}</h3>
              <p className="difficulty">
                Schwierigkeit: {exercise.difficulty}
              </p>
              <p className="target-muscles">
                Muskelgruppen: {exercise.targetMuscles.join(', ')}
              </p>
              <div className="exercise-details">
                <p>Sets: {exercise.recommendedSets}</p>
                <p>
                  {exercise.recommendedReps 
                    ? `Wiederholungen: ${exercise.recommendedReps}`
                    : `Dauer: ${exercise.recommendedDuration}s`}
                </p>
              </div>
              <button className="view-details-btn">
                Details anzeigen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList; 