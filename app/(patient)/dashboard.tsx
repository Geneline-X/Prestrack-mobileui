"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, StatusBar, RefreshControl, TouchableOpacity } from "react-native"
import { Text, Surface } from "react-native-paper"
import { format } from "date-fns"
import { Calendar, Activity, FileText, Heart, Baby, TrendingUp } from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router'
import { apiService } from '../../services/api'

// Define FHIR types
type Resource = {
  resourceType: string;
  id?: string;
  [key: string]: any;
};

// BundleEntry type is already defined above

type Bundle = {
  resourceType: 'Bundle';
  type: 'searchset' | 'collection' | 'batch' | 'transaction' | 'batch-response' | 'transaction-response' | 'history' | 'searchset' | 'collection';
  total?: number;
  entry?: BundleEntry[];
  link?: Array<{ relation: string; url: string }>;
};

type Patient = Resource & {
  resourceType: 'Patient';
  id: string;
  name?: Array<{
    given?: string[];
    family?: string;
    text?: string;
  }>;
  gender?: string;
  birthDate?: string;
  telecom?: Array<{
    system: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
    value: string;
    use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  }>;
  address?: Array<{
    use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
};

type Observation = Resource & {
  resourceType: 'Observation';
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  code: {
    coding: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject?: {
    reference: string;
    display?: string;
  };
  effectiveDateTime?: string;
  valueQuantity?: {
    value: number;
    unit?: string;
    system?: string;
    code?: string;
  };
  valueString?: string;
  valueCodeableConcept?: {
    coding: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
};

type Condition = Resource & {
  resourceType: 'Condition';
  clinicalStatus?: {
    coding: Array<{
      system?: string;
      code: string;
      display?: string;
    }>;
    text?: string;
  };
  code?: {
    coding: Array<{
      system?: string;
      code: string;
      display?: string;
    }>;
    text?: string;
  };
  subject?: {
    reference: string;
    display?: string;
  };
  onsetDateTime?: string;
  recordedDate?: string;
};

// Simple loading component
const LoadingSpinner = () => (
  <View style={styles.centered}>
    <Text>Loading...</Text>
  </View>
);

// Simple error message component
const ErrorMessage = ({ message }: { message: string }) => (
  <View style={styles.centered}>
    <Text style={styles.errorText}>Error: {message}</Text>
  </View>
);

interface DashboardData {
  patientId: string
  pregnancyStatus: string
  weeksPregnant: number
  nextAppointment?: string
  recentObservations: Array<{
    id: string
    type: string
    value: string
    date: string
  }>
  patient?: any
  activePregnancy?: any
}

interface FHIRResource {
  resourceType: string;
  id?: string;
  [key: string]: any;
}

interface BundleEntry {
  resource: FHIRResource;
  fullUrl?: string;
}

interface DashboardResponse {
  // Direct response format
  patient?: any;
  activePregnancy?: any;
  recentObservations?: any[];
  summary?: any;
  
  // FHIR Bundle format
  resourceType?: string;
  type?: string;
  entry?: BundleEntry[];
  total?: number;
}

const COLORS = {
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  primaryLight: "#A5B4FC",
  secondary: "#EC4899",
  accent: "#10B981",
  warning: "#F59E0B",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  text: "#1E293B",
  textSecondary: "#64748B",
  divider: "#E2E8F0",
  success: "#22C55E",
  error: "#EF4444",
}

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the token from storage
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        console.log('No auth token found, redirecting to login');
        await router.replace('/login');
        return;
      }
      
      apiService.setAuthToken(token);
      
      // Get user info from SecureStore
      const userInfo = await SecureStore.getItemAsync('user_info');
      if (!userInfo) {
        throw new Error('User information not found. Please log in again.');
      }
      
      const user = JSON.parse(userInfo);
      
      try {
        // Use the getPatientDashboard method which will handle the patient-specific API calls
        const dashboardResponse = await apiService.getPatientDashboard<DashboardResponse>();
        
        console.log('Dashboard response:', dashboardResponse);
        
        // Extract data from the dashboard response
        const patient = dashboardResponse.patient;
        const recentObservations = dashboardResponse.recentObservations || [];
        const activePregnancy = dashboardResponse.activePregnancy;
        
        if (!patient) {
          throw new Error('Patient data not found in dashboard response');
        }
        
        // Calculate weeks pregnant if we have the last menstrual period
        let weeksPregnant = 0;
        if (activePregnancy?.lastMenstrualPeriod) {
          try {
            const lmp = new Date(activePregnancy.lastMenstrualPeriod);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lmp.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            weeksPregnant = Math.floor(diffDays / 7);
          } catch (error) {
            console.error('Error calculating weeks pregnant:', error);
          }
        } else if (activePregnancy?.onsetDateTime) {
          // Fallback to onsetDateTime if lastMenstrualPeriod is not available
          try {
            const lmp = new Date(activePregnancy.onsetDateTime);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lmp.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            weeksPregnant = Math.floor(diffDays / 7);
          } catch (error) {
            console.error('Error calculating weeks pregnant from onset date:', error);
          }
        }
        
        // Transform observations to match the expected format
        const formattedObservations = recentObservations.map(obs => {
          let value = 'N/A';
          
          if (obs.valueQuantity) {
            value = `${obs.valueQuantity.value} ${obs.valueQuantity.unit || ''}`.trim();
          } else if (obs.valueString) {
            value = obs.valueString;
          } else if (obs.valueCodeableConcept?.text) {
            value = obs.valueCodeableConcept.text;
          }
          
          return {
            id: obs.id || '',
            type: obs.code?.text || 'Observation',
            value,
            date: obs.effectiveDateTime ? format(new Date(obs.effectiveDateTime), 'MMM d, yyyy') : 'Unknown date',
          };
        });
        
        // Update the dashboard data state
        setDashboardData({
          patientId: patient.id || '',
          pregnancyStatus: activePregnancy ? 'Pregnant' : 'Not Pregnant',
          weeksPregnant,
          nextAppointment: patient.nextAppointment,
          recentObservations: formattedObservations,
          patient,
          activePregnancy
        });
      } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error);
        
        // Handle authentication errors
        if (error && 
            typeof error === 'object' && 
            'message' in error && 
            typeof error.message === 'string' &&
            (error.message.includes('401') || 
            ('status' in error && (error as any).status === 401))) {
          console.log('Authentication error, redirecting to login');
          await Promise.all([
            SecureStore.deleteItemAsync('auth_token'),
            SecureStore.deleteItemAsync('refresh_token')
          ]);
          router.replace('/login');
          return;
        }
        
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getObservationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "blood-pressure":
        return Heart
      case "weight":
        return TrendingUp
      case "temperature":
        return Activity
      default:
        return FileText
    }
  }

  const getObservationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "blood-pressure":
        return COLORS.error
      case "weight":
        return COLORS.accent
      case "temperature":
        return COLORS.warning
      default:
        return COLORS.primary
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : dashboardData ? (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/* Dashboard content */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back, {dashboardData.patient?.name?.[0]?.given?.[0] || 'Patient'}</Text>
            <Text style={styles.subtitle}>Here's your pregnancy overview</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{dashboardData.weeksPregnant} weeks</Text>
              <Text style={styles.statLabel}>Pregnant</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {dashboardData.activePregnancy?.status || 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Observations</Text>
            {dashboardData.recentObservations.length > 0 ? (
              dashboardData.recentObservations.map((obs, index) => (
                <View key={obs.id || index} style={styles.observationCard}>
                  <Text style={styles.observationType}>{obs.type}</Text>
                  <Text style={styles.observationValue}>{obs.value}</Text>
                  <Text style={styles.observationDate}>{obs.date}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No recent observations</Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <Text>No data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    margin: 16,
  },
  welcomeSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  statCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  cardSectionTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  observationCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  observationType: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  observationValue: {
    fontSize: 18,
    marginBottom: 4,
    color: '#111827',
    fontWeight: '500',
  },
  observationDate: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  noDataText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  // Scroll container style
  // Scroll container style is defined above
  mainContent: {
    paddingTop: 24,
  },
  pregnancyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pregnancyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  pregnancyInfo: {
    marginLeft: 16,
    flex: 1,
  },
  pregnancyStatus: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  pregnancyWeeks: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  appointmentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  // Divider styles
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 16,
  },
  appointmentDate: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  appointmentTime: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  observationsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  observationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  observationItem: {
    marginBottom: 12,
  },
  observationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  observationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  observationIcon: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
})
