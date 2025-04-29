import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: '',
    height: 165,
    activityLevel: '',
    weight: '',
    goal: '',
    daysPerWeek: 3
  });
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
    setCurrentStep(2);
  };

  const handleHeightChange = (e) => {
    const height = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, height }));
  };

  const adjustHeight = (increment) => {
    setFormData(prev => ({
      ...prev,
      height: Math.min(Math.max(prev.height + increment, 100), 250)
    }));
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    // Speichere die Referenz zum height-scale Element
    const heightScale = e.target.closest('.height-scale');
    if (heightScale) {
      heightScale.setAttribute('data-height-scale', 'true');
    }
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    
    // Finde das height-scale Element
    const barElement = document.querySelector('.height-scale[data-height-scale="true"]');
    if (!barElement) return;

    let clientY;
    if (e.type === 'touchmove') {
      clientY = e.touches[0].clientY;
    } else {
      clientY = e.clientY;
    }

    const rect = barElement.getBoundingClientRect();
    const barHeight = rect.height;
    const mouseY = clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, mouseY / barHeight));
    
    // Berechne die Höhe basierend auf der Position (250cm bis 100cm)
    const newHeight = Math.round(250 - (percentage * 150));
    setFormData(prev => ({ ...prev, height: newHeight }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Entferne das Attribut
    const heightScale = document.querySelector('.height-scale[data-height-scale="true"]');
    if (heightScale) {
      heightScale.removeAttribute('data-height-scale');
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleTouchMove = (e) => {
        e.preventDefault();
        handleDrag(e);
      };

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging]);

  const getHeightColor = () => {
    return '#9F7AEA';
  };

  const generateHeightMarks = () => {
    const marks = [];
    for (let i = 100; i <= 250; i += 5) {
      if (i % 15 === 0) {
        marks.push(i);
      }
    }
    return marks;
  };

  const heightMarks = generateHeightMarks();

  const handleActivitySelect = (level) => {
    setFormData(prev => ({ ...prev, activityLevel: level }));
    setCurrentStep(4);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        setError('Kein Benutzer angemeldet');
        return;
      }

      // Validiere alle erforderlichen Felder
      if (!formData.gender || !formData.height || !formData.activityLevel || !formData.weight || !formData.goal) {
        setError('Bitte füllen Sie alle Felder aus');
        return;
      }

      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      const userData = {
        ...formData,
        setupCompleted: true,
        updatedAt: new Date().toISOString()
      };

      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, userData);
        } else {
          await setDoc(userDocRef, userData);
        }
        // Überprüfe sofort, ob die Daten gespeichert wurden
        const updatedDoc = await getDoc(userDocRef);
        if (updatedDoc.exists() && updatedDoc.data().setupCompleted) {
          window.location.href = '/dashboard';
        } else {
          throw new Error('Setup-Status konnte nicht aktualisiert werden');
        }
      } catch (updateError) {
        console.error('Fehler beim Aktualisieren:', updateError);
        setError('Fehler beim Speichern der Daten');
      }

    } catch (error) {
      console.error('Fehler beim Speichern der Profildaten:', error);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="setup-step">
            <h2>Was ist dein Geschlecht?</h2>
            <p>Diese Information hilft uns, deinen Trainingsplan zu personalisieren.</p>
            <div className="gender-options">
              <button
                className={`gender-button ${formData.gender === 'male' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('male')}
              >
                <span className="gender-icon">♂️</span>
                <span>Männlich</span>
              </button>
              <button
                className={`gender-button ${formData.gender === 'female' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('female')}
              >
                <span className="gender-icon">♀️</span>
                <span>Weiblich</span>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="setup-step">
            <h2>Wie groß bist du?</h2>
            <p>Deine Größe hilft uns bei der Berechnung deines BMI.</p>
            <div className="height-selector">
              <div className="height-value" style={{ color: getHeightColor() }}>
                {formData.height}<span>cm</span>
              </div>
              <div className="height-scale">
                <div className="height-bar">
                  <div 
                    className="height-indicator" 
                    style={{ top: `${((250 - formData.height) / 150) * 100}%` }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                  ></div>
                </div>
                <div className="height-controls">
                  <button 
                    className="height-button height-up" 
                    onClick={() => adjustHeight(1)}
                    aria-label="Höhe erhöhen"
                  >
                    ▲
                  </button>
                  <button 
                    className="height-button height-down" 
                    onClick={() => adjustHeight(-1)}
                    aria-label="Höhe verringern"
                  >
                    ▼
                  </button>
                </div>
                <div className="height-marks">
                  {heightMarks.map(mark => (
                    <span 
                      key={mark}
                      className={formData.height === mark ? 'active' : ''}
                      style={{ 
                        position: 'absolute',
                        left: '-30px',
                        top: `${((250 - mark) / 150) * 100}%`,
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {mark}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button 
              className="continue-button" 
              onClick={() => setCurrentStep(3)}
            >
              Weiter
            </button>
          </div>
        );

      case 3:
        return (
          <div className="setup-step">
            <h2>Dein Aktivitätslevel</h2>
            <p>Wähle das Level, das am besten zu dir passt.</p>
            <div className="activity-options">
              <button
                className={`activity-button ${formData.activityLevel === 'beginner' ? 'selected' : ''}`}
                onClick={() => handleActivitySelect('beginner')}
              >
                Anfänger
              </button>
              <button
                className={`activity-button ${formData.activityLevel === 'intermediate' ? 'selected' : ''}`}
                onClick={() => handleActivitySelect('intermediate')}
              >
                Fortgeschritten
              </button>
              <button
                className={`activity-button ${formData.activityLevel === 'advanced' ? 'selected' : ''}`}
                onClick={() => handleActivitySelect('advanced')}
              >
                Profi
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="setup-step">
            <h2>Fast geschafft!</h2>
            <p>Lass uns dein Profil vervollständigen.</p>
            <div className="final-form">
              <div className="form-group">
                <label>Gewicht (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="70"
                  min="30"
                  max="250"
                />
              </div>
              <div className="form-group">
                <label>Dein Ziel</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                >
                  <option value="">Wähle dein Ziel</option>
                  <option value="muscle_gain">Muskelaufbau</option>
                  <option value="weight_loss">Gewicht verlieren</option>
                  <option value="endurance">Ausdauer verbessern</option>
                </select>
              </div>
              <div className="form-group">
                <label>Trainingstage pro Woche</label>
                <select
                  value={formData.daysPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, daysPerWeek: parseInt(e.target.value) }))}
                >
                  {[2, 3, 4, 5, 6].map(days => (
                    <option key={days} value={days}>{days} Tage</option>
                  ))}
                </select>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button 
              className="submit-button"
              onClick={handleSubmit}
              disabled={!formData.weight || !formData.goal}
            >
              Profil erstellen
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="setup-progress">
        <div 
          className="progress-bar"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
      {renderStep()}
    </div>
  );
};

export default ProfileSetup; 