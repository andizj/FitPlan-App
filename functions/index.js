/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest, onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Registrierung eines neuen Nutzers
exports.registerUser = onCall(async (request) => {
  try {
    const { email, password, displayName } = request.data;
    
    // Erstelle den Nutzer in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName
    });

    // Erstelle das Nutzerdokument in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: email,
      displayName: displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      goal: null
    });

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    logger.error("Registrierungsfehler:", error);
    throw new Error(error.message);
  }
});

// Login eines Nutzers
exports.loginUser = onCall(async (request) => {
  try {
    const { email, password } = request.data;
    
    // Hier würde normalerweise die Firebase Auth API aufgerufen werden
    // Da wir in Cloud Functions sind, können wir nur die Firestore-Daten validieren
    const userSnapshot = await admin.firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      throw new Error('Nutzer nicht gefunden');
    }

    const userData = userSnapshot.docs[0].data();
    return { 
      success: true, 
      uid: userSnapshot.docs[0].id,
      displayName: userData.displayName
    };
  } catch (error) {
    logger.error("Login-Fehler:", error);
    throw new Error(error.message);
  }
});

// Trainingsplan-Generierung
exports.generateWorkout = onCall(async (request) => {
  try {
    const { userId, goal, fitnessLevel, availableTime } = request.data;
    
    // Hole Nutzerdaten
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Generiere Trainingsplan basierend auf Ziel und Level
    const workoutPlan = generateWorkoutPlan(goal, fitnessLevel, availableTime);

    // Speichere Trainingsplan in Firestore
    const workoutRef = await admin.firestore().collection('workouts').add({
      userId: userId,
      goal: goal,
      fitnessLevel: fitnessLevel,
      availableTime: availableTime,
      exercises: workoutPlan,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      completed: false
    });

    return { success: true, workoutId: workoutRef.id, workoutPlan };
  } catch (error) {
    logger.error("Trainingsplan-Generierungsfehler:", error);
    throw new Error(error.message);
  }
});

