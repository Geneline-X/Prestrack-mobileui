import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutDashboard, FileText, Calendar, Users, Settings, BarChart2 } from 'lucide-react-native';

export default function PatientLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const getTabColor = (path: string) => {
    return pathname.includes(path) ? '#0EA5E9' : '#94A3B8';
  };

  return (
    <View style={[styles.container, { alignItems: 'center' }]}>
      <View style={[styles.content, { paddingHorizontal: width > 600 ? 80 : 0, maxWidth: 700, width: '100%' }]}>
        <Slot />
      </View>
      <SafeAreaView edges={['bottom']} style={styles.tabBarContainer}>
        <View style={[styles.tabBar, { paddingHorizontal: width > 600 ? 80 : 16, maxWidth: 700, width: '100%', alignSelf: 'center' }]}>
          <TouchableOpacity style={styles.tab} onPress={() => router.replace('/(doctor)/dashboard')}>
            <LayoutDashboard size={24} color={getTabColor('dashboard')} strokeWidth={2} />
            <Text style={styles.tabLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => router.replace('/(doctor)/patients')}>
            <Users size={24} color={getTabColor('patients')} strokeWidth={2} />
            <Text style={styles.tabLabel}>Patients</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => router.replace('/(doctor)/analytics')}>
            <BarChart2 size={24} color={getTabColor('analytics')} strokeWidth={2} />
            <Text style={styles.tabLabel}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => router.replace('/(doctor)/appointments')}>
            <Calendar size={24} color={getTabColor('appointments')} strokeWidth={2} />
            <Text style={styles.tabLabel}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => router.replace('/(doctor)/profile')}>
            <Settings size={24} color={getTabColor('profile')} strokeWidth={2} />
            <Text style={styles.tabLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16, // will be overridden by responsive logic
  },
  tab: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
});