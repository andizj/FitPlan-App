import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Workout.css';

const Workout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError('Bitte melden Sie sich an');
          return;
        }

        const workoutsRef = collection(db, 'users', user.uid, 'workouts');
        const querySnapshot = await getDocs(workoutsRef);
        
        const workoutsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setWorkouts(workoutsList);
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
    return <div className="workout-container">Lade Workouts...</div>;
  }

  if (error) {
    return <div className="workout-container error">{error}</div>;
  }

  return (
    <div className="workout-container">
      <h2>Meine Workouts</h2>
      
      {workouts.length === 0 ? (
        <div className="no-workouts">
          <p>Du hast noch keine Workouts erstellt.</p>
          <Link to="/create-plan" className="create-workout-btn">
            Workout erstellen
          </Link>
        </div>
      ) : (
        <div className="workouts-list">
          {workouts.map(workout => (
            <Link 
              to={`/workout/${workout.id}`} 
              key={workout.id} 
              className="workout-card"
            >
              <div className="workout-card-header">
                <h3>{workout.name}</h3>
                <span className="workout-level">{workout.level}</span>
              </div>
              
              <div className="workout-card-meta">
                <span className="workout-duration">{workout.duration} Minuten</span>
                <span className="workout-exercises">
                  {workout.exercises ? workout.exercises.length : 0} Übungen
                </span>
              </div>
              
              <div className="workout-card-description">
                <p>{workout.description}</p>
              </div>
              
              <div className="workout-card-footer">
                <span className="workout-date">
                  Erstellt am: {new Date(workout.createdAt?.toDate()).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
          
          <Link to="/create-plan" className="create-workout-card">
            <div className="create-workout-content">
              <span className="create-workout-icon">+</span>
              <span className="create-workout-text">Neues Workout erstellen</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Workout; 