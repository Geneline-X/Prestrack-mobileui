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

export default function VisitsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Visits</Text>
            <Text style={styles.subtitle}>Week 24 of Pregnancy</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ New Visit</Text>
          </TouchableOpacity>
        </View>

        {/* Visits List - To be populated dynamically */}
        <View style={styles.visitsList}>
          {/* Map through visits data and render each visit item here */}
        </View>

        {/* Care Team Note */}
        <View style={styles.careTeamNote}>
          <Text style={styles.noteTitle}>Your Care Team</Text>
          <Text style={styles.noteText}>
            Your visits are coordinated with your maternal healthcare team for comprehensive prenatal care.
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
  visitsList: {
    paddingHorizontal: 28,
    gap: 20,
  },
  visitCard: {
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
  visitHeader: {
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
  visitContent: {
    gap: 10,
  },
  visitType: {
    fontSize: 18,
    color: '#0F172A',
    fontFamily: 'Inter-SemiBold',
  },
  doctorName: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  visitDescription: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  visitDetails: {
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