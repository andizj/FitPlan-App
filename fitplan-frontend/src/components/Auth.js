import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Erstelle ein neues Benutzerdokument in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          setupCompleted: false
        });
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Kein Benutzer mit dieser E-Mail-Adresse gefunden.');
          break;
        case 'auth/wrong-password':
          setError('Falsches Passwort.');
          break;
        case 'auth/email-already-in-use':
          setError('Diese E-Mail-Adresse wird bereits verwendet.');
          break;
        case 'auth/weak-password':
          setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
          break;
        case 'auth/invalid-email':
          setError('Ungültige E-Mail-Adresse.');
          break;
        default:
          setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Überprüfe, ob der Benutzer bereits existiert
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Erstelle ein neues Benutzerdokument für Google-Benutzer
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
          setupCompleted: false
        });
      }
    } catch (error) {
      setError('Bei der Anmeldung mit Google ist ein Fehler aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">💪</span>
            <span className="logo-text">FitPlan</span>
          </Link>
          <h2>{isLogin ? 'Willkommen zurück!' : 'Erstellen Sie ein Konto'}</h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Melden Sie sich an, um Ihre Fitness-Reise fortzusetzen' 
              : 'Registrieren Sie sich, um Ihre Fitness-Reise zu beginnen'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button primary-button"
            disabled={loading}
          >
            {isLogin ? 'Anmelden' : 'Registrieren'}
          </button>
        </form>

        <div className="auth-divider">
          <span>oder</span>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="auth-button google-button"
          disabled={loading}
        >
          <span className="google-icon">G</span>
          Mit Google {isLogin ? 'anmelden' : 'registrieren'}
        </button>

        <div className="auth-footer">
          {isLogin ? (
            <>
              Noch kein Konto?{' '}
              <a href="#" onClick={() => setIsLogin(false)}>
                Registrieren
              </a>
            </>
          ) : (
            <>
              Bereits registriert?{' '}
              <a href="#" onClick={() => setIsLogin(true)}>
                Anmelden
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 