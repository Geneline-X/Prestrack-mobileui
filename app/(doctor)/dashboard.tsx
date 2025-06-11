import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { Bell, Search, UserPlus, CalendarPlus, MessageSquare, FileText, AlertTriangle, Clock, Baby } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Example user data (replace with real user context or props as needed)
const user = {
  name: 'Sarah Johnson',
  profilePic: require('../../assets/images/icon.png'), // Replace with user's profile image if available
};

export default function PatientDashboard() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  // Responsive breakpoints
  const isSmall = width < 375;
  const isTablet = width >= 600;
  const isLarge = width >= 900;

  return (
    <View style={[
      styles.container,
      {
        paddingHorizontal: isLarge ? 120 : isTablet ? 48 : Math.max(12, width * 0.04),
        paddingTop: isLarge ? 80 : isTablet ? 60 : 40,
        maxWidth: 900,
        alignSelf: 'center',
        width: '100%',
      },
    ]}>
      {/* Header Row */}
      <View style={styles.header}>
        {/* Greeting and Name (Top Left) */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        {/* Notification Bell and Profile Pic (Top Right) */}
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#6366F1" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePicWrapper}>
            <Image source={user.profilePic} style={styles.profilePic} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Quick Actions - now slidable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.quickActionsScroll,
          { paddingLeft: 0, paddingRight: Math.max(8, width * 0.02) },
        ]}
      >
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.replace('/(doctor)/create-patient')}>
          <UserPlus size={28} color="#6366F1" />
          <Text style={styles.quickActionText}>Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <CalendarPlus size={28} color="#10B981" />
          <Text style={styles.quickActionText}>Schedule Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <MessageSquare size={28} color="#F59E0B" />
          <Text style={styles.quickActionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <FileText size={28} color="#6366F1" />
          <Text style={styles.quickActionText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <AlertTriangle size={28} color="#EF4444" />
          <Text style={styles.quickActionText}>High Risk</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Search Bar - moved up under quick actions */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      {/* Upcoming Appointments Section */}
      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.appointmentsScroll,
          { paddingLeft: 0, paddingRight: Math.max(8, width * 0.02) },
        ]}
        style={{ marginTop: 10, marginBottom: 20 }}
      >
        {/* Example appointment cards, replace with dynamic data as needed */}
        <TouchableOpacity style={[
          styles.appointmentCard,
          {
            width: isLarge ? 500 : isTablet ? 380 : Math.max(220, Math.min(width - 48, 380)),
            maxWidth: 600,
          },
        ]}> 
          <Text style={styles.appointmentTitle}>John Doe</Text>
          <Text style={styles.appointmentDetails}>General Checkup</Text>
          <View style={styles.appointmentDateTimeBox}>
            <CalendarPlus size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.appointmentDateTimeText}>June 12</Text>
            <View style={{ width: 18 }} />
            <Clock size={16} color="#fff" style={{ marginRight: 6, marginLeft: 0 }} />
            <Text style={styles.appointmentDateTimeText}>10:00 AM</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.appointmentCard,
          {
            width: isLarge ? 500 : isTablet ? 380 : Math.max(220, Math.min(width - 48, 380)),
            maxWidth: 600,
          },
        ]}>
          <Text style={styles.appointmentTitle}>Jane Smith</Text>
          <Text style={styles.appointmentDetails}>Follow-up</Text>
          <View style={styles.appointmentDateTimeBox}>
            <CalendarPlus size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.appointmentDateTimeText}>June 13</Text>
            <View style={{ width: 18 }} />
            <Clock size={16} color="#fff" style={{ marginRight: 6, marginLeft: 0 }} />
            <Text style={styles.appointmentDateTimeText}>2:30 PM</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.appointmentCard,
          {
            width: isLarge ? 500 : isTablet ? 380 : Math.max(220, Math.min(width - 48, 380)),
            maxWidth: 600,
          },
        ]}>
          <Text style={styles.appointmentTitle}>Michael Brown</Text>
          <Text style={styles.appointmentDetails}>Lab Results</Text>
          <View style={styles.appointmentDateTimeBox}>
            <CalendarPlus size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.appointmentDateTimeText}>June 14</Text>
            {/* Spacer for layout, replaced View with Text for RN ScrollView compatibility */}
            <Text style={{ width: 18 }} />
            <Clock size={16} color="#fff" style={{ marginRight: 6, marginLeft: 0 }} />
            <Text style={styles.appointmentDateTimeText}>9:00 AM</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      {/* Overview Matrices Title */}
      <Text style={styles.overviewTitle}>Overview Matrices</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.metricsHorizontalScroll,
          { paddingLeft: 0, paddingRight: Math.max(8, width * 0.02) },
        ]}
      >
        <View style={[
          styles.metricCard,
          {
            width: isLarge ? 220 : isTablet ? 180 : Math.max(120, Math.min(width * 0.38, 180)),
            height: isLarge ? 200 : isTablet ? 150 : 120,
            maxWidth: 240,
          },
        ]}> {/* Blue */}
          <View style={styles.metricIconRow}>
            <UserPlus size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>128</Text>
          <Text style={[styles.metricLabelText, { color: '#DBEAFE' }]}>Patients Under Care</Text>
        </View>
        <View style={[
          styles.metricCard,
          {
            width: isLarge ? 220 : isTablet ? 180 : Math.max(120, Math.min(width * 0.38, 180)),
            height: isLarge ? 200 : isTablet ? 150 : 120,
            maxWidth: 240,
          },
        ]}> {/* Green */}
          <View style={styles.metricIconRow}>
            <Baby size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>42</Text>
          <Text style={[styles.metricLabelText, { color: '#D1FAE5' }]}>Active Pregnancies</Text>
        </View>
        <View style={[
          styles.metricCard,
          {
            width: isLarge ? 220 : isTablet ? 180 : Math.max(120, Math.min(width * 0.38, 180)),
            height: isLarge ? 200 : isTablet ? 150 : 120,
            maxWidth: 240,
          },
        ]}> {/* Red */}
          <View style={styles.metricIconRow}>
            <AlertTriangle size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>7</Text>
          <Text style={[styles.metricLabelText, { color: '#FECACA' }]}>High-Risk Pregnancies</Text>
        </View>
        <View style={[
          styles.metricCard,
          {
            width: isLarge ? 220 : isTablet ? 180 : Math.max(120, Math.min(width * 0.38, 180)),
            height: isLarge ? 200 : isTablet ? 150 : 120,
            maxWidth: 240,
          },
        ]}> {/* Purple */}
          <View style={styles.metricIconRow}>
            <CalendarPlus size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>5</Text>
          <Text style={[styles.metricLabelText, { color: '#E9D5FF' }]}>Recent Births</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
    paddingHorizontal: 24, // Changed to 24 for consistency
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32, // Increased for more space below header
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 18,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
    marginTop: 2,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    marginRight: 8,
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
  },
  profilePicWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBarContainer: {
    marginBottom: 10, // minimal space below search bar
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  quickActionsScroll: {
    gap: 8,
    paddingRight: 8,
    marginBottom: 8, // minimal space below quick actions
  },
  quickActionButton: {
    width: 80, // increased from 68
    height: 80, // increased from 68
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    padding: 4,
  },
  quickActionText: {
    marginTop: 2, // minimal space
    fontSize: 9, // even smaller text
    color: '#64748B',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginTop: 5,
    marginBottom: 5, // minimal space below
  },
  appointmentsScroll: {
    gap: 16,
  },
  appointmentCard: {
    width: '100%', // Full width for responsiveness
    maxWidth: 500, // Maximum width
    height: 110,
    backgroundColor: '#2563EB', // filled blue
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2563EB', // blue border
    marginRight: 8,
    marginBottom: 1,
    marginTop: 3,
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  appointmentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff', // white for contrast
    marginBottom: 6,
  },
  appointmentDateTimeBox: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingHorizontal: 55,
    paddingVertical: 4,
    marginBottom: 8,
    flexDirection: 'row',
  },
  appointmentDateTimeText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
  appointmentDetails: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#DBEAFE', // light blue for details
    marginBottom: 2,
  },
  overviewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 1,
    marginLeft: 2,
  },
  metricsHorizontalScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 8,
  },
  metricCard: {
    width: '100%', // Full width for responsiveness
    minWidth: 120,
    maxWidth: 220,
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 10,
    marginRight: 14,
  },
  metricValue: {
    fontSize: 15, // larger
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    color: '#fff',
  },
  metricLabelText: {
    fontSize: 10, // larger
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    lineHeight: 18,
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 6,
  },
  metricIcon: {
    marginRight: 2,
  },
});