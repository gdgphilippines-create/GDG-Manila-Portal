/**
 * @file Groups the middleware routes into a runnable Node instance.
 * This file serves as the entry point for the API Gateway, initializing
 * Firebase Admin and setting up the Express server. Each of the main routes provide the subroutes
 * under the different route submodules.
 * @module Middleware
 * @author Marvic Tabacon 
 * @author Rommel Ronduen
 * @copyright 2026 Google Developer Groups Manila
 */

/**
 * @requires express
 * @requires cors
 * @requires firebase-admin
 */
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); 

/**
 * Initializes the Firebase Admin SDK with default credentials.
 * @see {@link https://firebase.google.com/docs/admin/setup|Firebase Admin Setup}
 */
admin.initializeApp(); 

/**
 * Authentication related route handlers.
 * @const
 * @see module:Routes/Auth
 */
const authRoutes = require('./src/routes/auth');

/**
 * Alerting and notification route handlers.
 * @const
 * @see module:Routes/Alerts
 */
const alertRoutes = require('./src/routes/alerts');

/**
 * The Express application instance.
 * @type {Object}
 */
const app = express();

// --- Middleware Configuration ---

/**
 * Enable Cross-Origin Resource Sharing (CORS) for all origins.
 * @see {@link https://github.com/expressjs/cors#readme|CORS Documentation}
 */
app.use(cors({ origin: true }));

/**
 * Middleware to parse incoming requests with JSON payloads.
 */
app.use(express.json());

// --- API Gateway Routes ---

/**
 * Auth Gateway that mounts all authentication and authorization endpoints.
 * @name /api/auth/*
 * @memberof module:Middleware
 * @inner
 * @summary Entry point for Auth module
 */
app.use('/api/auth', authRoutes);

/**
 * Gateway that mounts all broadcast and notification endpoints.
 * @name /api/alerts/*
 * @memberof module:Middleware
 * @inner
 * @summary Entry point for Alerts module
 */
app.use('/api/alerts', alertRoutes);

/**
 * The port the server listens on. Defaults to 8080 if process.env.PORT is not set.
 * @type {number|string}
 */
const PORT = process.env.PORT || 8080;

/**
 * Starts the Express server and begins listening for connections.
 */
app.listen(PORT, () => {
    console.log(`API Gateway running on ${PORT}`);
});
