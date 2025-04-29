import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './WorkoutPlanGenerator.css';

const exercisesByLevel = {
  beginner: {
    weightLoss: [
      { name: 'Jumping Jacks', sets: 2, reps: '30 Sekunden', type: 'Cardio', level: 'Anfänger' },
      { name: 'Kniebeuge', sets: 2, reps: '10', type: 'HIIT', level: 'Anfänger' },
      { name: 'Bergsteiger', sets: 2, reps: '20 Sekunden', type: 'Cardio', level: 'Anfänger' },
      { name: 'Marschieren auf der Stelle', sets: 2, reps: '1 Minute', type: 'Cardio', level: 'Anfänger' },
      { name: 'Knie heben', sets: 2, reps: '20 Sekunden', type: 'HIIT', level: 'Anfänger' }
    ],
    muscleGain: [
      { name: 'Kniebeuge ohne Gewicht', sets: 3, reps: '10', type: 'Kraft', level: 'Anfänger' },
      { name: 'Liegestütze auf Knien', sets: 3, reps: '8', type: 'Kraft', level: 'Anfänger' },
      { name: 'Wandklimmzüge', sets: 2, reps: '8', type: 'Kraft', level: 'Anfänger' },
      { name: 'Planks', sets: 2, reps: '20 Sekunden', type: 'Kraft', level: 'Anfänger' },
      { name: 'Negative Liegestütze', sets: 2, reps: '5', type: 'Kraft', level: 'Anfänger' }
    ],
    endurance: [
      { name: 'Gehen', sets: 1, reps: '20 Minuten', type: 'Cardio', level: 'Anfänger' },
      { name: 'Leichtes Radfahren', sets: 1, reps: '15 Minuten', type: 'Cardio', level: 'Anfänger' },
      { name: 'Schwimmen im eigenen Tempo', sets: 1, reps: '10 Minuten', type: 'Cardio', level: 'Anfänger' },
      { name: 'Ausfallschritte', sets: 2, reps: '10 pro Bein', type: 'Ausdauer', level: 'Anfänger' },
      { name: 'Step-Ups niedrig', sets: 2, reps: '10 pro Bein', type: 'Ausdauer', level: 'Anfänger' }
    ]
  },
  intermediate: {
    weightLoss: [
      { name: 'Burpees', sets: 3, reps: '12', type: 'HIIT', level: 'Fortgeschritten' },
      { name: 'Mountain Climbers', sets: 3, reps: '45 Sekunden', type: 'Cardio', level: 'Fortgeschritten' },
      { name: 'Seilspringen', sets: 3, reps: '2 Minuten', type: 'Cardio', level: 'Fortgeschritten' },
      { name: 'High Knees', sets: 3, reps: '45 Sekunden', type: 'HIIT', level: 'Fortgeschritten' },
      { name: 'Box Jumps', sets: 3, reps: '15', type: 'HIIT', level: 'Fortgeschritten' }
    ],
    muscleGain: [
      { name: 'Liegestütze', sets: 4, reps: '15', type: 'Kraft', level: 'Fortgeschritten' },
      { name: 'Klimmzüge mit Widerstandsband', sets: 3, reps: '10', type: 'Kraft', level: 'Fortgeschritten' },
      { name: 'Dips', sets: 3, reps: '12', type: 'Kraft', level: 'Fortgeschritten' },
      { name: 'Pike Push-Ups', sets: 3, reps: '10', type: 'Kraft', level: 'Fortgeschritten' },
      { name: 'Diamond Push-Ups', sets: 3, reps: '12', type: 'Kraft', level: 'Fortgeschritten' }
    ],
    endurance: [
      { name: 'Intervall-Laufen', sets: 1, reps: '30 Minuten', type: 'Cardio', level: 'Fortgeschritten' },
      { name: 'HIIT Radfahren', sets: 1, reps: '25 Minuten', type: 'Cardio', level: 'Fortgeschritten' },
      { name: 'Schwimmen mit Intervallen', sets: 1, reps: '30 Minuten', type: 'Cardio', level: 'Fortgeschritten' },
      { name: 'Jumping Lunges', sets: 3, reps: '20 pro Bein', type: 'Ausdauer', level: 'Fortgeschritten' },
      { name: 'Box Step-Ups', sets: 3, reps: '15 pro Bein', type: 'Ausdauer', level: 'Fortgeschritten' }
    ]
  },
  advanced: {
    weightLoss: [
      { name: 'Burpee Pull-Ups', sets: 4, reps: '10', type: 'HIIT', level: 'Experte' },
      { name: 'Double Unders', sets: 4, reps: '50', type: 'Cardio', level: 'Experte' },
      { name: 'Handstand Push-Ups', sets: 3, reps: '8', type: 'HIIT', level: 'Experte' },
      { name: 'Muscle-Ups', sets: 3, reps: '5', type: 'HIIT', level: 'Experte' },
      { name: 'Pistol Squats', sets: 3, reps: '8 pro Bein', type: 'HIIT', level: 'Experte' }
    ],
    muscleGain: [
      { name: 'One Arm Push-Ups', sets: 4, reps: '5 pro Seite', type: 'Kraft', level: 'Experte' },
      { name: 'Muscle-Ups', sets: 4, reps: '8', type: 'Kraft', level: 'Experte' },
      { name: 'Front Lever Holds', sets: 3, reps: '20 Sekunden', type: 'Kraft', level: 'Experte' },
      { name: 'Planche Push-Ups', sets: 3, reps: '5', type: 'Kraft', level: 'Experte' },
      { name: 'Human Flag Holds', sets: 3, reps: '15 Sekunden', type: 'Kraft', level: 'Experte' }
    ],
    endurance: [
      { name: 'Tabata-Training', sets: 8, reps: '20/10 Sekunden', type: 'Cardio', level: 'Experte' },
      { name: 'CrossFit WOD', sets: 1, reps: '45 Minuten', type: 'Cardio', level: 'Experte' },
      { name: 'Triathlon-Training', sets: 1, reps: '60 Minuten', type: 'Cardio', level: 'Experte' },
      { name: 'Plyometrische Übungen', sets: 4, reps: '30 Sekunden', type: 'Ausdauer', level: 'Experte' },
      { name: 'Complex Movements', sets: 4, reps: '45 Sekunden', type: 'Ausdauer', level: 'Experte' }
    ]
  }
};

