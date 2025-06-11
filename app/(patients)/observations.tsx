import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ColorValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Activity,
  Heart,
  Weight,
  Thermometer,
  ChevronRight,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface HealthDataItem {
  id: string;
  title: string;
  value: string;
  unit: string;
  time: string;
  icon: any;
  color: string;
}

const healthData: HealthDataItem[] = [
  {
    id: 'bp',
    title: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    time: '2 hours ago',
    icon: Activity,
    color: '#1E293B',
  },
  {
    id: 'hr',
    title: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    time: '2 hours ago',
    icon: Heart,
    color: '#1E293B',
  },
  {
    id: 'weight',
    title: 'Weight',
    value: '65',
    unit: 'kg',
    time: '1 day ago',
    icon: Weight,
    color: '#1E293B',
  },
  {
    id: 'temp',
    title: 'Temperature',
    value: '36.6',
    unit: '°C',
    time: '2 hours ago',
    icon: Thermometer,
    color: '#1E293B',
  },
];

export default function ObservationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Records</Text>
          <Text style={styles.subtitle}>Track your health metrics</Text>
        </View>

        {/* Health Data */}
        <View style={styles.section}>
          <View style={styles.cardList}>
            {healthData.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                activeOpacity={0.9}
              >
                <BlurView intensity={80} tint="light" style={styles.cardBlur}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <item.icon size={24} color={item.color} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.timestamp}>{item.time}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{item.value}</Text>
                    <Text style={styles.unit}>{item.unit}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.viewHistory}>View History</Text>
                    <ChevronRight size={16} color="#64748B" strokeWidth={1.5} />
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <BlurView intensity={80} tint="light" style={styles.infoBlur}>
            <Text style={styles.infoText}>
              Your health data is automatically updated after each visit
            </Text>
          </BlurView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // softer background
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
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
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 18,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
    marginTop: 6,
  },
  section: {
    padding: 28,
  },
  cardList: {
    gap: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardBlur: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 16,
    color: '#6366F1',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  value: {
    fontSize: 32,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.2,
  },
  unit: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#E0E7EF',
  },
  viewHistory: {
    flex: 1,
    fontSize: 15,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
  infoBox: {
    marginHorizontal: 28,
    marginBottom: 28,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  infoBlur: {
    padding: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#0F172A',
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});