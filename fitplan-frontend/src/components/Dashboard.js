import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './Dashboard.css';

const Dashboard = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const planDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'workoutPlans', 'current'));
        
        if (planDoc.exists()) {
          setCurrentPlan(planDoc.data());
        }
      } catch (err) {
        console.error('Fehler beim Laden des Trainingsplans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  return (
    <div className="dashboard">
      <h1>Willkommen bei FitPlan</h1>
      
      {currentPlan ? (
        <div className="current-plan-section">
          <h2>Dein aktueller Trainingsplan</h2>
          <div className="plan-summary">
            <p>Ziel: {currentPlan.goal}</p>
            <p>Level: {currentPlan.level === 'beginner' ? 'Anfänger' : 
                      currentPlan.level === 'intermediate' ? 'Fortgeschritten' : 
                      'Experte'}</p>
            <p>Erstellt am: {new Date(currentPlan.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="quick-exercises">
            <h3>Heutige Übungen:</h3>
            <div className="exercises-preview">
              {currentPlan.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="exercise-preview-card">
                  <h4>{exercise.name}</h4>
                  <p>{exercise.sets} Sätze × {exercise.reps}</p>
                </div>
              ))}
            </div>
            <Link to="/workouts" className="view-all-button">
              Alle Übungen anzeigen
            </Link>
          </div>
        </div>
      ) : !loading && (
        <div className="no-plan-message">
          <p>Du hast noch keinen aktiven Trainingsplan.</p>
          <Link to="/workouts" className="create-plan-button">
            Jetzt Trainingsplan erstellen
          </Link>
        </div>
      )}

      
     
    </div>
  );
};

export default Dashboard; 