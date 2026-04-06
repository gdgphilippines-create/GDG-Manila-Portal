import express from 'express';
import admin from 'firebase-admin';
// NEW: Import the auth middleware
import { requireAuth } from './middleware/require-auth.js'; 

admin.initializeApp({
    serviceAccountId: 'portal-backend-sa@gdg-mnl-portal.iam.gserviceaccount.com'
});
const db = admin.firestore();
const sharedStateCache = new Map();
const SHARED_STATE_COLLECTION = 'portalState';

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-device-id');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());

async function readSharedState(key, defaultValue) {
    const cachedValue = sharedStateCache.has(key) ? sharedStateCache.get(key) : defaultValue;

    try {
        const snapshot = await db.collection(SHARED_STATE_COLLECTION).doc(key).get();

        if (!snapshot.exists) {
            return cachedValue;
        }

        const value = snapshot.data()?.value;
        if (value === undefined) {
            return cachedValue;
        }

        sharedStateCache.set(key, value);
        return value;
    } catch (error) {
        console.error(`Failed to read shared state for ${key}:`, error);
        return cachedValue;
    }
}

async function writeSharedState(key, value) {
    sharedStateCache.set(key, value);

    try {
        await db.collection(SHARED_STATE_COLLECTION).doc(key).set({
            value,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error(`Failed to write shared state for ${key}:`, error);
    }

    return value;
}

function normalizeProgramPayload(payload = {}) {
    return {
        eventDraft:
            payload.eventDraft && typeof payload.eventDraft === 'object' && !Array.isArray(payload.eventDraft)
                ? payload.eventDraft
                : {},
        sessions: Array.isArray(payload.sessions) ? payload.sessions : []
    };
}

function normalizeAlertPayload(payload = {}) {
    return {
        ...payload,
        id: String(payload.id || '').trim()
    };
}

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// 1. The Email Checker
app.post('/api/auth/check-email', async (req, res) => {
    const { email } = req.body;
    
    // Check your Firestore 'users' collection (your uploaded CSV data)
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    
    if (userSnapshot.empty) {
        return res.status(404).json({ error: 'Email not found on the guest list.' });
    }

    const userData = userSnapshot.docs[0].data();
    
    // Tell the frontend what to do next
    res.json({ 
        success: true, 
        role: userData.role,
        requiresPassword: userData.role === 'admin' 
    });
});

// 2. Updated Participant/Admin Login Logic
app.post('/api/auth/participant-login', async (req, res) => {
    try {
        const { email, deviceId } = req.body;

        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (userSnapshot.empty) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // THE FIX: If they are an admin in Firestore, 
        // we officially "stamp" their Firebase Auth account right now.
        if (userData.role === 'admin') {
            const userRecord = await admin.auth().getUserByEmail(email);
            await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
        }

        // Save the new Device ID to enforce the 1-device limit
        await userDoc.ref.update({ activeDeviceId: deviceId });

        const customToken = await admin.auth().createCustomToken(email, { role: userData.role });

        res.json({ success: true, customToken });

    } catch (error) {
        // THE SAFETY NET: If Firebase panics, the server stays alive and logs the exact reason!
        console.error('Login Error / Participant Login Crash Prevented:', error);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.message // This tells us the exact missing setting!
        });
    }
});

// 3. Admin Update Device (Protected)
app.post('/api/auth/update-device', requireAuth, async (req, res) => {
    const { email, deviceId } = req.body;
    
    // We already know they are authenticated because of requireAuth
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (!userSnapshot.empty) {
        await userSnapshot.docs[0].ref.update({ activeDeviceId: deviceId });
    }
    
    res.json({ success: true });
});

// The frontend calls this to confirm login. requireAuth ensures the token is valid.
app.post('/api/auth/verify', requireAuth, async (req, res) => {
    try {
        const email = req.user.email || req.user.uid;
        
        // Fetch their actual role from our Firestore Guest List
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        
        let role = 'participant'; // Default fallback
        if (!userSnapshot.empty) {
            role = userSnapshot.docs[0].data().role;
        }

        res.json({ 
            success: true, 
            user: {
                email: email,
                uid: req.user.uid,
                role: role // Explicitly send the role to the frontend router!
            }
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ success: false, error: 'Failed to verify user.' });
    }
});

// Webhook endpoint (Unprotected, intended for external services)
app.post('/webhook/registration', async (req, res) => {
    try {
        const { userEmail, status } = req.body;

        if (!userEmail) {
            return res.status(400).send('Missing user email');
        }

        await db.collection('registrations').doc(userEmail).set({
            status: status || 'registered',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`Successfully updated registration for: ${userEmail}`);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error updating Firestore:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET endpoints remain unprotected so attendees can read data
app.get('/api/schedule', async (_req, res) => {
    const program = await readSharedState('program', normalizeProgramPayload());
    res.json(normalizeProgramPayload(program));
});

app.get('/api/program', async (_req, res) => {
    const program = await readSharedState('program', normalizeProgramPayload());
    res.json(normalizeProgramPayload(program));
});

app.get('/api/alerts', async (_req, res) => {
    const alerts = await readSharedState('alerts', []);
    res.json(Array.isArray(alerts) ? alerts : []);
});

// Protected PUT/DELETE endpoints (requireAuth added)
app.put('/api/program', requireAuth, async (req, res) => {
    const nextProgram = normalizeProgramPayload(req.body);
    const savedProgram = await writeSharedState('program', nextProgram);
    res.json(savedProgram);
});

app.put('/api/alerts', requireAuth, async (req, res) => {
    const nextAlert = normalizeAlertPayload(req.body);

    if (!nextAlert.id) {
        return res.status(400).json({ error: 'Alert id is required' });
    }

    const existingAlerts = await readSharedState('alerts', []);
    const normalizedAlerts = Array.isArray(existingAlerts) ? existingAlerts : [];
    const hasExisting = normalizedAlerts.some((alert) => alert.id === nextAlert.id);
    const nextAlerts = hasExisting
        ? normalizedAlerts.map((alert) => (alert.id === nextAlert.id ? nextAlert : alert))
        : [...normalizedAlerts, nextAlert];

    await writeSharedState('alerts', nextAlerts);
    res.json(nextAlert);
});

app.delete('/api/alerts/:alertId', requireAuth, async (req, res) => {
    const existingAlerts = await readSharedState('alerts', []);
    const normalizedAlerts = Array.isArray(existingAlerts) ? existingAlerts : [];
    const nextAlerts = normalizedAlerts.filter((alert) => alert.id !== req.params.alertId);

    await writeSharedState('alerts', nextAlerts);
    res.status(204).end();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});