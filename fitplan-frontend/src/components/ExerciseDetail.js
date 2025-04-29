import React from 'react';
import { useParams } from 'react-router-dom';
import { getExerciseById } from '../data/exercises';
import './ExerciseDetail.css';

const ExerciseDetail = () => {
  const { id } = useParams();
  const exercise = getExerciseById(id);

  if (!exercise) {
    return (
      <div className="exercise-detail-container">
        <div className="error-message">
          Übung nicht gefunden
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-detail-container">
      <div className="exercise-detail-card">
        <div className="exercise-header">
          <h2>{exercise.name}</h2>
          <div className="exercise-meta">
            <span className="difficulty-badge">
              {exercise.difficulty}
            </span>
            <span className="type-badge">
              {exercise.type}
            </span>
          </div>
        </div>

        <div className="exercise-media">
          <img 
            src={exercise.imageUrl} 
            alt={exercise.name} 
            className="exercise-image"
          />
        </div>

        <div className="exercise-content">
          <section className="target-section">
            <h3>Zielmuskulatur</h3>
            <div className="muscle-tags">
              {exercise.targetMuscles.map(muscle => (
                <span key={muscle} className="muscle-tag">
                  {muscle}
                </span>
              ))}
            </div>
          </section>

          <section className="instructions-section">
            <h3>Ausführung</h3>
            <ol className="instruction-steps">
              {exercise.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="workout-details">
            <h3>Trainingsdetails</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Sets</span>
                <span className="detail-value">{exercise.recommendedSets}</span>
              </div>
              {exercise.recommendedReps && (
                <div className="detail-item">
                  <span className="detail-label">Wiederholungen</span>
                  <span className="detail-value">{exercise.recommendedReps}</span>
                </div>
              )}
              {exercise.recommendedDuration && (
                <div className="detail-item">
                  <span className="detail-label">Dauer</span>
                  <span className="detail-value">{exercise.recommendedDuration}s</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Pausenzeit</span>
                <span className="detail-value">{exercise.restTime}s</span>
              </div>
            </div>
          </section>

          <section className="equipment-section">
            <h3>Benötigtes Equipment</h3>
            <div className="equipment-list">
              {exercise.equipment.map(item => (
                <span key={item} className="equipment-item">
                  {item === 'none' ? 'Kein Equipment benötigt' : item}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail; 