import express from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin (Uses Application Default Credentials on Cloud Run)
admin.initializeApp();
const db = admin.firestore();
const sharedStateCache = new Map();
const SHARED_STATE_COLLECTION = 'portalState';

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

// Webhook endpoint (e.g., for Bevy or other services)
app.post('/webhook/registration', async (req, res) => {
    try {
        const { userEmail, status } = req.body;

        if (!userEmail) {
            return res.status(400).send('Missing user email');
        }

        // Update the user's registration status in Firestore
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

app.get('/api/program', async (_req, res) => {
    const program = await readSharedState('program', normalizeProgramPayload());
    res.json(normalizeProgramPayload(program));
});

app.put('/api/program', async (req, res) => {
    const nextProgram = normalizeProgramPayload(req.body);
    const savedProgram = await writeSharedState('program', nextProgram);
    res.json(savedProgram);
});

app.get('/api/alerts', async (_req, res) => {
    const alerts = await readSharedState('alerts', []);
    res.json(Array.isArray(alerts) ? alerts : []);
});

app.put('/api/alerts', async (req, res) => {
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

app.delete('/api/alerts/:alertId', async (req, res) => {
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
