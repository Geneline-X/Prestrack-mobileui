import { View, StyleSheet } from "react-native"
import DataExport from "@/components/DataExport"

export default function DoctorExportScreen() {
  return (
    <View style={styles.container}>
      <DataExport userType="doctor" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
