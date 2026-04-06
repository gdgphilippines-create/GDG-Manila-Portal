import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/services/api/client'

const VIEW_DOC_PATH = 'portalState/activeView'

export const firebaseProvider = {
  async getActiveView() {
    const docRef = doc(db, VIEW_DOC_PATH)
    const snap = await getDoc(docRef)
    return snap.exists() ? snap.data().value : 'waiting' // Defaults to waiting
  },

  async setActiveView(view) {
    const docRef = doc(db, VIEW_DOC_PATH)
    // We use the same { value, updatedAt } structure your backend uses!
    await setDoc(docRef, { 
      value: view, 
      updatedAt: new Date() 
    }, { merge: true })
    
    return view
  },

  subscribe(callback) {
    const docRef = doc(db, VIEW_DOC_PATH)
    
    // THIS IS THE REAL-TIME MAGIC!
    // Whenever the Admin updates Firestore, this pushes the new state to all Participants instantly.
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data().value)
      }
    })
  },
}
