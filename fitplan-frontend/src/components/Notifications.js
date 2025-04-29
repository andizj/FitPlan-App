import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError('Bitte melden Sie sich an');
          return;
        }

        const notificationsRef = collection(db, 'users', user.uid, 'notifications');
        const q = query(
          notificationsRef,
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const notificationsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        
        setNotifications(notificationsList);
      } catch (err) {
        console.error('Fehler beim Laden der Benachrichtigungen:', err);
        setError('Fehler beim Laden der Benachrichtigungen');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });

      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (err) {
      console.error('Fehler beim Markieren der Benachrichtigung:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const unreadNotifications = notifications.filter(notification => !notification.read);
      
      const updatePromises = unreadNotifications.map(notification => {
        const notificationRef = doc(db, 'users', user.uid, 'notifications', notification.id);
        return updateDoc(notificationRef, { read: true });
      });
      
      await Promise.all(updatePromises);
      
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (err) {
      console.error('Fehler beim Markieren aller Benachrichtigungen:', err);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <div className="notifications-container">Lade Benachrichtigungen...</div>;
  }

  if (error) {
    return <div className="notifications-container error">{error}</div>;
  }

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Benachrichtigungen</h2>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="mark-all-read-btn">
            Alle als gelesen markieren
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>Du hast keine Benachrichtigungen.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">{formatDate(notification.createdAt)}</span>
              </div>
              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification.id)}
                  className="mark-read-btn"
                >
                  Als gelesen markieren
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 