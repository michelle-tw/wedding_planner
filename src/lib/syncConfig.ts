import type { SyncConfig } from './sync';

// The couple's Firebase project (wedding-3e294). A Firebase web config is NOT a
// secret — it ships in every Firebase web app. Privacy comes from the Firestore
// rules + the secret share code carried in the share link. Baking it in lets
// anyone who opens a share link connect automatically, with zero setup.
export const SHARED_FIREBASE_CONFIG: SyncConfig = {
  apiKey: 'AIzaSyCcTWrPzSPdSnbqdMo6LSN_P452wXfT8wI',
  authDomain: 'wedding-3e294.firebaseapp.com',
  projectId: 'wedding-3e294',
  storageBucket: 'wedding-3e294.firebasestorage.app',
  messagingSenderId: '670090658343',
  appId: '1:670090658343:web:d3f247e021bd781a7b0402',
};
