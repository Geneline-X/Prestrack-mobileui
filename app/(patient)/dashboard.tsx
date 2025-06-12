import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { format } from 'date-fns';
import type { PatientData } from '../types/patient';

// Mock data - Replace with actual data from your backend
const patientData: PatientData = {
  name: 'Jane Doe',
  age: 28,
  pregnancyStatus: 'Active',
  gestationalAge: '24 weeks',
  estimatedDueDate: new Date('2024-09-15'),
  nextAppointment: new Date('2024-04-10'),
  recentObservations: [
    {
      date: '2024-03-20',
      note: 'Blood pressure: 120/80 - Normal range',
    },
    {
      date: '2024-03-15',
      note: 'Weight: 65kg - Within expected range',
    },
  ],
};

export default function PatientDashboard() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />
      
      {/* Patient Info Card */}
      <Card style={styles.card}>
        <Card.Title 
          title="Patient Information"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text style={styles.text}>Name: {patientData.name}</Text>
          <Text style={styles.text}>Age: {patientData.age} years</Text>
        </Card.Content>
      </Card>

      {/* Pregnancy Status Card */}
      <Card style={styles.card}>
        <Card.Title 
          title="Pregnancy Status"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text style={[
            styles.statusText,
            { color: patientData.pregnancyStatus === 'Active' ? theme.colors.primary : theme.colors.backdrop }
          ]}>
            {patientData.pregnancyStatus}
          </Text>
        </Card.Content>
      </Card>

      {/* Pregnancy Details Card */}
      <Card style={styles.card}>
        <Card.Title 
          title="Pregnancy Details"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text style={styles.text}>Gestational Age: {patientData.gestationalAge}</Text>
          <Text style={styles.text}>
            Estimated Due Date: {format(patientData.estimatedDueDate, 'MMMM dd, yyyy')}
          </Text>
        </Card.Content>
      </Card>

      {/* Next Appointment Card */}
      <Card style={styles.card}>
        <Card.Title 
          title="Next Appointment"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Text style={styles.text}>
            {format(patientData.nextAppointment, 'MMMM dd, yyyy - h:mm a')}
          </Text>
        </Card.Content>
      </Card>

      {/* Recent Observations Card */}
      <Card style={styles.card}>
        <Card.Title 
          title="Recent Observations"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          {patientData.recentObservations.map((observation, index) => (
            <View key={index} style={styles.observationItem}>
              <Text style={styles.observationDate}>{observation.date}</Text>
              <Text style={styles.observationNote}>{observation.note}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  observationItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  observationDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  observationNote: {
    fontSize: 16,
    lineHeight: 22,
  },
});