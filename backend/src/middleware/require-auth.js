import admin from 'firebase-admin';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const requestDeviceId = req.headers['x-device-id']; 
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const isAuthRoute = req.path.includes('/auth/');
    if (!isAuthRoute) {
        const email = decodedToken.email || decodedToken.uid; 
        const userSnapshot = await admin.firestore().collection('users').where('email', '==', email).get();
        
        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            if (userData.activeDeviceId && userData.activeDeviceId !== requestDeviceId) {
                return res.status(401).json({ error: 'Session expired: You logged in on another device.' });
            }
        }
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};