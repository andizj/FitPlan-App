import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { generateWorkout } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

const GoalSelectionScreen = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const navigation = useNavigation();

  const goals = ['Muskelaufbau', 'Ausdauer', 'Gewichtsverlust'];
  const levels = ['Anfänger', 'Fortgeschritten'];
  const times = [15, 30, 45, 60];

  const handleGoalSelect = async () => {
    try {
      if (!selectedGoal || !selectedLevel || !selectedTime) {
        Alert.alert('Fehler', 'Bitte wähle alle Felder aus');
        return;
      }

      const result = await generateWorkout({
        goal: selectedGoal,
        fitnessLevel: selectedLevel,
        availableTime: selectedTime,
      });

      setWorkoutPlan(result.data.workoutPlan);
      navigation.navigate('WorkoutPlan', {
        workoutPlan: result.data.workoutPlan,
      });
    } catch (error) {
      Alert.alert('Fehler', 'Beim Generieren des Trainingsplans ist ein Fehler aufgetreten');
      console.error(error);
    }
  };

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetail', { exercise });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wähle dein Fitnessziel</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ziel</Text>
        <View style={styles.optionsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.option,
                selectedGoal === goal && styles.selectedOption
              ]}
              onPress={() => setSelectedGoal(goal)}
            >
              <Text style={styles.optionText}>{goal}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Level</Text>
        <View style={styles.optionsContainer}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.option,
                selectedLevel === level && styles.selectedOption
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <Text style={styles.optionText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verfügbare Zeit (Minuten)</Text>
        <View style={styles.optionsContainer}>
          {times.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.option,
                selectedTime === time && styles.selectedOption
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={styles.optionText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.generateButton,
          (!selectedGoal || !selectedLevel || !selectedTime) && styles.disabledButton
        ]}
        onPress={handleGoalSelect}
        disabled={!selectedGoal || !selectedLevel || !selectedTime}
      >
        <Text style={styles.generateButtonText}>Trainingsplan generieren</Text>
      </TouchableOpacity>

      {workoutPlan && (
        <View style={styles.workoutPlan}>
          <Text style={styles.workoutTitle}>Dein Trainingsplan</Text>
          {workoutPlan.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseCard}
              onPress={() => handleExercisePress(exercise)}
            >
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.sets && (
                <Text style={styles.exerciseDetail}>
                  {exercise.sets} Sätze x {exercise.reps} Wiederholungen
                </Text>
              )}
              {exercise.duration && (
                <Text style={styles.exerciseDetail}>
                  Dauer: {exercise.duration} Minuten
                </Text>
              )}
              <Text style={styles.exerciseDetail}>
                Intensität: {exercise.intensity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutPlan: {
    marginTop: 30,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
});

export default GoalSelectionScreen; 