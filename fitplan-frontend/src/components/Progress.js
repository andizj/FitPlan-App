import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Progress.css';

const Progress = () => {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        const workoutsRef = collection(db, 'workouts');
        const q = query(workoutsRef, where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const history = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setWorkoutHistory(history);
      } catch (error) {
        console.error('Fehler beim Laden des Trainingsverlaufs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutHistory();
  }, []);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="progress-container">
      <div className="progress-card">
        <h2 className="section-title">Mein Fortschritt</h2>

        {workoutHistory.length > 0 ? (
          <div className="workout-history">
            <div className="history-stats">
              <div className="stat-card">
                <span className="stat-value">{workoutHistory.length}</span>
                <span className="stat-label">Absolvierte Workouts</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {Math.round(workoutHistory.reduce((acc, workout) => 
                    acc + (workout.duration || 0), 0) / workoutHistory.length)} min
                </span>
                <span className="stat-label">Durchschnittliche Dauer</span>
              </div>
            </div>

            <h3>Trainingsverlauf</h3>
            <div className="history-list">
              {workoutHistory.map(workout => (
                <div key={workout.id} className="history-item">
                  <div className="history-header">
                    <h4>{workout.name || 'Workout'}</h4>
                    <span className="history-date">
                      {new Date(workout.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="history-details">
                    <span>Dauer: {workout.duration} min</span>
                    <span>Übungen: {workout.exercises?.length || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-data">
            <p>Noch keine Trainingsdaten vorhanden.</p>
            <p>Starte dein erstes Workout, um deinen Fortschritt zu verfolgen!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress; 