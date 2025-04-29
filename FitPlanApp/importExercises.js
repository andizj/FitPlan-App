const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json'); // Ihr Service Account Key

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const exercises = [
  {
    name: "Kniebeugen",
    type: "Kraft",
    level: "Anfänger",
    sets: 3,
    reps: "10",
    description: "Grundübung für die Beinmuskulatur",
    targetMuscles: ["Beine", "Gesäß"]
  },
  {
    name: "Liegestütze",
    type: "Kraft",
    level: "Anfänger",
    sets: 3,
    reps: "8",
    description: "Grundübung für Brust und Arme",
    targetMuscles: ["Brust", "Arme"]
  },
  // ... weitere Übungen
];

async function importExercises() {
  for (const exercise of exercises) {
    await db.collection('exercises').add(exercise);
    console.log(`Übung "${exercise.name}" importiert.`);
  }
  console.log('Alle Übungen importiert!');
}

importExercises();
