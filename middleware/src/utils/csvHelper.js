/**
 * @file Utility functions for handling CSV data stored in Google Cloud Storage.
 * Primarily used for cross-referencing attendee registrations against a master roster.
 * @module Utils/CSVHelper
 * @requires @google-cloud/storage
 * @requires csv-parser
 * @requires ../config/gdg-constants
 */

const { Storage } = require('@google-cloud/storage');
const csv = require('csv-parser');
const { GCS } = require('../config/gdg-constants');

/**
 * Initialized Google Cloud Storage client.
 * @type {Storage}
 */
const storage = new Storage();

/**
 * Searches for a specific user within a CSV file stored in GCS via streaming.
 * * This function handles large datasets efficiently by piping the GCS read stream 
 * directly into the CSV parser without loading the entire file into memory.
 * * @function findUserInCSV
 * @async
 * @param {string} email - The email address to search for in the roster.
 * @returns {Promise<Object|null>} Resolves with the full row object if the user is found, 
 * or `null` if the search completes without a match.
 * @throws {Error} Rejects if there is an issue accessing the GCS bucket or reading the file.
 * * @example
 * const user = await findUserInCSV('mels@example.com');
 * if (user) {
 * console.log('User Found:', user['First Name']);
 * }
 */
const findUserInCSV = (email) => {
  return new Promise((resolve, reject) => {
    let foundUser = null;
    const cleanSearchEmail = email.toLowerCase().trim();

    // 1. Create a read stream directly from the GCS Bucket
    storage.bucket(GCS.BUCKET_NAME).file(GCS.ROSTER_FILENAME).createReadStream()
      .on('error', (err) => {
        console.error("❌ GCS Stream Error:", err);
        reject(err);
      })
      // 2. Pipe the stream into the CSV parser
      .pipe(csv())
      .on('data', (row) => {
        // 3. Search for the email column (handling potential whitespace/casing)
        for (let key in row) {
          if (key.trim().toLowerCase() === 'email') {
            if (row[key] && row[key].toLowerCase().trim() === cleanSearchEmail) {
              foundUser = row;
            }
          }
        }
      })
      .on('end', () => {
        // 4. Resolve the promise with the user data if found, or null
        resolve(foundUser);
      });
  });
};

module.exports = { findUserInCSV };
