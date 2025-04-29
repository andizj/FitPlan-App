import { exercises } from '../data/exercises';

// Trainingsplan-Konfigurationen für verschiedene Ziele
const WORKOUT_CONFIGS = {
  MUSCLE_GAIN: {
    setsRange: { min: 3, max: 4 },
    repsRange: { min: 8, max: 12 },
    restTime: 90, // Sekunden
    exercisesPerWorkout: 6,
    intensity: 'high',
    frequency: { min: 3, max: 5 } // Tage pro Woche
  },
  ENDURANCE: {
    setsRange: { min: 2, max: 3 },
    repsRange: { min: 15, max: 20 },
    restTime: 45,
    exercisesPerWorkout: 8,
    intensity: 'moderate',
    frequency: { min: 3, max: 6 }
  },
  WEIGHT_LOSS: {
    setsRange: { min: 3, max: 4 },
    repsRange: { min: 12, max: 15 },
    restTime: 60,
    exercisesPerWorkout: 7,
    intensity: 'moderate-high',
    frequency: { min: 4, max: 6 }
  }
};

// Erfahrungslevel-Multiplikatoren
const EXPERIENCE_MULTIPLIERS = {
  beginner: 0.8,
  intermediate: 1,
  advanced: 1.2
};

// Funktion zum Generieren eines Trainingsplans
export const generateWorkoutPlan = (userPreferences) => {
  const {
    fitnessGoal,
    experienceLevel,
    availableEquipment,
    daysPerWeek
  } = userPreferences;

  // Wähle die passende Konfiguration basierend auf dem Fitnessziel
  const config = WORKOUT_CONFIGS[fitnessGoal];
  
  // Filtere Übungen basierend auf verfügbarem Equipment
  const availableExercises = exercises.filter(exercise => {
    return exercise.equipment.some(eq => 
      availableEquipment.includes(eq) || eq === 'none'
    );
  });

  // Erstelle Workouts für jeden Tag
  const workoutPlan = [];
  const daysMapping = {
    1: ['Ganzkörper'],
    2: ['Oberkörper', 'Unterkörper'],
    3: ['Push', 'Pull', 'Legs'],
    4: ['Brust & Trizeps', 'Rücken & Bizeps', 'Beine', 'Schultern & Core'],
    5: ['Brust', 'Rücken', 'Beine', 'Schultern', 'Arms & Core']
  };

  const splitDays = daysMapping[daysPerWeek] || daysMapping[3];

  splitDays.forEach((splitName, index) => {
    const workout = {
      day: index + 1,
      name: splitName,
      exercises: selectExercisesForSplit(
        availableExercises,
        splitName,
        config.exercisesPerWorkout,
        experienceLevel
      )
    };

    workoutPlan.push(workout);
  });

  return {
    goal: fitnessGoal,
    daysPerWeek,
    workouts: workoutPlan,
    config: adjustConfigForExperience(config, experienceLevel)
  };
};

// Hilfsfunktion zum Auswählen von Übungen für einen Split
const selectExercisesForSplit = (
  availableExercises, 
  splitName, 
  exerciseCount, 
  experienceLevel
) => {
  let targetMuscles = [];
  
  // Bestimme Zielmuskeln basierend auf dem Split
  switch(splitName.toLowerCase()) {
    case 'oberkörper':
      targetMuscles = ['chest', 'back', 'shoulders', 'arms'];
      break;
    case 'unterkörper':
      targetMuscles = ['legs', 'core'];
      break;
    case 'push':
      targetMuscles = ['chest', 'shoulders', 'arms'];
      break;
    case 'pull':
      targetMuscles = ['back', 'arms'];
      break;
    case 'legs':
      targetMuscles = ['legs'];
      break;
    default:
      targetMuscles = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
  }

  // Filtere passende Übungen
  const splitExercises = availableExercises.filter(exercise =>
    exercise.targetMuscles.some(muscle => targetMuscles.includes(muscle))
  );

  // Wähle zufällig Übungen aus
  const selectedExercises = [];
  while (selectedExercises.length < exerciseCount && splitExercises.length > 0) {
    const randomIndex = Math.floor(Math.random() * splitExercises.length);
    selectedExercises.push(splitExercises[randomIndex]);
    splitExercises.splice(randomIndex, 1);
  }

  return selectedExercises;
};

// Hilfsfunktion zum Anpassen der Konfiguration basierend auf Erfahrung
const adjustConfigForExperience = (config, experienceLevel) => {
  const multiplier = EXPERIENCE_MULTIPLIERS[experienceLevel];
  return {
    ...config,
    setsRange: {
      min: Math.round(config.setsRange.min * multiplier),
      max: Math.round(config.setsRange.max * multiplier)
    },
    repsRange: {
      min: Math.round(config.repsRange.min * multiplier),
      max: Math.round(config.repsRange.max * multiplier)
    }
  };
}; 