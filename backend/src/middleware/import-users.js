import fs from 'fs';
import csv from 'csv-parser';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const csvFilePath = './event-participants/participants-bwai-d2.csv'; // change depending on the event

async function uploadUsers() {
    console.log('Starting CSV Import...');
    let count = 0;

    // Read the CSV file
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', async (row) => {
            const email = row.email.trim().toLowerCase();
            const role = row.role.trim().toLowerCase();

            if (email && role) {
                try {
                    // We use the email as the Document ID so there are never duplicates
                    await db.collection('users').doc(email).set({
                        email: email,
                        role: role,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`✅ Added: ${email} as ${role}`);
                    count++;
                } catch (error) {
                    console.error(`Failed to add ${email}:`, error);
                }
            }
        })
        .on('end', () => {
            console.log(`Import process finished! Read ${count} rows.`);
        });
}

uploadUsers();