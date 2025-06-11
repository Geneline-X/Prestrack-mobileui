import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import apiService from '../services/api';
import '@react-native-picker/picker';

const facilities = [
  'Connaught Hospital',
  'Princess Christian Maternity Hospital (PCMH)',
  'Choithram Memorial Hospital',
  'Bo Government Hospital',
  'Makeni Government Hospital',
  'Kenema Government Hospital',
  'Koidu Government Hospital',
  'Lunsar Hospital',
  'Masanga Hospital',
  'Other',
];

const districts = [
  'Western Area Urban',
  'Western Area Rural',
  'Bo',
  'Bombali',
  'Bonthe',
  'Kailahun',
  'Kambia',
  'Kenema',
  'Koinadugu',
  'Kono',
  'Moyamba',
  'Port Loko',
  'Pujehun',
  'Tonkolili',
];

const regions = [
  'Western',
  'Northern',
  'Southern',
  'Eastern',
];

const roles = [
  { label: 'Nurse', value: 'nurse' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Patient', value: 'patient' },
  { label: 'Facility Admin', value: 'facility_admin' },
  { label: 'Super Admin', value: 'super_admin' },
];

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    facility: '',
    district: '',
    region: '',
    role: 'facility_admin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiService.register({
        username: form.username,
        email: form.email,
        password: form.password,
        profile: {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          facility: form.facility,
          district: form.district,
          region: form.region,
        },
        role: form.role,
      });
      if (res?.resourceType === 'OperationOutcome' && Array.isArray((res as any).issue)) {
        setError((res as any).issue[0]?.diagnostics || 'Registration failed');
      } else if (res?.resourceType === 'User' && (res as any).status === 'active') {
        router.replace('/login');
      } else {
        setError('Registration failed');
      }
    } catch (e: any) {
      setError(e?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={64}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput style={styles.input} placeholder="Username" value={form.username} onChangeText={v => handleChange('username', v)} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={v => handleChange('email', v)} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={v => handleChange('password', v)} secureTextEntry />
          <TextInput style={styles.input} placeholder="First Name" value={form.firstName} onChangeText={v => handleChange('firstName', v)} />
          <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={v => handleChange('lastName', v)} />
          <TextInput style={styles.input} placeholder="Phone Number" value={form.phoneNumber} onChangeText={v => handleChange('phoneNumber', v)} keyboardType="phone-pad" />
          <Picker
            selectedValue={form.facility}
            onValueChange={(v: string) => handleChange('facility', v)}
            style={styles.input}
          >
            <Picker.Item label="Select Facility" value="" />
            {facilities.map(f => (
              <Picker.Item label={f} value={f} key={f} />
            ))}
          </Picker>
          <Picker
            selectedValue={form.district}
            onValueChange={(v: string) => handleChange('district', v)}
            style={styles.input}
          >
            <Picker.Item label="Select District" value="" />
            {districts.map(d => (
              <Picker.Item label={d} value={d} key={d} />
            ))}
          </Picker>
          <Picker
            selectedValue={form.region}
            onValueChange={(v: string) => handleChange('region', v)}
            style={styles.input}
          >
            <Picker.Item label="Select Region" value="" />
            {regions.map(r => (
              <Picker.Item label={r} value={r} key={r} />
            ))}
          </Picker>
          <Picker
            selectedValue={form.role}
            onValueChange={(v: string) => handleChange('role', v)}
            style={styles.input}
          >
            <Picker.Item label="Select Role" value="" />
            {roles.map(r => (
              <Picker.Item label={r.label} value={r.value} key={r.value} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/login')} style={styles.link}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafbfc',
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: '#6366F1',
    fontSize: 15,
  },
});
