import { View, StyleSheet } from "react-native"
import AIChat from "@/components/AIChat"

export default function PatientAIChatScreen() {
  return (
    <View style={styles.container}>
      <AIChat userType="patient" patientId="1" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
