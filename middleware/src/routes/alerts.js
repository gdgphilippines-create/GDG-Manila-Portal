/**
 * @file Handles global alert invocation, emitting, and structuring. This file contains the API routes, callbacks, and
 * object definitions pertaining to the global alert system of the GDG PWA.
 * @module Routes/Alerts
 * @requires express
 * @requires firebase-admin
 * @requires ../config/gdg-constants
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { ROLES } = require('../config/gdg-constants');

/**
 * Firestore database instance.
 * @type {Object}
 */
const db = admin.firestore();

/**
 * @typedef {Object} AlertData
 * @property {string} message - The main content of the broadcast alert.
 * @property {string} [type='info'] - The severity/category of the alert (e.g., 'info', 'warning', 'urgent').
 * @property {boolean} active - Whether the alert is currently visible to users.
 * @property {Object} timestamp - Server-side timestamp of when the alert was created.
 * @property {string} createdBy - Email of the administrator who posted the alert.
 *
 * @description
 * The AlertData object represents the alerts being shown on the User View as invoked by the admin through 
 * the Admin View. This object is created during the callback of the alert route as it is set in Firebase.
 */

/**
 * @name POST /api/alerts
 * @route {POST} /api/alerts
 * @function
 * @memberof module:Routes/Alerts
 * @inner
 * @param {string} req.body.email - Admin email for verification.
 * @param {string} req.body.message - Content of the alert.
 * @param {string} [req.body.type='info'] - Alert style/priority.
 * @returns {Promise<void>} 200 - Alert broadcasted successfully.
 * @returns {Promise<void>} 403 - Unauthorized access.
 *
 * @description
 * Pushes a new global alert to the database. This route requires the current user to be an admin/organizer.
 */
router.post('/', async (req, res) => {
  try {
    const { email, message, type } = req.body;

    // Security Check: Use the central config list
    if (!ROLES.ORGANIZERS.includes(email?.toLowerCase().trim())) {
      return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }

    /** @type {AlertData} */
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

/**
 * @name GET /api/alerts
 * @route {GET} /api/alerts
 * @function
 * @memberof module:Routes/Alerts
 * @inner
 * @returns {Promise<AlertData|Object>} 200 - Returns current AlertData or {active: false}.
 *
 * Public endpoint to fetch the currently active broadcast in the form of an alertData object.
 */
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
