const { Storage } = require('@google-cloud/storage');
const csv = require('csv-parser');
const { GCS } = require('../config/gdg-constants'); // Pulling bucket name from your new config

const storage = new Storage();

/**
 * Utility to stream the roster CSV from Google Cloud Storage
 * and search for a specific email.
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