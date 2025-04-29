import React from 'react';

const ProgressTracker = () => {
  return (
    <div className="progress-tracker">
      <h2>Dein Fortschritt</h2>
      <div className="progress-stats">
        <div className="progress-item">
          <h3>Trainingseinheiten</h3>
          <p>0 abgeschlossen</p>
        </div>
        <div className="progress-item">
          <h3>Aktuelle Serie</h3>
          <p>0 Tage in Folge</p>
        </div>
        <div className="progress-item">
          <h3>Gesamtzeit</h3>
          <p>0 Minuten</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 