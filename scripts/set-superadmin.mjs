/**
 * Run once to assign superadmin role to caenbera@gmail.com
 * Usage: node scripts/set-superadmin.mjs
 *
 * Requires FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS env vars
 * OR run directly from Firebase console with the snippet below.
 */

// ─── Firebase Console snippet (paste in Firestore console > run) ───────────
// db.collection('users').where('email', '==', 'caenbera@gmail.com').get()
//   .then(snap => snap.forEach(d => d.ref.update({ role: 'superadmin' })))
// ──────────────────────────────────────────────────────────────────────────

// If you have firebase-admin set up:
// import { initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';
// const app = initializeApp({ credential: cert('./serviceAccountKey.json') });
// const db = getFirestore(app);
// const auth = getAuth(app);
// const user = await auth.getUserByEmail('caenbera@gmail.com');
// await db.doc(`users/${user.uid}`).set({ role: 'superadmin' }, { merge: true });
// console.log('Done — superadmin role set for caenbera@gmail.com');

console.log(`
┌─────────────────────────────────────────────────────────┐
│  Para asignar el rol superadmin, ve a Firebase Console:  │
│                                                           │
│  1. Firestore > Colección "users"                         │
│  2. Busca el documento con tu uid (caenbera@gmail.com)    │
│     Si no existe, créalo manualmente.                     │
│  3. Agrega el campo:  role = "superadmin"  (string)       │
│                                                           │
│  O usa la consola de Firebase con este snippet:           │
│                                                           │
│  db.collection('users')                                   │
│    .where('email','==','caenbera@gmail.com')              │
│    .get().then(s => s.forEach(d =>                        │
│      d.ref.set({role:'superadmin'},{merge:true})))        │
└─────────────────────────────────────────────────────────┘
`);
