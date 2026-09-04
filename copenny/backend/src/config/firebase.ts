import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.warn('\n⚠️ WARNING: Firebase Admin credentials are missing! The backend will not be able to verify user tokens. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment variables.\n');
}

if (!getApps().length && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Handle escaped newlines in the private key
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
  console.log('Firebase Admin SDK initialized successfully.');
}

// Export a dummy auth if not initialized, otherwise it will crash the server on boot
export const auth = getApps().length > 0 
  ? getAuth() 
  : { verifyIdToken: async () => { throw new Error('Firebase Admin not initialized') } } as any;
