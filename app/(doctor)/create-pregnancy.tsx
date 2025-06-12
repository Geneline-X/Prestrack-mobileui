import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ActivityIndicator, Alert, Platform, FlatList, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../../services/api';

const apiService = new ApiService();

export default function CreatePregnancy() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [startDate, setStartDate] = useState('');
  const [estimatedDueDate, setEstimatedDueDate] = useState('');
  const [highRisk, setHighRisk] = useState(false);
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientSuggestions, setPatientSuggestions] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);

  // Search patients as identifier changes
  const handleIdentifierChange = async (text: string) => {
    setIdentifier(text);
    setSelectedPatient(null);
    if (text.length < 3) {
      setPatientSuggestions([]);
      return;
    }
    setPatientSearchLoading(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;
      apiService.setAuthToken(token);
      const response = await apiService.searchPatients({ identifier: text, _count: '5' });
      if (response.entry) {
        setPatientSuggestions(response.entry.map((item: any) => item.resource));
      } else {
        setPatientSuggestions([]);
      }
    } catch (e) {
      setPatientSuggestions([]);
    } finally {
      setPatientSearchLoading(false);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIdentifier(patient.identifier?.[0]?.value || '');
    setPatientSuggestions([]);
  };

  // Calculate estimated due date when startDate changes
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    // Only calculate if date is in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const dt = new Date(date);
      if (!isNaN(dt.getTime())) {
        // Add 9 months (do not mutate original date)
        const due = new Date(dt);
        due.setMonth(due.getMonth() + 9);
        // Handle month overflow (e.g., adding 9 months to May 31)
        if (due.getDate() !== dt.getDate()) {
          due.setDate(0); // Go to last day of previous month
        }
        // Format as YYYY-MM-DD
        const yyyy = due.getFullYear();
        const mm = String(due.getMonth() + 1).padStart(2, '0');
        const dd = String(due.getDate()).padStart(2, '0');
        setEstimatedDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setEstimatedDueDate('');
      }
    } else {
      setEstimatedDueDate('');
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!identifier || !startDate || !estimatedDueDate || !status) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        router.replace('/login');
        return;
      }
      apiService.setAuthToken(token);
      const payload = {
        resourceType: 'Pregnancy',
        identifier,
        startDate,
        estimatedDueDate,
        highRisk,
        status,
        notes,
        ...(selectedPatient && { patient: { reference: `Patient/${selectedPatient.id}` } }),
      };
      const response = await apiService.createPregnancy(payload);
      if (response && !response.error) {
        Alert.alert('Success', 'Pregnancy registered successfully!', [
          { text: 'OK', onPress: () => router.replace('/(doctor)/dashboard') },
        ]);
      } else {
        throw new Error(response?.error || 'Failed to create pregnancy.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create pregnancy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Add Pregnancy</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Identifier *</Text>
            <TextInput
              style={styles.input}
              value={identifier}
              onChangeText={handleIdentifierChange}
              placeholder="e.g. Mtk123"
            />
            {patientSearchLoading && <ActivityIndicator size="small" color="#6366F1" style={{ marginTop: 4 }} />}
            {patientSuggestions.length > 0 && !selectedPatient && (
              <FlatList
                data={patientSuggestions}
                keyExtractor={item => item.id}
                style={styles.suggestionsList}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectPatient(item)}>
                    <Text style={styles.suggestionText}>{item.identifier?.[0]?.value} - {item.name?.[0]?.given?.join(' ')} {item.name?.[0]?.family}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Start Date *</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={handleStartDateChange}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Estimated Due Date *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#F1F5F9' }]}
              value={estimatedDueDate}
              editable={false}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <View style={styles.formGroupRow}>
            <Text style={styles.label}>High Risk</Text>
            <Switch
              value={highRisk}
              onValueChange={setHighRisk}
              thumbColor={highRisk ? '#EF4444' : '#ccc'}
              trackColor={{ false: '#ccc', true: '#FECACA' }}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Status *</Text>
            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[styles.statusButton, status === 'active' && styles.statusButtonActive]}
                onPress={() => setStatus('active')}
              >
                <Text style={[styles.statusButtonText, status === 'active' && styles.statusButtonTextActive]}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, status === 'completed' && styles.statusButtonActive]}
                onPress={() => setStatus('completed')}
              >
                <Text style={[styles.statusButtonText, status === 'completed' && styles.statusButtonTextActive]}>Completed</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes..."
              multiline
            />
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Create Pregnancy</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 24,
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  formGroupRow: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  statusButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  statusButtonText: {
    color: '#334155',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  error: {
    color: '#EF4444',
    marginBottom: 12,
    textAlign: 'center',
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
  suggestionsList: {
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 120,
    marginTop: 2,
    zIndex: 10,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 15,
    color: '#334155',
  },
});
