import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, UserPlus } from 'lucide-react-native';
import { ApiService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiService = new ApiService();

export default function VisitsScreen() {
  const [showForm, setShowForm] = useState(true); // Show form by default
  const [visitDate, setVisitDate] = useState('');
  const [type, setType] = useState('antenatal');
  const [notes, setNotes] = useState('');
  const [providerId, setProviderId] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [loading, setLoading] = useState(false);

  const handleScheduleVisit = async () => {
    if (!visitDate || !type || !providerId) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');
      apiService.setAuthToken(token);
      // You may need to pass pregnancyId as well, depending on your backend
      const payload = {
        visitDate,
        type,
        notes,
        providerId,
        status,
      };
      // TODO: Replace with actual pregnancyId
      const pregnancyId = 'pregnancy-123';
      const res = await apiService.createPrenatalVisit(pregnancyId, payload);
      if (res && !res.error) {
        Alert.alert('Success', 'Visit scheduled successfully!');
        setShowForm(false);
        setVisitDate('');
        setType('antenatal');
        setNotes('');
        setProviderId('');
        setStatus('scheduled');
      } else {
        throw new Error(res?.error || 'Failed to schedule visit.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to schedule visit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Visits</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(!showForm)}>
            <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ Schedule Visit'}</Text>
          </TouchableOpacity>
        </View>
        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Schedule New Visit</Text>
            <TextInput
              style={styles.input}
              placeholder="Visit Date (YYYY-MM-DD)"
              value={visitDate}
              onChangeText={setVisitDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Type (e.g. antenatal)"
              value={type}
              onChangeText={setType}
            />
            <TextInput
              style={styles.input}
              placeholder="Provider ID"
              value={providerId}
              onChangeText={setProviderId}
            />
            <TextInput
              style={styles.input}
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleScheduleVisit} disabled={loading}>
              <Text style={styles.submitButtonText}>{loading ? 'Scheduling...' : 'Schedule Visit'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* TODO: Render visits list here, similar to appointments */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 28,
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
  form: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E7EF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
