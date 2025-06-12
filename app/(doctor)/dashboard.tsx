import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, useWindowDimensions, Platform, ActivityIndicator, Alert } from 'react-native';
import { Bell, Search, UserPlus, CalendarPlus, MessageSquare, FileText, AlertTriangle, Clock, Baby } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ApiService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const apiService = new ApiService();

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

  const [patientCount, setPatientCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [errorCount, setErrorCount] = useState<string | null>(null);
  const [upcomingVisits, setUpcomingVisits] = useState<any[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const isFocused = useIsFocused ? useIsFocused() : true;

  useEffect(() => {
    const fetchPatientCount = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          // Redirect to login if no token is found
          router.replace('/login');
          return;
        }
        apiService.setAuthToken(token);
        const response = await apiService.getPatients({ _summary: 'count' }); // Request only count for efficiency
        
        if (response.error) {
          throw new Error(response.error);
        }

        setPatientCount(response.total || 0);

      } catch (err: any) {
        console.error('Failed to fetch patient count:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Failed to load patient count.";
        
        if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('Token expired')) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again.",
            [{ 
              text: "OK", 
              onPress: () => router.replace('/login')
            }]
          );
        } else {
          setErrorCount(errorMessage);
        }
      } finally {
        setIsLoadingCount(false);
      }
    };
    
    fetchPatientCount();
  }, []);

  useEffect(() => {
    const fetchVisits = async () => {
      setLoadingVisits(true);
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return;
        apiService.setAuthToken(token);
        // Fetch all pregnancies and get visits for the first valid Pregnancy resource
        const pregnancies = await apiService.getPregnancies({ status: 'active', _count: '1' });
        let pregnancyId = null;
        if (Array.isArray(pregnancies.entry)) {
          const firstPregnancy = pregnancies.entry.find(
            (e: any) => e.resource && (e.resource.resourceType === 'Pregnancy' || e.resource.resourceType === 'Condition') && typeof e.resource.id === 'string'
          );
          pregnancyId = firstPregnancy && typeof firstPregnancy.resource === 'object' ? (firstPregnancy.resource as { id?: string }).id : undefined;
        }
        if (pregnancyId) {
          const visitsRes = await apiService.getPrenatalVisits(pregnancyId);
          setUpcomingVisits(visitsRes.entry ? visitsRes.entry.map((e: any) => e.resource) : []);
        } else {
          setUpcomingVisits([]);
        }
      } catch (e) {
        setUpcomingVisits([]);
      } finally {
        setLoadingVisits(false);
      }
    };
    fetchVisits();
  }, [isFocused]);

  // Calculate responsive horizontal padding
  const horizontalPadding = isLarge ? 120 : isTablet ? 48 : Math.max(12, width * 0.04);

  // Calculate dynamic metric card width
  const metricCardWidth = isLarge ? 220 : isTablet ? 180 : Math.max(140, (width - 2 * horizontalPadding - 20) / 2); // Adjusted calculation for small screens and gap

  return (
    <View style={[
      styles.container,
      {
        paddingHorizontal: horizontalPadding, // Use calculated padding
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
          { paddingLeft: horizontalPadding, paddingRight: horizontalPadding - 12 }, // Apply responsive padding, adjust right padding for last card's margin
        ]}
      >
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.replace('/(doctor)/create-patient')}>
          <UserPlus size={28} color="#6366F1" />
          <Text style={styles.quickActionText}>Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/(doctor)/visits')}>
          <CalendarPlus size={28} color="#10B981" />
          <Text style={styles.quickActionText}>Schedule Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <MessageSquare size={28} color="#F59E0B" />
          <Text style={styles.quickActionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/(doctor)/create-pregnancy')}>
          <Baby size={28} color="#A0522D" />
          <Text style={styles.quickActionText}>Add Pregnancy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <AlertTriangle size={28} color="#EF4444" />
          <Text style={styles.quickActionText}>High Risk</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Search Bar - moved up under quick actions */}
      <View style={[styles.searchBarContainer, { paddingHorizontal: horizontalPadding }]}>{/* Apply responsive padding */}
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      {/* Upcoming Visits Section */}
      <Text style={[styles.sectionTitle, { paddingHorizontal: horizontalPadding }]}>Upcoming Visits</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.appointmentsScroll,
          { paddingLeft: horizontalPadding, paddingRight: horizontalPadding - 12 },
        ]}
        style={{ marginTop: 10, marginBottom: 20 }}
      >
        {loadingVisits ? (
          <ActivityIndicator size="small" color="#6366F1" style={{ marginTop: 20 }} />
        ) : upcomingVisits.length === 0 ? (
          <Text style={{ color: '#64748B', fontSize: 16, marginTop: 20 }}>No upcoming visits.</Text>
        ) : (
          upcomingVisits.map((visit, idx) => (
            <TouchableOpacity key={visit.id || idx} style={[
              styles.appointmentCard,
              { width: isLarge ? 500 : isTablet ? 380 : Math.max(220, width - 2 * horizontalPadding - 12) },
            ]}>
              <Text style={styles.appointmentTitle}>{visit.reasonCode?.[0]?.text || 'Prenatal Visit'}</Text>
              <Text style={styles.appointmentDetails}>{visit.description || 'Scheduled prenatal care visit'}</Text>
              <View style={styles.appointmentDateTimeBox}>
                <CalendarPlus size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.appointmentDateTimeText}>{visit.start?.split('T')[0]}</Text>
                <View style={{ width: 18 }} />
                <Clock size={16} color="#fff" style={{ marginRight: 6, marginLeft: 0 }} />
                <Text style={styles.appointmentDateTimeText}>{visit.start?.split('T')[1]?.slice(0,5) || ''}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      {/* Overview Matrices Title */}
      <Text style={[styles.overviewTitle, { paddingHorizontal: horizontalPadding, marginTop: 20 }]}>Overview Matrices</Text>{/* Adjusted spacing and applied responsive padding */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.metricsHorizontalScroll,
          { paddingLeft: horizontalPadding, paddingRight: horizontalPadding - 10 }, // Apply responsive padding, adjust right padding for last card's margin
        ]}
      >
        <View style={[
          styles.metricCard,
          { width: metricCardWidth, backgroundColor: '#3B82F6' }, // Blue
        ]}> 
          <View style={styles.metricIconRow}>
            <UserPlus size={28} color="#fff" style={styles.metricIcon} />
          </View>
          {isLoadingCount ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : errorCount ? (
            <Text style={[styles.metricValue, { fontSize: 14 }]}>Error</Text>
          ) : (
            <Text style={styles.metricValue}>{patientCount}</Text>
          )}
          <Text style={[styles.metricLabelText, { color: '#DBEAFE' }]}>Patients Under Care</Text>
        </View>
        <View style={[
          styles.metricCard,
          { width: metricCardWidth, backgroundColor: '#10B981' }, // Green
        ]}> 
          <View style={styles.metricIconRow}>
            <Baby size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>42</Text>
          <Text style={[styles.metricLabelText, { color: '#D1FAE5' }]}>Active Pregnancies</Text>
        </View>
        <View style={[
          styles.metricCard,
          { width: metricCardWidth, backgroundColor: '#EF4444' }, // Red
        ]}> 
          <View style={styles.metricIconRow}>
            <AlertTriangle size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>7</Text>
          <Text style={[styles.metricLabelText, { color: '#FECACA' }]}>High-Risk Pregnancies</Text>
        </View>
        <View style={[
          styles.metricCard,
          { width: metricCardWidth, backgroundColor: '#F59E0B' }, // Orange/Yellow for Referrals
        ]}> 
          <View style={styles.metricIconRow}>
            <UserPlus size={28} color="#fff" style={styles.metricIcon} />{/* Changed icon to UserPlus */}
          </View>
          <Text style={styles.metricValue}>5</Text>{/* Keeping value as is for now */
          }
          <Text style={[styles.metricLabelText, { color: '#FEF3C7' }]}>Referrals</Text>{/* Changed text to Referrals and updated color */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    // Removed paddingTop and paddingHorizontal from here as they are applied dynamically
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32, // Increased for more space below header
    // Removed paddingHorizontal from here as it is applied to the container
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
    marginBottom: 20, // Increased space below search bar
    // Removed paddingHorizontal from here as it is applied dynamically
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
    gap: 12, // Increased gap between quick action buttons
    paddingBottom: 16, // Increased space below quick actions
    // Removed paddingLeft and paddingRight from here
  },
  quickActionButton: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    // Removed marginHorizontal
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    padding: 4,
  },
  quickActionText: {
    marginTop: 4, // Increased space below icon
    fontSize: 10, // Slightly increased font size
    color: '#64748B',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 16, // Standardized spacing below section titles
    marginTop: 20, // Added space above section
    // Removed marginLeft and paddingHorizontal
  },
  appointmentsScroll: {
    gap: 12, // Adjusted gap between appointment cards
    // Removed paddingLeft and paddingRight from here
  },
  appointmentCard: {
    width: '100%',
    maxWidth: 500,
    height: 110,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2563EB',
    marginRight: 12, // Adjusted spacing between cards
    // Removed marginBottom and marginTop
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
    color: '#fff',
    marginBottom: 8, // Adjusted spacing
  },
  appointmentDateTimeBox: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingHorizontal: 12, // Adjusted padding
    paddingVertical: 6, // Adjusted padding
    marginTop: 8, // Added space above
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
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
    color: '#DBEAFE',
    marginBottom: 4, // Adjusted spacing
  },
  overviewTitle: {
    fontSize: 18, // Standardized font size
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginBottom: 16, // Standardized spacing below section titles
    marginTop: 20, // Added space above overview section
    // Removed marginLeft and paddingHorizontal
  },
  metricsHorizontalScroll: {
    gap: 10, // Keep gap between metric cards
    paddingBottom: 8,
    // Removed paddingLeft and paddingRight from here
  },
  metricCard: {
    minWidth: 140,
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0,
    padding: 10,
    marginRight: 10, // Keep marginRight for spacing between cards
  },
  metricValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    color: '#fff',
  },
  metricLabelText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    lineHeight: 16,
  },
  metricIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    marginRight: 0,
  },
});