const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// GET /api/schedule - Fetch the full event timeline
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('program').orderBy('startTime', 'asc').get();
    
    const schedule = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Schedule Fetch Error:', error);
    res.status(500).json({ error: 'Failed to load event program' });
  }
});

// POST /api/schedule - Admin only: Add or Update a session
router.post('/update', async (req, res) => {
    const { email, sessionData } = req.body;

    // Reuse your Organizer security check
    const ORGANIZERS = ['justine@gdgmanila.com', 'aza@gdgmanila.com']; 
    if (!ORGANIZERS.includes(email?.toLowerCase().trim())) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        await db.collection('program').doc(sessionData.id).set(sessionData, { merge: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;