import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutDashboard, FileText, Calendar, Share2 } from 'lucide-react-native';

export default function PatientLayout() {
  const pathname = usePathname();

  const getTabColor = (path: string) => {
    return pathname.includes(path) ? '#0EA5E9' : '#94A3B8';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <SafeAreaView edges={['bottom']} style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tab}>
            <LayoutDashboard size={24} color={getTabColor('dashboard')} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <FileText size={24} color={getTabColor('observations')} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Calendar size={24} color={getTabColor('appointments')} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Share2 size={24} color={getTabColor('sharing')} strokeWidth={2} />
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
    paddingHorizontal: 16,
  },
  tab: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
});