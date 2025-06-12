import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Stack } from 'expo-router';

export default function RecordsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Medical Records',
        }}
      />
      <Text variant="headlineMedium">Medical Records</Text>
      <Text variant="bodyLarge" style={styles.comingSoon}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoon: {
    marginTop: 8,
    opacity: 0.6,
  },
}); 