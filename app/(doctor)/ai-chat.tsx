import { View, StyleSheet } from "react-native"
import AIChat from "@/components/AIChat"

export default function DoctorAIChatScreen() {
  return (
    <View style={styles.container}>
      <AIChat userType="doctor" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
