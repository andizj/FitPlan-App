import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './WorkoutDetail.css';

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError('Bitte melden Sie sich an');
          return;
        }

        const workoutRef = doc(db, 'users', user.uid, 'workouts', workoutId);
        const workoutDoc = await getDoc(workoutRef);

        if (workoutDoc.exists()) {
          setWorkout({ id: workoutDoc.id, ...workoutDoc.data() });
          setEditedWorkout({ id: workoutDoc.id, ...workoutDoc.data() });
        } else {
          setError('Workout nicht gefunden');
        }
      } catch (err) {
        setError('Fehler beim Laden des Workouts');
        console.error('Error fetching workout:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError('Bitte melden Sie sich an');
        return;
      }

      const workoutRef = doc(db, 'users', user.uid, 'workouts', workoutId);
      await updateDoc(workoutRef, {
        name: editedWorkout.name,
        description: editedWorkout.description,
        level: editedWorkout.level,
        duration: editedWorkout.duration,
        exercises: editedWorkout.exercises,
        updatedAt: new Date()
      });

      setWorkout(editedWorkout);
      setIsEditing(false);
    } catch (err) {
      setError('Fehler beim Speichern des Workouts');
      console.error('Error updating workout:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Möchten Sie dieses Workout wirklich löschen?')) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError('Bitte melden Sie sich an');
          return;
        }

        const workoutRef = doc(db, 'users', user.uid, 'workouts', workoutId);
        await deleteDoc(workoutRef);
        navigate('/workouts');
      } catch (err) {
        setError('Fehler beim Löschen des Workouts');
        console.error('Error deleting workout:', err);
      }
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...editedWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setEditedWorkout({
      ...editedWorkout,
      exercises: updatedExercises
    });
  };

  if (loading) {
    return <div className="workout-detail-container">Laden...</div>;
  }

  if (error) {
    return <div className="workout-detail-container error">{error}</div>;
  }

  if (!workout) {
    return <div className="workout-detail-container">Workout nicht gefunden</div>;
  }

  return (
    <div className="workout-detail-container">
      <div className="workout-detail-header">
        <h2>{isEditing ? (
          <input
            type="text"
            value={editedWorkout.name}
            onChange={(e) => setEditedWorkout({ ...editedWorkout, name: e.target.value })}
            className="edit-input"
          />
        ) : workout.name}</h2>
        <div className="workout-detail-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-btn">Speichern</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Abbrechen</button>
            </>
          ) : (
            <>
              <button onClick={handleEdit} className="edit-btn">Bearbeiten</button>
              <button onClick={handleDelete} className="delete-btn">Löschen</button>
            </>
          )}
        </div>
      </div>

      <div className="workout-detail-meta">
        <span className="workout-level">{workout.level}</span>
        <span className="workout-duration">{workout.duration} Minuten</span>
      </div>

      <div className="workout-detail-description">
        {isEditing ? (
          <textarea
            value={editedWorkout.description}
            onChange={(e) => setEditedWorkout({ ...editedWorkout, description: e.target.value })}
            className="edit-textarea"
          />
        ) : (
          <p>{workout.description}</p>
        )}
      </div>

      <div className="exercises-section">
        <h3>Übungen</h3>
        <div className="exercises-list">
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="exercise-item">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedWorkout.exercises[index].name}
                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                    className="edit-input"
                    placeholder="Übungsname"
                  />
                  <input
                    type="text"
                    value={editedWorkout.exercises[index].sets}
                    onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                    className="edit-input"
                    placeholder="Sätze"
                  />
                  <input
                    type="text"
                    value={editedWorkout.exercises[index].reps}
                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                    className="edit-input"
                    placeholder="Wiederholungen"
                  />
                </>
              ) : (
                <>
                  <h4>{exercise.name}</h4>
                  <p>{exercise.sets} Sätze × {exercise.reps} Wiederholungen</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail; 