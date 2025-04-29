import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Kein Benutzer angemeldet');
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFormData(data);
        } else {
          setError('Benutzerdaten nicht gefunden');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        setError('Fehler beim Laden der Benutzerdaten');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Kein Benutzer angemeldet');
        return;
      }

      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: new Date()
      });

      setUserData(formData);
      setEditing(false);
      setError(null);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Profils:', error);
      setError('Fehler beim Speichern der Änderungen');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
      setError('Fehler beim Ausloggen');
    }
  };

  if (loading) {
    return <div className="profile-container">Lade Profil...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-container">Keine Benutzerdaten gefunden</div>;
  }

  return (
    <div className="profile-container">
      <h2>Mein Profil</h2>
      
      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-section">
            <h3>Persönliche Daten</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Gewicht (kg):</label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Größe (cm):</label>
              <input
                type="number"
                name="height"
                value={formData.height || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Alter:</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="profile-section">
            <h3>Trainingsziele</h3>
            <div className="form-group">
              <label>Fitnessziel:</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal || ''}
                onChange={handleInputChange}
              >
                <option value="">Bitte wählen</option>
                <option value="Muskelaufbau">Muskelaufbau</option>
                <option value="Ausdauer">Ausdauer</option>
                <option value="Gewichtsverlust">Gewichtsverlust</option>
              </select>
            </div>
            <div className="form-group">
              <label>Erfahrungslevel:</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel || ''}
                onChange={handleInputChange}
              >
                <option value="">Bitte wählen</option>
                <option value="Anfänger">Anfänger</option>
                <option value="Fortgeschritten">Fortgeschritten</option>
                <option value="Experte">Experte</option>
              </select>
            </div>
            <div className="form-group">
              <label>Trainingstage pro Woche:</label>
              <input
                type="number"
                name="trainingDays"
                value={formData.trainingDays || ''}
                onChange={handleInputChange}
                min="1"
                max="7"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">Speichern</button>
            <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>
              Abbrechen
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-section">
            <h3>Persönliche Daten</h3>
            <div className="profile-info">
              <p><strong>Name:</strong> {userData.name || 'Nicht angegeben'}</p>
              <p><strong>E-Mail:</strong> {auth.currentUser?.email}</p>
              <p><strong>Gewicht:</strong> {userData.weight ? `${userData.weight} kg` : 'Nicht angegeben'}</p>
              <p><strong>Größe:</strong> {userData.height ? `${userData.height} cm` : 'Nicht angegeben'}</p>
              <p><strong>Alter:</strong> {userData.age ? `${userData.age} Jahre` : 'Nicht angegeben'}</p>
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Trainingsziele</h3>
            <div className="profile-info">
              <p><strong>Fitnessziel:</strong> {userData.fitnessGoal || 'Nicht angegeben'}</p>
              <p><strong>Erfahrungslevel:</strong> {userData.experienceLevel || 'Nicht angegeben'}</p>
              <p><strong>Trainingstage pro Woche:</strong> {userData.trainingDays || 'Nicht angegeben'}</p>
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Verfügbare Ausrüstung</h3>
            <div className="equipment-list">
              {userData.availableEquipment && userData.availableEquipment.length > 0 ? (
                <ul>
                  {userData.availableEquipment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>Keine Ausrüstung angegeben</p>
              )}
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={() => setEditing(true)}>
              Profil bearbeiten
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Ausloggen
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile; 