import React from 'react';
import { db } from '../../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function AdminView() {
  const updateGlobalView = async (newView) => {
    const docRef = doc(db, "appConfig", "global");
    await updateDoc(docRef, { activeRoute: newView });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Event Control Center</h2>
      <button onClick={() => updateGlobalView('waiting')}>Set to Waiting Room</button>
      <button onClick={() => updateGlobalView('live')}>Start Live Event</button>
      <button onClick={() => updateGlobalView('ended')}>End Event</button>
    </div>
  );
}
