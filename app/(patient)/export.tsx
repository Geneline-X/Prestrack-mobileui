import { View, StyleSheet } from "react-native"
import DataExport from "@/components/DataExport"

export default function PatientExportScreen() {
  return (
    <View style={styles.container}>
      <DataExport userType="patient" patientId="1" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
