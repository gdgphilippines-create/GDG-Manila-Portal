const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { ROLES } = require('../config/gdg-constants');
const { findUserInCSV } = require('../utils/csvHelper');

const db = admin.firestore();

router.post('/verify', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check VIP Lists from Config
    let role = null;
    if (ROLES.ORGANIZERS.includes(cleanEmail)) role = 'admin';
    else if (ROLES.FACILITATORS.includes(cleanEmail)) role = 'facilitator';

    let attendeeRecord = null;

    // 2. If not VIP, check GCS via Helper
    if (!role) {
      attendeeRecord = await findUserInCSV(cleanEmail);
      if (!attendeeRecord) {
        return res.status(403).json({ success: false, message: 'Email not found.' });
      }

      const isAccepted = attendeeRecord['Tickets Released?']?.toLowerCase() === 'true';
      if (!isAccepted) {
        return res.status(403).json({ success: false, message: 'Registration pending.' });
      }
      role = 'participant';
    }

    // 3. Sync & Respond
    const userRef = db.collection('users').doc(cleanEmail);
    const userData = {
      email: cleanEmail,
      role: role,
      firstName: attendeeRecord ? attendeeRecord['First Name'] : 'Organizer',
      attendance: true,
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.set(userData, { merge: true });
    res.status(200).json({ success: true, user: { email: cleanEmail, role, firstName: userData.firstName } });

  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;