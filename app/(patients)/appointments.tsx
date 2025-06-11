import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Baby } from 'lucide-react-native';

const appointments = [
  {
    id: 1,
    date: 'March 15, 2024',
    time: '09:30 AM',
    doctor: 'Dr. Sarah Wilson',
    type: 'Prenatal Checkup',
    location: 'Maternal Care Center',
    description: 'Regular pregnancy checkup and ultrasound',
    status: 'upcoming',
  },
  {
    id: 2,
    date: 'March 22, 2024',
    time: '02:00 PM',
    doctor: 'Dr. Emily Parker',
    type: 'Nutrition Consultation',
    location: 'Womens Health Clinic',
    description: 'Pregnancy diet and supplements review',
    status: 'upcoming',
  },
  {
    id: 3,
    date: 'March 28, 2024',
    time: '11:15 AM',
    doctor: 'Dr. Michael Brown',
    type: 'Fetal Assessment',
    location: 'Maternal Care Center',
    description: 'Detailed ultrasound and growth monitoring',
    status: 'upcoming',
  },
];

export default function AppointmentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Appointments</Text>
            <Text style={styles.subtitle}>Week 24 of Pregnancy</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ New Visit</Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsList}>
          {appointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.appointmentCard}
              activeOpacity={0.7}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.dateContainer}>
                  <Calendar size={16} color="#64748B" strokeWidth={2} />
                  <Text style={styles.dateText}>{appointment.date}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <Baby size={16} color="#0EA5E9" strokeWidth={2} />
                  <Text style={styles.statusText}>Prenatal Care</Text>
                </View>
              </View>

              <View style={styles.appointmentContent}>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
                <Text style={styles.doctorName}>{appointment.doctor}</Text>
                <Text style={styles.appointmentDescription}>
                  {appointment.description}
                </Text>

                <View style={styles.appointmentDetails}>
                  <View style={styles.detailItem}>
                    <Clock size={16} color="#64748B" strokeWidth={2} />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MapPin size={16} color="#64748B" strokeWidth={2} />
                    <Text style={styles.detailText}>{appointment.location}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Care Team Note */}
        <View style={styles.careTeamNote}>
          <Text style={styles.noteTitle}>Your Care Team</Text>
          <Text style={styles.noteText}>
            Your appointments are coordinated with your maternal healthcare team for comprehensive prenatal care.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // softer background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 28, // more padding
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7EF',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 28,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
    marginTop: 6,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  appointmentsList: {
    paddingHorizontal: 28,
    gap: 20,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E7EF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
  },
  statusText: {
    fontSize: 13,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
  },
  appointmentContent: {
    gap: 10,
  },
  appointmentType: {
    fontSize: 18,
    color: '#0F172A',
    fontFamily: 'Inter-SemiBold',
  },
  doctorName: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  appointmentDescription: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  appointmentDetails: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E0E7EF',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  careTeamNote: {
    margin: 28,
    padding: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    color: '#0F172A',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});