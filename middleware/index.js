const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); 

admin.initializeApp(); 

const authRoutes = require('./src/routes/auth');
const alertRoutes = require('./src/routes/alerts');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));