function generateWorkoutPlan(goal, fitnessLevel, availableTime) {
  // Basis-Übungen für verschiedene Ziele
  const exerciseLibrary = {
    Muskelaufbau: {
      Anfänger: [
        { 
          name: "Kniebeugen", 
          sets: 3, 
          reps: 10, 
          rest: 60,
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fsquats.jpg",
          description: "Stellen Sie sich mit schulterbreitem Stand hin. Beugen Sie die Knie und senken Sie den Po, als würden Sie sich auf einen Stuhl setzen. Halten Sie den Rücken gerade und die Knie über den Zehen. Drücken Sie sich dann wieder nach oben.",
          intensity: "mittel"
        },
        { 
          name: "Liegestütze", 
          sets: 3, 
          reps: 8, 
          rest: 60,
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fpushups.jpg",
          description: "Beginnen Sie in der Plank-Position. Senken Sie den Körper, bis die Brust fast den Boden berührt. Halten Sie den Körper gerade und drücken Sie sich dann wieder nach oben.",
          intensity: "mittel"
        },
        { 
          name: "Ausfallschritte", 
          sets: 3, 
          reps: 10, 
          rest: 60,
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Flunges.jpg",
          description: "Machen Sie einen großen Schritt nach vorne. Beugen Sie beide Knie, bis das hintere Knie fast den Boden berührt. Das vordere Knie sollte über dem Fuß sein. Drücken Sie sich dann wieder nach oben.",
          intensity: "mittel"
        }
      ],
      Fortgeschritten: [
        { 
          name: "Kniebeugen mit Gewicht", 
          sets: 4, 
          reps: 8, 
          rest: 90,
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fweighted_squats.jpg",
          description: "Führen Sie Kniebeugen mit einer Langhantel oder Kurzhanteln aus. Halten Sie die Gewichte seitlich oder auf den Schultern. Achten Sie auf eine korrekte Form.",
          intensity: "hoch"
        },
        { 
          name: "Bankdrücken", 
          sets: 4, 
          reps: 8, 
          rest: 90,
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fbench_press.jpg",
          description: "Legen Sie sich auf eine Bank. Drücken Sie die Langhantel oder Kurzhanteln nach oben, bis die Arme gestreckt sind. Senken Sie das Gewicht kontrolliert zur Brust.",
          intensity: "hoch"
        },
        { 
          name: "Klimmzüge", 
          sets: 4, 
          reps: 6, 
          rest: 90,
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fpullups.jpg",
          description: "Hängen Sie sich an eine Klimmzugstange. Ziehen Sie sich hoch, bis das Kinn über der Stange ist. Senken Sie sich kontrolliert ab.",
          intensity: "hoch"
        }
      ]
    },
    Ausdauer: {
      Anfänger: [
        { 
          name: "Seilspringen", 
          duration: 5, 
          intensity: "mittel",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fjump_rope.jpg",
          description: "Springen Sie mit beiden Füßen gleichzeitig über das Seil. Halten Sie die Ellbogen nahe am Körper und drehen Sie das Seil mit den Handgelenken."
        },
        { 
          name: "Hampelmänner", 
          duration: 3, 
          intensity: "mittel",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fjumping_jacks.jpg",
          description: "Springen Sie mit gespreizten Beinen und erhobenen Armen. Springen Sie zurück in die Ausgangsposition."
        },
        { 
          name: "Laufen auf der Stelle", 
          duration: 5, 
          intensity: "mittel",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Frunning_in_place.jpg",
          description: "Laufen Sie auf der Stelle, heben Sie die Knie hoch und bewegen Sie die Arme mit."
        }
      ],
      Fortgeschritten: [
        { 
          name: "HIIT Intervall", 
          duration: 20, 
          intensity: "hoch",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fhiit.jpg",
          description: "Wechseln Sie zwischen 30 Sekunden maximaler Anstrengung und 30 Sekunden Pause. Übungen können variieren."
        },
        { 
          name: "Bergsteiger", 
          duration: 5, 
          intensity: "hoch",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fmountain_climbers.jpg",
          description: "Beginnen Sie in der Plank-Position. Ziehen Sie abwechselnd die Knie zur Brust, als würden Sie einen Berg erklimmen."
        },
        { 
          name: "Burpees", 
          duration: 5, 
          intensity: "hoch",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fburpees.jpg",
          description: "Gehen Sie in die Hocke, springen Sie in die Plank-Position, machen Sie einen Liegestütz, springen Sie zurück in die Hocke und dann nach oben."
        }
      ]
    },
    Gewichtsverlust: {
      Anfänger: [
        { 
          name: "Walking", 
          duration: 20, 
          intensity: "niedrig",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fwalking.jpg",
          description: "Gehen Sie zügig, halten Sie eine gute Haltung und schwingen Sie die Arme mit."
        },
        { 
          name: "Radfahren", 
          duration: 15, 
          intensity: "mittel",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fcycling.jpg",
          description: "Fahren Sie mit moderater Geschwindigkeit Rad, halten Sie einen gleichmäßigen Rhythmus."
        },
        { 
          name: "Kniebeugen", 
          sets: 3, 
          reps: 10, 
          rest: 60,
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fsquats.jpg",
          description: "Stellen Sie sich mit schulterbreitem Stand hin. Beugen Sie die Knie und senken Sie den Po, als würden Sie sich auf einen Stuhl setzen.",
          intensity: "mittel"
        }
      ],
      Fortgeschritten: [
        { 
          name: "Laufen", 
          duration: 30, 
          intensity: "hoch",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Frunning.jpg",
          description: "Laufen Sie in einem moderaten bis schnellen Tempo. Halten Sie eine gute Haltung und atmen Sie gleichmäßig."
        },
        { 
          name: "HIIT Training", 
          duration: 20, 
          intensity: "hoch",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fhiit.jpg",
          description: "Wechseln Sie zwischen 30 Sekunden maximaler Anstrengung und 30 Sekunden Pause."
        },
        { 
          name: "Kraftausdauer Zirkel", 
          duration: 25, 
          intensity: "hoch",
          imageUrl: "https://firebasestorage.googleapis.com/v0/b/fitplan-app.appspot.com/o/exercises%2Fcircuit_training.jpg",
          description: "Führen Sie verschiedene Übungen nacheinander aus, mit minimalen Pausen dazwischen."
        }
      ]
    }
  };

  // Wähle Übungen basierend auf Ziel und Level
  let selectedExercises = exerciseLibrary[goal][fitnessLevel] || [];

  // Passe die Dauer basierend auf verfügbarer Zeit an
  if (availableTime) {
    selectedExercises = adjustForTime(selectedExercises, availableTime);
  }

  return selectedExercises;
}

function adjustForTime(exercises, availableTime) {
  const totalTime = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
  const timeRatio = availableTime / totalTime;

  return exercises.map(exercise => {
    if (exercise.duration) {
      return {
        ...exercise,
        duration: Math.round(exercise.duration * timeRatio)
      };
    }
    return exercise;
  });
}
