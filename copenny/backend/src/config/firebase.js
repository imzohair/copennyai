"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
if (!(0, app_1.getApps)().length) {
    try {
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle escaped newlines in the private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin SDK initialized successfully.');
    }
    catch (error) {
        console.error('Firebase Admin SDK initialization error', error);
    }
}
exports.auth = (0, auth_1.getAuth)();
//# sourceMappingURL=firebase.js.map