import { View, StyleSheet } from "react-native"
import NotificationCenter from "@/components/NotificationCenter"

export default function DoctorNotificationsScreen() {
  return (
    <View style={styles.container}>
      <NotificationCenter userType="doctor" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
