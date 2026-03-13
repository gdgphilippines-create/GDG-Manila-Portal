import admin from 'firebase-admin';

/**
 * Initialize the Firebase Admin SDK.
 * On Cloud Run, this automatically uses the service account 
 * attached to the container (Application Default Credentials).
 */
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Export the Firestore instance
export const db = admin.firestore();

// Export the Auth instance (useful for verifying tokens or setting admin claims)
export const auth = admin.auth();

// Export the base admin object for helper functions (like FieldValue.serverTimestamp)
export default admin;
