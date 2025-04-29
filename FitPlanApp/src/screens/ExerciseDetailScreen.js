import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const ExerciseDetailScreen = ({ route }) => {
  const { exercise } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: exercise.imageUrl }} 
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.description}>{exercise.description}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Sätze: {exercise.sets}</Text>
          <Text style={styles.detailText}>Wiederholungen: {exercise.reps}</Text>
          {exercise.duration && (
            <Text style={styles.detailText}>Dauer: {exercise.duration} Minuten</Text>
          )}
          <Text style={styles.detailText}>Intensität: {exercise.intensity}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ExerciseDetailScreen; 