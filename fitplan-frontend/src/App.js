import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Navigation from './components/Navigation';
import Auth from './components/Auth';
import Welcome from './components/Welcome';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Exercises from './components/Exercises';
import Progress from './components/Progress';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import WorkoutPlanGenerator from './components/WorkoutPlanGenerator';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupCompleted, setSetupCompleted] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          console.log('User doc exists:', userDoc.exists(), 'Setup completed:', userDoc.data()?.setupCompleted);
          setSetupCompleted(userDoc.exists() && userDoc.data().setupCompleted);
        } catch (error) {
          console.error('Error checking setup status:', error);
          setSetupCompleted(false);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Laden...</div>;
  }

  return (
    <Router>
      <div className="app">
        {user && <Navigation />}
        <main className="main-content">
          <Routes>
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
            <Route path="/welcome" element={
              user && !setupCompleted ? <Welcome /> : <Navigate to={user ? '/' : '/auth'} />
            } />
            <Route path="/setup" element={
              user && !setupCompleted ? <ProfileSetup /> : <Navigate to={user ? '/' : '/auth'} />
            } />
            
            {/* Root Route */}
            <Route
              path="/"
              element={
                !user ? <Navigate to="/auth" /> :
                !setupCompleted ? <Navigate to="/welcome" /> :
                <Dashboard />
              }
            />
            
            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                user ? (
                  setupCompleted ? (
                    <Navigate to="/" />
                  ) : (
                    <Navigate to="/setup" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/workouts"
              element={
                user ? (
                  setupCompleted ? (
                    <WorkoutPlanGenerator />
                  ) : (
                    <Navigate to="/setup" />
                  )
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />

            <Route
              path="/exercises"
              element={
                user ? (
                  setupCompleted ? (
                    <Exercises />
                  ) : (
                    <Navigate to="/setup" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/progress"
              element={
                user ? (
                  setupCompleted ? (
                    <Progress />
                  ) : (
                    <Navigate to="/setup" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/profile"
              element={
                user ? (
                  setupCompleted ? (
                    <Profile />
                  ) : (
                    <Navigate to="/setup" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;