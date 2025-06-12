import { View, StyleSheet } from "react-native"
import NotificationCenter from "@/components/NotificationCenter"

export default function PatientNotificationsScreen() {
  return (
    <View style={styles.container}>
      <NotificationCenter userType="patient" patientId="1" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
