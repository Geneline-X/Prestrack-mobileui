"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native"
import { router } from "expo-router"
import { Plus, Search } from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { mockPatients } from "@/data/mockData"

// Define a type for patient data based on FHIR Patient resource structure
interface Patient {
  id?: string
  identifier?: Array<{ value: string }>
  name?: Array<{ given?: string[]; family?: string }>
  gender?: string
  birthDate?: string
  address?: Array<{ line?: string[]; city?: string; state?: string; postalCode?: string; country?: string }>
  telecom?: Array<{ system: string; value: string }>
  pregnancyStatus?: string
  weeksPregnant?: number
  riskLevel?: string
}

export default function PatientsScreen() {
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Use mock data instead of API calls
    setTimeout(() => {
      setPatients(mockPatients)
      setIsLoading(false)
    }, 500) // Simulate loading time
  }, [])

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity style={styles.patientCard} onPress={() => router.push(`/(doctor)/patient-detail?id=${item.id}`)}>
      <View style={styles.patientHeader}>
        <Text style={styles.patientName}>
          {item.name?.[0]?.given?.join(" ") || ""} {item.name?.[0]?.family || ""}
        </Text>
        {item.riskLevel && (
          <View
            style={[
              styles.riskBadge,
              {
                backgroundColor:
                  item.riskLevel === "high" ? "#FEE2E2" : item.riskLevel === "medium" ? "#FEF3C7" : "#DCFCE7",
              },
            ]}
          >
            <Text
              style={[
                styles.riskText,
                { color: item.riskLevel === "high" ? "#DC2626" : item.riskLevel === "medium" ? "#D97706" : "#16A34A" },
              ]}
            >
              {item.riskLevel?.toUpperCase()} RISK
            </Text>
          </View>
        )}
      </View>
      <View style={styles.patientDetailsContainer}>
        <Text style={styles.patientDetail}>ID: {item.identifier?.[0]?.value || "N/A"}</Text>
        <Text style={styles.patientDetail}>
          Gender: {item.gender ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : "N/A"}
        </Text>
        <Text style={styles.patientDetail}>Birth Date: {item.birthDate || "N/A"}</Text>
        {item.pregnancyStatus === "active" && (
          <Text style={styles.pregnancyInfo}>{item.weeksPregnant} weeks pregnant</Text>
        )}
        {item.telecom?.[0]?.value && <Text style={styles.patientDetail}>Phone: {item.telecom[0].value}</Text>}
      </View>
    </TouchableOpacity>
  )

  // Filter patients based on search query (name or identifier)
  const filteredPatients = patients.filter((patient) => {
    const nameMatch =
      patient.name?.[0]?.given?.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.name?.[0]?.family?.toLowerCase().includes(searchQuery.toLowerCase())
    const identifierMatch = patient.identifier?.[0]?.value?.toLowerCase().includes(searchQuery.toLowerCase())
    return nameMatch || identifierMatch
  })

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: width > 600 ? 80 : 0,
          maxWidth: 700,
          alignSelf: "center",
          width: "100%",
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(doctor)/create-patient" as any)}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients by name or identifier"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={{ flex: 1, marginTop: 20 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6366F1" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredPatients.length > 0 ? (
          <FlatList
            data={filteredPatients}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item.id || item.identifier?.[0]?.value || Math.random().toString()}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.text}>No patients found.</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366F1",
  },
  text: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#111827",
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 10,
    fontWeight: "600",
  },
  patientDetailsContainer: {
    marginTop: 4,
  },
  patientDetail: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
  },
  pregnancyInfo: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
    marginBottom: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: "#6366F1",
    borderRadius: 20,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
})
