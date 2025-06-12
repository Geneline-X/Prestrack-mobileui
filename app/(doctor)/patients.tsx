import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ApiService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const apiService = new ApiService();

// Define a type for patient data based on FHIR Patient resource structure
interface Patient {
  id?: string;
  identifier?: Array<{ value: string }>;
  name?: Array<{ given?: string[]; family?: string }>;
  gender?: string;
  birthDate?: string;
  address?: Array<{ line?: string[]; city?: string; state?: string; postalCode?: string; country?: string }>;
  telecom?: Array<{ system: string; value: string }>;
}

export default function PatientsScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          apiService.setAuthToken(token);
          const response = await apiService.getPatients();
          
          if (response.error) {
            throw new Error(response.error);
          }

          // Assuming the API returns a bundle with 'entry' containing resources
          if (response.entry) {
            setPatients(response.entry.map(item => item.resource as Patient));
          } else if (Array.isArray(response.data)) { // Handle cases where data might be a direct array
             setPatients(response.data as Patient[]);
          } else {
             setPatients([]); // No patients found or unexpected format
          }

        } else {
          // Redirect to login if no token is found
          router.replace('/login');
        }
      } catch (err: any) {
        console.error('Failed to fetch patients:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Failed to load patients. Please try again.";
        
        if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
          Alert.alert(
            "Session Expired",
            "Please log in again.",
            [{ 
              text: "OK", 
              onPress: () => router.replace('/login')
            }]
          );
        } else {
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity 
      style={styles.patientCard}
      // onPress={() => router.push(`/doctor/patients/${item.id}` as any)} // Example navigation to detail screen
    >
      <Text style={styles.patientName}>
        {item.name?.[0]?.given?.join(' ') || ''} {item.name?.[0]?.family || ''}
      </Text>
      <View style={styles.patientDetailsContainer}>
        <Text style={styles.patientDetail}>Identifier: {item.identifier?.[0]?.value || 'N/A'}</Text>
        <Text style={styles.patientDetail}>Gender: {item.gender ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : 'N/A'}</Text>
        <Text style={styles.patientDetail}>Birth Date: {item.birthDate || 'N/A'}</Text>
        {item.telecom?.[0]?.value && (
          <Text style={styles.patientDetail}>Phone: {item.telecom[0].value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Filter patients based on search query (name or identifier)
  const filteredPatients = patients.filter(patient => {
    const nameMatch = patient.name?.[0]?.given?.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      patient.name?.[0]?.family?.toLowerCase().includes(searchQuery.toLowerCase());
    const identifierMatch = patient.identifier?.[0]?.value?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || identifierMatch;
  });

  return (
    <View style={[styles.container, {
      paddingHorizontal: width > 600 ? 80 : 0,
      maxWidth: 700,
      alignSelf: 'center',
      width: '100%',
      paddingTop: insets.top, // Add top padding based on safe area inset
    }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(doctor)/create-patient' as any)}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients by name or identifier"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={{ flex: 1, marginTop: 20 }}>{/* Increased marginTop and removed marginBottom */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredPatients.length > 0 ? ( // Use filteredPatients here
          <FlatList
            data={filteredPatients} // Use filteredPatients here
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id || item.identifier?.[0]?.value || Math.random().toString()} // Use a unique key
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.text}>No patients found.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Keep marginBottom for spacing below header
    paddingHorizontal: 20,
    // Removed paddingTop: 10, as safe area inset handles top spacing
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  text: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 20, // Spacing below search bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#111827',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8, // Further reduced vertical padding
    paddingHorizontal: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2, // Further reduced spacing below name
  },
  patientDetailsContainer: {
    marginTop: 2, // Keep spacing above details
  },
  patientDetail: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 0, // Removed spacing between detail lines
  },
  listContent: {
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
