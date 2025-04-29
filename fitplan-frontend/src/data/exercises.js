// Übungskategorien
export const EXERCISE_CATEGORIES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility'
};

// Schwierigkeitsgrade
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Muskelgruppen
export const MUSCLE_GROUPS = {
  CHEST: 'chest',
  BACK: 'back',
  LEGS: 'legs',
  SHOULDERS: 'shoulders',
  ARMS: 'arms',
  CORE: 'core',
  FULL_BODY: 'full_body'
};

// Beispiel-Übungsdatenbank
export const exercises = [
  {
    id: 'push-ups',
    name: 'Liegestütze',
    type: EXERCISE_CATEGORIES.STRENGTH,
    targetMuscles: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.ARMS],
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    instructions: [
      'Stützen Sie sich auf Ihre Hände und Fußspitzen',
      'Halten Sie Ihren Körper gerade wie ein Brett',
      'Senken Sie Ihren Körper, bis Ihre Brust fast den Boden berührt',
      'Drücken Sie sich wieder nach oben'
    ],
    imageUrl: '/images/exercises/push-ups.jpg',
    equipment: ['none'],
    recommendedSets: 3,
    recommendedReps: '10-12',
    restTime: 60 // in Sekunden
  },
  {
    id: 'squats',
    name: 'Kniebeugen',
    type: EXERCISE_CATEGORIES.STRENGTH,
    targetMuscles: [MUSCLE_GROUPS.LEGS],
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    instructions: [
      'Füße schulterbreit aufstellen',
      'Gesäß nach hinten schieben, als würden Sie sich setzen',
      'Knie in Richtung der Zehen beugen',
      'Bis zur parallelen Position der Oberschenkel zum Boden gehen',
      'Zurück in die Ausgangsposition drücken'
    ],
    imageUrl: '/images/exercises/squats.jpg',
    equipment: ['none'],
    recommendedSets: 3,
    recommendedReps: '12-15',
    restTime: 60
  },
  {
    id: 'plank',
    name: 'Unterarmstütz',
    type: EXERCISE_CATEGORIES.STRENGTH,
    targetMuscles: [MUSCLE_GROUPS.CORE],
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    instructions: [
      'Stützen Sie sich auf Ihre Unterarme und Fußspitzen',
      'Halten Sie Ihren Körper gerade wie ein Brett',
      'Spannen Sie Ihren Bauch an',
      'Position für die vorgegebene Zeit halten'
    ],
    imageUrl: '/images/exercises/plank.jpg',
    equipment: ['none'],
    recommendedSets: 3,
    recommendedDuration: 30, // in Sekunden
    restTime: 45
  }
];

// Hilfsfunktionen für die Übungsdatenbank
export const getExercisesByMuscleGroup = (muscleGroup) => {
  return exercises.filter(exercise => exercise.targetMuscles.includes(muscleGroup));
};

export const getExercisesByDifficulty = (difficulty) => {
  return exercises.filter(exercise => exercise.difficulty === difficulty);
};

export const getExercisesByType = (type) => {
  return exercises.filter(exercise => exercise.type === type);
};

export const getExerciseById = (id) => {
  return exercises.find(exercise => exercise.id === id);
}; 