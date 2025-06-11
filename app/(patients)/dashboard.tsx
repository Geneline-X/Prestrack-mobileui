import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Sliders,
  Baby,
  Heart,
  CalendarClock,
  Share2,
  Bell,
  Settings,
} from 'lucide-react-native';

const services = [
  {
    id: 1,
    title: 'Pregnancy\nTimeline',
    icon: CalendarClock,
    color: '#E3F2FD',
    iconColor: '#2196F3',
  },
  {
    id: 2,
    title: 'Health\nMetrics',
    icon: Heart,
    color: '#FFF3E0',
    iconColor: '#FF9800',
  },
  {
    id: 3,
    title: 'Baby\nDevelopment',
    icon: Baby,
    color: '#E0F7FA',
    iconColor: '#00BCD4',
  },
  {
    id: 4,
    title: 'Share\nData',
    icon: Share2,
    color: '#F3E5F5',
    iconColor: '#9C27B0',
  },
];

const healthMetrics = [
  {
    id: 1,
    title: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    time: '2h ago',
  },
  {
    id: 2,
    title: 'Weight',
    value: '68',
    unit: 'kg',
    time: '1d ago',
  },
  {
    id: 3,
    title: 'Fetal Heart Rate',
    value: '140',
    unit: 'bpm',
    time: '2h ago',
  },
];

export default function PatientDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.name}>Sarah Johnson</Text>
            <Text style={styles.pregnancyWeek}>Week 24 of Pregnancy</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color="#0F172A" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Settings size={24} color="#0F172A" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, { backgroundColor: service.color }]}
              >
                <service.icon size={24} color={service.iconColor} strokeWidth={2} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Health Metrics</Text>
          <View style={styles.metricsGrid}>
            {healthMetrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <View style={styles.metricValue}>
                  <Text style={styles.metricNumber}>{metric.value}</Text>
                  <Text style={styles.metricUnit}>{metric.unit}</Text>
                </View>
                <Text style={styles.metricTime}>{metric.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Next Appointment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          <TouchableOpacity style={styles.appointmentCard}>
            <View style={styles.appointmentContent}>
              <View>
                <Text style={styles.appointmentType}>Prenatal Checkup</Text>
                <Text style={styles.appointmentDoctor}>Dr. Emily White</Text>
                <Text style={styles.appointmentTime}>Tomorrow, 10:30 AM</Text>
              </View>
              <View style={styles.appointmentStatus}>
                <Text style={styles.statusText}>Confirmed</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Consent Settings Banner */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.consentBanner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Data Sharing Preferences</Text>
              <Text style={styles.bannerDescription}>
                Review and update your consent settings for data sharing with healthcare providers
              </Text>
            </View>
          </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 18,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  name: {
    fontSize: 28,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
    marginTop: 2,
  },
  pregnancyWeek: {
    fontSize: 18,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 28,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#0F172A',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 18,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
  },
  serviceCard: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  serviceTitle: {
    display: 'none', // Hide the text label
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  metricTitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  metricNumber: {
    fontSize: 24,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
  },
  metricUnit: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  metricTime: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentType: {
    fontSize: 18,
    color: '#0F172A',
    fontFamily: 'Inter-SemiBold',
  },
  appointmentDoctor: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  appointmentTime: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  appointmentStatus: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
  },
  statusText: {
    fontSize: 13,
    color: '#0EA5E9',
    fontFamily: 'Inter-Medium',
  },
  consentBanner: {
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 12,
  },
  bannerContent: {
    gap: 10,
  },
  bannerTitle: {
    fontSize: 18,
    color: '#0F172A',
    fontFamily: 'Inter-SemiBold',
  },
  bannerDescription: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});