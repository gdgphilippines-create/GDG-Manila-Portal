const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { ROLES } = require('../config/gdg-constants'); // Import the VIP list

const db = admin.firestore();

// 1. POST an Alert (Admin Only)
router.post('/', async (req, res) => {
  try {
    const { email, message, type } = req.body;

    // Security Check: Use the central config list
    if (!ROLES.ORGANIZERS.includes(email?.toLowerCase().trim())) {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    const alertData = {
      message: message,
      type: type || 'info',
      active: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: email
    };

    await db.collection('metadata').doc('current_alert').set(alertData);

    console.log(`📢 Alert broadcasted by ${email}`);
    res.status(200).json({ success: true, message: 'Alert posted.' });

  } catch (error) {
    console.error('Alert Error:', error);
    res.status(500).json({ error: 'Failed to post alert.' });
  }
});

// 2. GET the current Alert (Public)
router.get('/', async (req, res) => {
  try {
    const alertDoc = await db.collection('metadata').doc('current_alert').get();
    
    if (!alertDoc.exists || !alertDoc.data().active) {
      return res.status(200).json({ active: false });
    }

    res.status(200).json(alertDoc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts.' });
  }
});

module.exports = router;