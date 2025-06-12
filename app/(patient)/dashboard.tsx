import React from 'react';
import { View, ScrollView, StyleSheet, Platform, StatusBar } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Stack } from 'expo-router';
import { format } from 'date-fns';
import type { PatientData } from '../types/patient';
import { Calendar, Clock, Activity, FileText } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Playful color palette
const COLORS = {
  flagship: '#2563EB',      // Blue
  flagshipDark: '#1E40AF', // Dark blue
  flagshipLight: '#60A5FA',// Light blue
  teal: '#14B8A6',         // Teal accent
  purple: '#A78BFA',       // Purple accent
  orange: '#FB923C',       // Orange accent
  background: '#F3F4F6',   // Soft gray
  surface: '#FFFFFF',      // White
  surfaceAlt: '#F1F5F9',   // Alt surface
  text: '#1E293B',         // Dark text
  textSecondary: '#64748B',// Secondary text
  divider: '#E5E7EB',      // Divider
  shadow: 'rgba(37, 99, 235, 0.08)',
};

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
  const insets = useSafeAreaInsets();

    return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.surface}
        translucent
      />
      
      <Stack.Screen
        options={{
          title: 'Dashboard',
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            color: COLORS.flagshipDark,
          },
        }}
      />

      {/* Static Welcome Section */}
      <View style={[styles.welcomeSection, { paddingTop: insets.top }]}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeText}>
            Hello, {patientData.name.split(' ')[0]} 👋
          </Text>
          <Text style={styles.subtitleText}>
            Here's your pregnancy journey
          </Text>
        </View>
      </View>
      
      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 20) } // Ensure content doesn't get hidden behind bottom nav
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {/* Key Info Section */}
          <View style={styles.infoGrid}>
            <Surface style={[styles.infoCard, { borderLeftColor: COLORS.flagship, backgroundColor: COLORS.surface }]}>
              <View style={styles.cardContent}>
                <Activity size={28} color={COLORS.teal} />
                <Text style={styles.infoLabel}>Pregnancy Status</Text>
                <Text style={[styles.infoValue, { color: COLORS.flagshipDark }]}>
                  {patientData.pregnancyStatus}
                </Text>
              </View>
            </Surface>

            <Surface style={[styles.infoCard, { borderLeftColor: COLORS.purple, backgroundColor: COLORS.surfaceAlt }]}>
              <View style={styles.cardContent}>
                <Clock size={28} color={COLORS.purple} />
                <Text style={styles.infoLabel}>Gestational Age</Text>
                <Text style={[styles.infoValue, { color: COLORS.flagshipDark }]}>
                  {patientData.gestationalAge}
                </Text>
              </View>
            </Surface>
          </View>

          {/* Next Appointment Section */}
          <Surface style={[styles.appointmentCard, { borderLeftColor: COLORS.orange }]}>
            <View style={styles.appointmentHeader}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.surfaceAlt }]}>
                <Calendar size={24} color={COLORS.orange} />
              </View>
              <Text style={styles.sectionTitle}>Next Appointment</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.appointmentDate}>
              {format(patientData.nextAppointment, 'EEEE, MMMM d')}
            </Text>
            <Text style={styles.appointmentTime}>
              {format(patientData.nextAppointment, 'h:mm a')}
            </Text>
          </Surface>

          {/* Recent Observations */}
          <Surface style={[styles.observationsCard, { borderLeftColor: COLORS.teal }]}>
            <View style={styles.observationHeader}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.surfaceAlt }]}>
                <FileText size={24} color={COLORS.teal} />
              </View>
              <Text style={styles.sectionTitle}>Recent Observations</Text>
            </View>
            <View style={styles.divider} />
            {patientData.recentObservations.map((observation, index) => (
              <View key={index} style={styles.observationItem}>
                <View style={styles.observationContent}>
                  <Text style={styles.observationDate}>{observation.date}</Text>
                  <Text style={styles.observationNote}>{observation.note}</Text>
                </View>
                {index < patientData.recentObservations.length - 1 && (
                  <View style={styles.itemDivider} />
                )}
              </View>
            ))}
          </Surface>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeSection: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    zIndex: 1,
  },
  welcomeContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.flagshipDark,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
    letterSpacing: 0.2,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  mainContent: {
    paddingTop: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24, // Increased spacing before next section
  },
  infoCard: {
    flex: 1,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 2,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    marginTop: 12,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  appointmentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  sectionTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.flagshipDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 16,
  },
  appointmentDate: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.flagshipDark,
  },
  appointmentTime: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  observationsCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  observationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  observationItem: {
    marginBottom: 12,
  },
  observationContent: {
    backgroundColor: COLORS.surfaceAlt,
    padding: 16,
    borderRadius: 12,
  },
  observationDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  observationNote: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
});