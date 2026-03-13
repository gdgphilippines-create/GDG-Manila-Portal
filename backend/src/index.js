import express from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin (Uses Application Default Credentials on Cloud Run)
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
