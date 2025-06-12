"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput } from "react-native"
import { Text, Surface } from "react-native-paper"
import { Stack } from "expo-router"
import { Baby, Calendar, Plus, Heart, Weight } from "lucide-react-native"
import { format, differenceInWeeks, parseISO } from "date-fns"
import { mockPatientProfile } from "@/data/mockData"

const COLORS = {
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  secondary: "#EC4899",
  accent: "#10B981",
  warning: "#F59E0B",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  divider: "#E2E8F0",
  error: "#EF4444",
  success: "#22C55E",
}

interface PregnancyData {
  id: string
  status: string
  startDate: string
  expectedDeliveryDate: string
  lastMenstrualPeriod: string
  prenatalVisits: Array<{
    date: string
    gestationalAge: string
    weight: number
    bloodPressure: string
    notes: string
  }>
}

interface NewVisit {
  date: string
  gestationalAge: string
  weight: string
  bloodPressure: string
  notes: string
}

export default function PregnancyScreen() {
  const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddVisit, setShowAddVisit] = useState(false)
  const [addingVisit, setAddingVisit] = useState(false)

  const [newVisit, setNewVisit] = useState<NewVisit>({
    date: new Date().toISOString().split("T")[0],
    gestationalAge: "",
    weight: "",
    bloodPressure: "",
    notes: "",
  })

  const fetchPregnancyData = async () => {
    try {
      // Use mock data
      const mockPregnancyData: PregnancyData = {
        id: "1",
        status: "active",
        startDate: mockPatientProfile.currentPregnancy.startDate,
        expectedDeliveryDate: mockPatientProfile.currentPregnancy.dueDate,
        lastMenstrualPeriod: mockPatientProfile.currentPregnancy.startDate,
        prenatalVisits: [
          {
            date: "2024-05-15",
            gestationalAge: "20 weeks",
            weight: 65.5,
            bloodPressure: "118/75",
            notes: "Normal development, baby is healthy",
          },
          {
            date: "2024-06-01",
            gestationalAge: "22 weeks",
            weight: 67.2,
            bloodPressure: "120/78",
            notes: "Ultrasound shows good growth",
          },
          {
            date: "2024-06-15",
            gestationalAge: "24 weeks",
            weight: 68.5,
            bloodPressure: "122/80",
            notes: "All vitals normal, feeling good",
          },
        ],
      }

      setPregnancyData(mockPregnancyData)
      setError(null)
    } catch (err: any) {
      console.error("Pregnancy fetch error:", err)
      setError(err.message || "Failed to load pregnancy data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleAddVisit = async () => {
    if (!newVisit.date || !newVisit.gestationalAge || !newVisit.weight) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setAddingVisit(true)
    try {
      // Simulate adding visit
      const visitData = {
        date: newVisit.date,
        gestationalAge: newVisit.gestationalAge,
        weight: Number.parseFloat(newVisit.weight),
        bloodPressure: newVisit.bloodPressure,
        notes: newVisit.notes,
      }

      // Add to existing visits
      if (pregnancyData) {
        setPregnancyData({
          ...pregnancyData,
          prenatalVisits: [...pregnancyData.prenatalVisits, visitData],
        })
      }

      Alert.alert("Success", "Prenatal visit added successfully!")
      setShowAddVisit(false)
      setNewVisit({
        date: new Date().toISOString().split("T")[0],
        gestationalAge: "",
        weight: "",
        bloodPressure: "",
        notes: "",
      })
    } catch (err: any) {
      console.error("Add visit error:", err)
      Alert.alert("Error", err.message || "Failed to add prenatal visit")
    } finally {
      setAddingVisit(false)
    }
  }

  useEffect(() => {
    fetchPregnancyData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchPregnancyData()
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Baby size={48} color={COLORS.secondary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.textSecondary }}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: COLORS.error, textAlign: "center" }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchPregnancyData}
          style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}
        >
          <Text style={{ color: "white" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!pregnancyData) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>No pregnancy data available</Text>
        <TouchableOpacity
          onPress={fetchPregnancyData}
          style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}
        >
          <Text style={{ color: "white" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const weeksPregnant = differenceInWeeks(new Date(), parseISO(pregnancyData.startDate))
  const daysUntilDue = Math.ceil(
    (parseISO(pregnancyData.expectedDeliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Pregnancy",
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
            color: COLORS.primaryDark,
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowAddVisit(!showAddVisit)} style={styles.headerButton}>
              <Plus size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Pregnancy Overview */}
        <Surface style={[styles.overviewCard, { borderLeftColor: COLORS.secondary }]}>
          <View style={styles.overviewHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${COLORS.secondary}20` }]}>
              <Baby size={32} color={COLORS.secondary} />
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewTitle}>Current Pregnancy</Text>
              <Text style={styles.overviewStatus}>
                {pregnancyData.status.charAt(0).toUpperCase() + pregnancyData.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeksPregnant}</Text>
              <Text style={styles.statLabel}>Weeks Pregnant</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{daysUntilDue}</Text>
              <Text style={styles.statLabel}>Days Until Due</Text>
            </View>
          </View>
        </Surface>

        {/* Key Dates */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>

          <View style={styles.dateItem}>
            <View style={styles.dateIcon}>
              <Calendar size={20} color={COLORS.primary} />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Last Menstrual Period</Text>
              <Text style={styles.dateValue}>
                {format(parseISO(pregnancyData.lastMenstrualPeriod), "MMMM d, yyyy")}
              </Text>
            </View>
          </View>

          <View style={styles.dateItem}>
            <View style={styles.dateIcon}>
              <Baby size={20} color={COLORS.accent} />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Expected Delivery Date</Text>
              <Text style={styles.dateValue}>
                {format(parseISO(pregnancyData.expectedDeliveryDate), "MMMM d, yyyy")}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Add Visit Form */}
        {showAddVisit && (
          <Surface style={styles.addVisitForm}>
            <Text style={styles.sectionTitle}>Add Prenatal Visit</Text>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Date *</Text>
              <TextInput
                style={styles.input}
                value={newVisit.date}
                onChangeText={(text) => setNewVisit({ ...newVisit, date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Gestational Age *</Text>
              <TextInput
                style={styles.input}
                value={newVisit.gestationalAge}
                onChangeText={(text) => setNewVisit({ ...newVisit, gestationalAge: text })}
                placeholder="e.g., 24 weeks"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Weight (kg) *</Text>
              <TextInput
                style={styles.input}
                value={newVisit.weight}
                onChangeText={(text) => setNewVisit({ ...newVisit, weight: text })}
                placeholder="e.g., 65.5"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Blood Pressure</Text>
              <TextInput
                style={styles.input}
                value={newVisit.bloodPressure}
                onChangeText={(text) => setNewVisit({ ...newVisit, bloodPressure: text })}
                placeholder="e.g., 120/80"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newVisit.notes}
                onChangeText={(text) => setNewVisit({ ...newVisit, notes: text })}
                placeholder="Additional notes..."
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              style={[styles.addButton, addingVisit && styles.addButtonDisabled]}
              onPress={handleAddVisit}
              disabled={addingVisit}
            >
              <Text style={styles.addButtonText}>{addingVisit ? "Adding..." : "Add Visit"}</Text>
            </TouchableOpacity>
          </Surface>
        )}

        {/* Prenatal Visits */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Prenatal Visits</Text>

          {pregnancyData.prenatalVisits && pregnancyData.prenatalVisits.length > 0 ? (
            pregnancyData.prenatalVisits.map((visit, index) => (
              <View key={index} style={styles.visitItem}>
                <View style={styles.visitHeader}>
                  <Text style={styles.visitDate}>{format(parseISO(visit.date), "MMM d, yyyy")}</Text>
                  <Text style={styles.visitAge}>{visit.gestationalAge}</Text>
                </View>

                <View style={styles.visitDetails}>
                  <View style={styles.visitDetail}>
                    <Weight size={16} color={COLORS.accent} />
                    <Text style={styles.visitDetailText}>{visit.weight} kg</Text>
                  </View>

                  {visit.bloodPressure && (
                    <View style={styles.visitDetail}>
                      <Heart size={16} color={COLORS.error} />
                      <Text style={styles.visitDetailText}>{visit.bloodPressure}</Text>
                    </View>
                  )}
                </View>

                {visit.notes && <Text style={styles.visitNotes}>{visit.notes}</Text>}

                {index < pregnancyData.prenatalVisits.length - 1 && <View style={styles.visitDivider} />}
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No prenatal visits recorded yet</Text>
          )}
        </Surface>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  overviewCard: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  overviewInfo: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  overviewStatus: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.divider,
    marginHorizontal: 20,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  addVisitForm: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
  visitItem: {
    marginBottom: 16,
  },
  visitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  visitDate: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  visitAge: {
    fontSize: 14,
    color: COLORS.textSecondary,
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visitDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  visitDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  visitDetailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  visitNotes: {
    fontSize: 14,
    color: COLORS.text,
    fontStyle: "italic",
    marginTop: 4,
  },
  visitDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 16,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
})
