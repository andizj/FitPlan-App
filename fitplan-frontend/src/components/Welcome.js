import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "Willkommen bei FitPlan",
      description: "Dein persönlicher Fitness-Begleiter für ein gesünderes Leben.",
      image: "/images/welcome-1.jpg"
    },
    {
      title: "Personalisierter Trainingsplan",
      description: "Erstelle deinen individuellen Trainingsplan basierend auf deinen Zielen und deinem Fitnesslevel.",
      image: "/images/welcome-2.jpg"
    },
    {
      title: "Verfolge deinen Fortschritt",
      description: "Behalte deine Entwicklung im Blick und erreiche deine Ziele Schritt für Schritt.",
      image: "/images/welcome-3.jpg"
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      navigate('/setup');
    }
  };

  const handleSkip = () => {
    navigate('/setup');
  };

  const currentStep = steps[step - 1];

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div 
          className="welcome-image"
          style={{ backgroundImage: `url(${currentStep.image})` }}
        />
        <div className="welcome-text">
          <h1>{currentStep.title}</h1>
          <p>{currentStep.description}</p>
        </div>
        <div className="welcome-controls">
          <div className="step-indicators">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`step-dot ${index + 1 === step ? 'active' : ''}`}
              />
            ))}
          </div>
          <button className="next-button" onClick={handleNext}>
            {step === steps.length ? 'Los geht\'s' : 'Weiter'}
          </button>
          {step < steps.length && (
            <button className="skip-button" onClick={handleSkip}>
              Überspringen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome; 