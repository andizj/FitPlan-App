import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GoalSelectionScreen from './src/screens/GoalSelectionScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="GoalSelection" 
          component={GoalSelectionScreen}
          options={{ title: 'Wähle dein Fitnessziel' }}
        />
        <Stack.Screen 
          name="ExerciseDetail" 
          component={ExerciseDetailScreen}
          options={{ title: 'Übungsdetails' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 