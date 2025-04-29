import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './Workouts.css';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (!user) {
          setError('Benutzer nicht angemeldet');
          return;
        }

        const workoutsRef = collection(db, 'workouts');
        const q = query(workoutsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const workoutData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setWorkouts(workoutData);
      } catch (error) {
        console.error('Fehler beim Laden der Workouts:', error);
        setError('Fehler beim Laden der Workouts');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return <div className="loading">Lade Workouts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="workouts-container">
      <h1>Meine Workouts</h1>
      
      {workouts.length === 0 ? (
        <div className="no-workouts">
          <p>Du hast noch keine Workouts erstellt.</p>
          <button className="create-workout-button">
            Erstelle dein erstes Workout
          </button>
        </div>
      ) : (
        <div className="workouts-grid">
          {workouts.map(workout => (
            <div key={workout.id} className="workout-card">
              <div className="workout-header">
                <h3>{workout.name}</h3>
                <span className="workout-type">{workout.type}</span>
              </div>
              <div className="workout-info">
                <p>{workout.description}</p>
                <div className="workout-meta">
                  <span>🕒 {workout.duration} Min</span>
                  <span>💪 {workout.exercises?.length || 0} Übungen</span>
                </div>
              </div>
              <div className="workout-footer">
                <button className="start-workout">Workout starten</button>
                <button className="edit-workout">Bearbeiten</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workouts; 