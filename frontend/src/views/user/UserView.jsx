import React, { useState, useEffect } from 'react';
import { db } from '../../api/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function UserView() {
  const [currentView, setCurrentView] = useState('loading');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "appConfig", "global"), (doc) => {
      if (doc.exists()) {
        setCurrentView(doc.data().activeRoute);
      }
    });
    return () => unsub(); // Cleanup listener on unmount
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {currentView === 'waiting' && <h1>The event will start shortly... ⏳</h1>}
      {currentView === 'live' && <h1>🎥 LIVE: Welcome to the Main Stage!</h1>}
      {currentView === 'ended' && <h1>The event has concluded. Thank you!</h1>}
      {currentView === 'loading' && <p>Connecting to stream...</p>}
    </div>
  );
}
