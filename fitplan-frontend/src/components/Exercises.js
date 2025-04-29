import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './Exercises.css';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const db = getFirestore();
        const exercisesRef = collection(db, 'exercises');
        const querySnapshot = await getDocs(exercisesRef);
        
        const exerciseData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setExercises(exerciseData);
      } catch (error) {
        console.error('Fehler beim Laden der Übungen:', error);
        setError('Fehler beim Laden der Übungen');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(exercise => {
    const name = exercise.name || '';
    const description = exercise.description || '';
    const matchesFilter = filter === 'all' || exercise.category === filter;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Lade Übungen...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="exercises-container">
      <div className="exercises-header">
        <h1>Übungskatalog</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Übung suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Alle
        </button>
        <button
          className={`filter-button ${filter === 'strength' ? 'active' : ''}`}
          onClick={() => setFilter('strength')}
        >
          Kraft
        </button>
        <button
          className={`filter-button ${filter === 'cardio' ? 'active' : ''}`}
          onClick={() => setFilter('cardio')}
        >
          Cardio
        </button>
        <button
          className={`filter-button ${filter === 'flexibility' ? 'active' : ''}`}
          onClick={() => setFilter('flexibility')}
        >
          Beweglichkeit
        </button>
      </div>

      <div className="exercises-grid">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-image">
              {exercise.imageUrl ? (
                <img src={exercise.imageUrl} alt={exercise.name} />
              ) : (
                <div className="placeholder-image">🏋️</div>
              )}
            </div>
            <div className="exercise-content">
              <h3>{exercise.name}</h3>
              <span className="exercise-category">{exercise.category}</span>
              <p>{exercise.description}</p>
              <div className="exercise-meta">
                <span>🎯 {exercise.targetMuscle}</span>
                <span>⚡ {exercise.difficulty}</span>
              </div>
            </div>
            <button className="view-details">Details anzeigen</button>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="no-results">
          <p>Keine Übungen gefunden.</p>
        </div>
      )}
    </div>
  );
};

export default Exercises; 