const WorkoutPlanGenerator = () => {
  const [userGoal, setUserGoal] = useState('');
  const [userLevel, setUserLevel] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserGoal(userData.fitnessGoal);
          setUserLevel(userData.fitnessLevel || 'beginner'); // Standardmäßig Anfänger
        }
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden des Benutzerprofils');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const generatePlan = async () => {
    try {
      let exercises;
      const level = userLevel || 'beginner';
      
      switch (userGoal) {
        case 'abnehmen':
          exercises = exercisesByLevel[level].weightLoss;
          break;
        case 'muskelaufbau':
          exercises = exercisesByLevel[level].muscleGain;
          break;
        case 'ausdauer':
          exercises = exercisesByLevel[level].endurance;
          break;
        default:
          exercises = exercisesByLevel[level].weightLoss;
      }

      const newPlan = {
        goal: userGoal,
        level: level,
        exercises: exercises,
        createdAt: new Date().toISOString(),
      };

      // Speichere den Plan in Firestore
      const auth = getAuth();
      const db = getFirestore();
      await setDoc(doc(db, 'users', auth.currentUser.uid, 'workoutPlans', 'current'), newPlan);

      setGeneratedPlan(newPlan);
    } catch (err) {
      setError('Fehler beim Generieren des Trainingsplans');
    }
  };

  if (loading) {
    return <div className="loading">Lade...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="workout-generator">
      <h2>Trainingsplan Generator</h2>
      <div className="goal-info">
        <p>Dein Fitnessziel: <strong>{userGoal}</strong></p>
        <p>Dein Level: <strong>{userLevel === 'beginner' ? 'Anfänger' : 
                               userLevel === 'intermediate' ? 'Fortgeschritten' : 
                               'Experte'}</strong></p>
        <button onClick={generatePlan} className="generate-button">
          Trainingsplan erstellen
        </button>
      </div>

      {generatedPlan && (
        <div className="workout-plan">
          <h3>Dein personalisierter Trainingsplan</h3>
          <div className="exercises-list">
            {generatedPlan.exercises.map((exercise, index) => (
              <div key={index} className="exercise-card">
                <h4>{exercise.name}</h4>
                <p className="exercise-type">{exercise.type}</p>
                <p className="exercise-level">{exercise.level}</p>
                <div className="exercise-details">
                  <span>{exercise.sets} Sätze</span>
                  <span>{exercise.reps}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanGenerator; 