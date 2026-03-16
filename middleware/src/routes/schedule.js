/**
 * @file Event schedule and program management routes.
 * Provides endpoints to fetch the event timeline and for admins to update session details.
 * @module Routes/Schedule
 * @requires express
 * @requires firebase-admin
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

/**
 * Firestore database instance.
 * @type {Object}
 */
const db = admin.firestore();

/**
 * @typedef {Object} SessionData
 * @property {string} id - Unique identifier for the session (usually the document ID).
 * @property {string} title - The name of the session or talk.
 * @property {string} speaker - The person presenting the session.
 * @property {string} startTime - ISO string or timestamp of the start time.
 * @property {string} endTime - ISO string or timestamp of the end time.
 * @property {string} location - The room or track where the session is held.
 * @property {string} [description] - Optional details about the session content.
 *
 * @description
 * Object that represents a specific session in the given event.
 */

/**
 * **Get Full Schedule**
 * @name GET /api/schedule
 * @route {GET} /api/schedule
 * @function
 * @async
 * @memberof module:Routes/Schedule
 * @inner
 * @returns {Promise<SessionData[]>} 200 - An array of session objects.
 * @returns {Promise<Object>} 500 - If the database query fails.
 *
 * @description
 * Retrieves the complete event timeline from the 'program' collection.
 * Results are automatically sorted chronologically by the `startTime` field.
 */
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

/**
 * **Update Session**
 * @name POST /api/schedule/update
 * @route {POST} /api/schedule/update
 * @function
 * @async
 * @memberof module:Routes/Schedule
 * @inner
 * @param {Object} req.body
 * @param {string} req.body.email - Email of the administrator performing the update.
 * @param {SessionData} req.body.sessionData - The session object to create or update.
 * @returns {Promise<Object>} 200 - Successful update.
 * @returns {Promise<Object>} 403 - Unauthorized access.
 * @returns {Promise<Object>} 500 - Update failed.
 *
 * @description
 * Admin-only endpoint to add or modify a session. 
 * Performs a localized security check against authorized emails.
 * Uses `merge: true` to preserve existing fields not included in the update.
 */
router.post('/update', async (req, res) => {
    const { email, sessionData } = req.body;

    /** * Localized list of authorized administrators for schedule management.
     * @type {string[]} 
     */
    const ORGANIZERS = ['justine@gdgmanila.com', 'aza@gdgmanila.com']; 
    
    if (!ORGANIZERS.includes(email?.toLowerCase().trim())) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        // sessionData.id is used as the document reference
        await db.collection('program').doc(sessionData.id).set(sessionData, { merge: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;
