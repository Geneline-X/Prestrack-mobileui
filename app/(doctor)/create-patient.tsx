import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, useWindowDimensions, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { ApiService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiService = new ApiService();

type PatientForm = {
  identifier: string;
  givenName: string;
  familyName: string;
  gender: string;
  birthDate: string;
  addressLine: string;
  city: string;
  stateField: string;
  postalCode: string;
  country: string;
  phone: string;
};

export default function CreatePatientForm() {
  const { width } = useWindowDimensions();
  const isSmall = width < 375;
  const isTablet = width >= 600;
  const isLarge = width >= 900;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          apiService.setAuthToken(token);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Helper for responsive input style
  const getInputStyle = () => ({
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: isLarge ? 18 : isTablet ? 16 : 15,
    color: '#111827',
    minWidth: 0,
  });

  const [form, setForm] = useState<PatientForm>({
    identifier: '',
    givenName: '',
    familyName: '',
    gender: '',
    birthDate: '',
    addressLine: '',
    city: '',
    stateField: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState<Partial<PatientForm>>({});

  const handleChange = (key: keyof PatientForm, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (
    event: any, // Accept any event type for cross-platform compatibility
    selectedDate?: Date | undefined
  ) => {
    setShowDate(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      handleChange('birthDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const validate = () => {
    const newErrors: Partial<PatientForm> = {};
    if (!form.identifier) newErrors.identifier = 'Identifier is required';
    if (!form.givenName) newErrors.givenName = 'Given name is required';
    if (!form.familyName) newErrors.familyName = 'Family name is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!form.addressLine) newErrors.addressLine = 'Address line is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.stateField) newErrors.stateField = 'State is required';
    if (!form.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const patientData = {
        resourceType: 'Patient',
        identifier: [{
          value: form.identifier
        }],
        name: [{
          given: [form.givenName],
          family: form.familyName
        }],
        gender: form.gender.toLowerCase(),
        birthDate: form.birthDate,
        address: [{
          line: [form.addressLine],
          city: form.city,
          state: form.stateField,
          postalCode: form.postalCode,
          country: form.country
        }],
        telecom: [{
          system: 'phone',
          value: form.phone
        }]
      };

      const response = await apiService.createPatient(patientData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      Alert.alert(
        "Success",
        "Patient created successfully!",
        [{ 
          text: "OK", 
          onPress: () => router.push('/(doctor)/patients')
        }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create patient. Please try again.";
      
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
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[
      styles.container,
      {
        paddingHorizontal: isLarge ? 120 : isTablet ? 48 : Math.max(12, width * 0.08),
        paddingTop: isLarge ? 60 : isTablet ? 40 : 20,
        maxWidth: 700,
        alignSelf: 'center',
        width: '100%',
      },
    ]}>
      <Text style={styles.title}>Create Patient</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Identifier *</Text>
        <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
          <TextInput
            style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
            value={form.identifier}
            onChangeText={(v: string) => handleChange('identifier', v)}
            placeholder="Enter identifier"
            autoCapitalize="none"
          />
        </View>
        {errors.identifier && <Text style={styles.error}>{errors.identifier}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Given Name *</Text>
        <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
          <TextInput
            style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
            value={form.givenName}
            onChangeText={(v: string) => handleChange('givenName', v)}
            placeholder="Enter given name"
          />
        </View>
        {errors.givenName && <Text style={styles.error}>{errors.givenName}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Family Name *</Text>
        <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
          <TextInput
            style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
            value={form.familyName}
            onChangeText={(v: string) => handleChange('familyName', v)}
            placeholder="Enter family name"
          />
        </View>
        {errors.familyName && <Text style={styles.error}>{errors.familyName}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.gender}
            onValueChange={v => handleChange('gender', v)}
            style={styles.picker}
          >
            <Picker.Item label="Select gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Birth Date *</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
          <Text style={{ color: form.birthDate ? '#111827' : '#9CA3AF' }}>{form.birthDate || 'Select date'}</Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
        {errors.birthDate && <Text style={styles.error}>{errors.birthDate}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Address Line *</Text>
        <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
          <TextInput
            style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
            value={form.addressLine}
            onChangeText={(v: string) => handleChange('addressLine', v)}
            placeholder="Enter address line"
          />
        </View>
        {errors.addressLine && <Text style={styles.error}>{errors.addressLine}</Text>}
      </View>
      {/* Group city/state and postalCode/country horizontally for compactness */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={[styles.formGroup, { flex: 1 }]}> 
          <Text style={styles.label}>City *</Text>
          <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
            <TextInput
              style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
              value={form.city}
              onChangeText={(v: string) => handleChange('city', v)}
              placeholder="Enter city"
            />
          </View>
          {errors.city && <Text style={styles.error}>{errors.city}</Text>}
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}> 
          <Text style={styles.label}>State *</Text>
          <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
            <TextInput
              style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
              value={form.stateField}
              onChangeText={(v: string) => handleChange('stateField', v)}
              placeholder="Enter state"
            />
          </View>
          {errors.stateField && <Text style={styles.error}>{errors.stateField}</Text>}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={[styles.formGroup, { flex: 1 }]}> 
          <Text style={styles.label}>Postal Code *</Text>
          <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
            <TextInput
              style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
              value={form.postalCode}
              onChangeText={(v: string) => handleChange('postalCode', v)}
              placeholder="Enter postal code"
              keyboardType="numeric"
            />
          </View>
          {errors.postalCode && <Text style={styles.error}>{errors.postalCode}</Text>}
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}> 
          <Text style={styles.label}>Country *</Text>
          <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
            <TextInput
              style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
              value={form.country}
              onChangeText={(v: string) => handleChange('country', v)}
              placeholder="Enter country"
            />
          </View>
          {errors.country && <Text style={styles.error}>{errors.country}</Text>}
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <View style={{ width: isLarge ? 500 : isTablet ? 400 : '100%', maxWidth: isLarge ? 500 : isTablet ? 400 : 340, alignSelf: 'center' }}>
          <TextInput
            style={[getInputStyle(), isLarge ? { fontSize: 18 } : isTablet ? { fontSize: 16 } : {}]}
            value={form.phone}
            onChangeText={(v: string) => handleChange('phone', v)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
        {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
      </View>
      <TouchableOpacity 
        style={[
          styles.submitButton, 
          isSubmitting && styles.submitButtonDisabled
        ]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Patient</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  label: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    minWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 18,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 14,
    minWidth: 0,
    flex: 1,
    maxWidth: '100%',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 2,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginBottom: 2,
  },
  picker: {
    height: 44,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#A5A6F6',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
