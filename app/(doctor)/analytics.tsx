import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

export default function AnalyticsScreen() {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { paddingHorizontal: width > 600 ? 80 : 0, maxWidth: 700, alignSelf: 'center', width: '100%' }]}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.text}>Analytics dashboard coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#334155',
  },
});
