import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, Baby, Eye, EyeOff } from 'lucide-react-native';
import apiService from '../../services/api';
import * as SecureStore from 'expo-secure-store';

// Mock hospitals in Sierra Leone
const facilities = [
  {
    id: 1,
    name: 'Connaught Hospital',
    location: 'Freetown',
    type: 'Government',
  },
  {
    id: 2,
    name: 'Princess Christian Maternity Hospital (PCMH)',
    location: 'Freetown',
    type: 'Government',
  },
  {
    id: 3,
    name: 'Choithram Memorial Hospital',
    location: 'Hill Station, Freetown',
    type: 'Private',
  },
  {
    id: 4,
    name: 'Bo Government Hospital',
    location: 'Bo',
    type: 'Government',
  },
  {
    id: 5,
    name: 'Makeni Government Hospital',
    location: 'Makeni',
    type: 'Government',
  },
];

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.login(username, password);
      console.log('Login response:', response);
      
      // Handle different response formats
      const accessToken = response.accessToken || response.token;
      const refreshToken = response.refreshToken;
      const user = response.user || {};
      
      // Store user info including patientId
      await SecureStore.setItemAsync('user_info', JSON.stringify(user));
      
      if (accessToken) {
        // Store tokens securely
        await Promise.all([
          SecureStore.setItemAsync('auth_token', accessToken),
          refreshToken ? SecureStore.setItemAsync('refresh_token', refreshToken) : Promise.resolve(),
        ]);
        
        apiService.setAuthToken(accessToken);
        
        // Handle user role based routing
        const userRole = user.role?.toLowerCase();
        console.log('User role:', userRole);
        
        if (!userRole) {
          setError('User role not found. Please contact support.');
          return;
        }
        
        // Redirect based on role
        if (['super_admin', 'facility_admin', 'admin', 'patient'].includes(userRole)) {
          await router.replace('/(patient)/dashboard');
        } else if (['doctor', 'nurse'].includes(userRole)) {
          await router.replace('/(doctor)/dashboard');
        } else {
          setError('Unknown user role. Please contact support.');
        }
      } else if ((response as any).resourceType === 'OperationOutcome' && Array.isArray((response as any).issue)) {
        setError((response as any).issue[0]?.diagnostics || 'Login failed');
      } else {
        setError((response as any).error || 'Invalid credentials');
      }
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Baby size={80} color="#6366F1" strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#9CA3AF" strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#9CA3AF" strokeWidth={2} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <Text style={styles.loginButtonText}>Loading...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity style={{ marginTop: 16, alignItems: 'center' }} onPress={() => router.replace('/register')}>
              <Text style={{ color: '#6366F1' }}>Don't have an account? Register</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  helpContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
    marginBottom: 8,
  },
  credentialsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
});