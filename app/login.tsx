import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock authentication - in a real app, this would be handled by your auth service
      if (email.includes('doctor')) {
        // Redirect to doctor dashboard
        router.replace('/(doctor)/dashboard');
      } else if (email.includes('patient')) {
        // Redirect to patient dashboard
        router.replace('/(patient)/dashboard');
      } else {
        // Default to doctor if no role is specified in email
        router.replace('/(doctor)/dashboard');
      }
    }, 1000);
  };

  // Quick login buttons for demo purposes
  const quickLogin = (userType: string) => {
    if (userType === 'doctor') {
      setEmail('doctor@example.com');
      setPassword('password123');
    } else {
      setEmail('patient@example.com');
      setPassword('password123');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Prestrack</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>


        <View style={styles.quickLoginContainer}>
          <TouchableOpacity 
            style={[styles.quickButton, styles.doctorButton]}
            onPress={() => quickLogin('doctor')}
          >
            <Text style={styles.quickButtonText}>Login as Doctor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickButton, styles.patientButton]}
            onPress={() => quickLogin('patient')}
          >
            <Text style={styles.quickButtonText}>Login as Patient</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#84c1ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  quickLoginContainer: {
    marginTop: 10,
  },
  quickButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  doctorButton: {
    backgroundColor: '#34C759',
  },
  patientButton: {
    backgroundColor: '#5856D6',
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
