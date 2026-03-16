/**
 * @file Authentication and Authorization router for GDG Manila.
 * Handles identity verification by checking internal VIP lists and external registration data.
 * @module Routes/Auth
 * @requires express
 * @requires firebase-admin
 * @requires ../config/gdg-constants
 * @requires ../utils/csvHelper
 */

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { ROLES } = require('../config/gdg-constants');
const { findUserInCSV } = require('../utils/csvHelper');

/**
 * Firestore database instance.
 * @type {Object}
 */
const db = admin.firestore();

/**
 * @typedef {Object} UserVerificationResponse
 * @property {boolean} success - Indicates if the verification was successful.
 * @property {Object} [user] - The authenticated user object.
 * @property {string} user.email - The user's normalized email address.
 * @property {('admin'|'facilitator'|'participant')} user.role - The assigned access level.
 * @property {string} user.firstName - The user's first name (or "Organizer").
 * @property {string} [error] - Error message if success is false.
 *
 * @description 
 * Object that represents identity of a user via verification process that occurs in one of the routes of this module.
 */

/**
 * **Verify Identity**
 * @name POST /api/auth/verify
 * @route {POST} /api/auth/verify
 * @function
 * @async
 * @memberof module:Routes/Auth
 * @inner
 * @param {Object} req - Express request object.
 * @param {string} req.body.email - The email address to verify.
 * @returns {Promise<UserVerificationResponse>} 200 - Successful verification and sync.
 * @returns {Promise<Object>} 400 - Email is missing from request body.
 * @returns {Promise<Object>} 403 - Email not found or registration is pending.
 * @returns {Promise<Object>} 500 - Internal server or database error.
 *
 * @description
 * The verification process of a given user utilizes a three-step approach. The system checks whether the 
 * given user is found in the facilitator/organizer database. If not, it then checks the event roster in Firebase. 
 * Lastly, the user (if found) is written to the database of valid users. Otherwise, an verification error is thrown
 * back to the system.
 */
router.post('/verify', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check VIP Lists from Config
    let role = null;
    if (ROLES.ORGANIZERS.includes(cleanEmail)) {
      role = 'admin';
    } else if (ROLES.FACILITATORS.includes(cleanEmail)) {
      role = 'facilitator';
    }

    let attendeeRecord = null;

    // 2. If not VIP, check GCS via Helper
    if (!role) {
      attendeeRecord = await findUserInCSV(cleanEmail);
      if (!attendeeRecord) {
        return res.status(403).json({ success: false, message: 'Email not found.' });
      }

      // Check if registration is finalized
      const isAccepted = attendeeRecord['Tickets Released?']?.toLowerCase() === 'true';
      if (!isAccepted) {
        return res.status(403).json({ success: false, message: 'Registration pending.' });
      }
      role = 'participant';
    }

    // 3. Sync & Respond
    const userRef = db.collection('users').doc(cleanEmail);
    
    /** @type {Object} */
    const userData = {
      email: cleanEmail,
      role: role,
      firstName: attendeeRecord ? attendeeRecord['First Name'] : 'Organizer',
      attendance: true,
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    };

    // Use merge to avoid overwriting existing user metadata
    await userRef.set(userData, { merge: true });
    
    res.status(200).json({ 
      success: true, 
      user: { 
        email: cleanEmail, 
        role, 
        firstName: userData.firstName 
      } 
    });

  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
