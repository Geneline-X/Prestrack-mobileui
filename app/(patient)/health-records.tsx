"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { Text, Surface } from "react-native-paper"
import { Stack } from "expo-router"
import { Activity, Heart, Weight, Thermometer, TrendingUp, Calendar } from "lucide-react-native"
import { format, parseISO } from "date-fns"
import { mockObservations } from "@/data/mockData"

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

interface Observation {
  id: string
  patientId: string
  type: string
  value: string
  unit: string
  date: string
  status: string
}

const observationTypes = [
  { key: "all", label: "All Records", icon: Activity, color: COLORS.primary },
  { key: "blood-pressure", label: "Blood Pressure", icon: Heart, color: COLORS.error },
  { key: "weight", label: "Weight", icon: Weight, color: COLORS.accent },
  { key: "temperature", label: "Temperature", icon: Thermometer, color: COLORS.warning },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterTabs: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  filterTabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  observationsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
  },
  observationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  observationsTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.accent,
  },
  observationItem: {
    marginBottom: 16,
  },
  observationContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  observationLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  observationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  observationInfo: {
    marginLeft: 8,
  },
  observationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
  observationMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  observationDate: {
    marginLeft: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  observationRight: {
    alignItems: "flex-end",
  },
  observationValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  observationStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  observationDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    width: "100%",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
})

export default function HealthRecordsScreen() {
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState("all")

  const fetchObservations = async (type?: string) => {
    try {
      // Use mock data filtered by patient ID and type
      let filteredObs = mockObservations.filter((obs) => obs.patientId === "1")

      if (type && type !== "all") {
        filteredObs = filteredObs.filter((obs) => obs.type === type)
      }

      setObservations(filteredObs)
      setError(null)
    } catch (err: any) {
      console.error("Observations fetch error:", err)
      setError(err.message || "Failed to load health records")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchObservations(selectedType)
  }, [selectedType])

  const onRefresh = () => {
    setRefreshing(true)
    fetchObservations(selectedType)
  }

  const getObservationIcon = (type: string) => {
    switch (type) {
      case "blood-pressure":
        return Heart
      case "weight":
        return Weight
      case "temperature":
        return Thermometer
      default:
        return Activity
    }
  }

  const getObservationColor = (type: string) => {
    switch (type) {
      case "blood-pressure":
        return COLORS.error
      case "weight":
        return COLORS.accent
      case "temperature":
        return COLORS.warning
      default:
        return COLORS.primary
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Activity size={48} color={COLORS.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.textSecondary }}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: COLORS.error, textAlign: "center" }}>{error}</Text>
        <TouchableOpacity
          onPress={() => fetchObservations(selectedType)}
          style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}
        >
          <Text style={{ color: "white" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Health Records",
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "600",
            color: COLORS.primaryDark,
          },
        }}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterTabs}>
              {observationTypes.map((type) => {
                const IconComponent = type.icon
                const isSelected = selectedType === type.key

                return (
                  <TouchableOpacity
                    key={type.key}
                    style={[styles.filterTab, isSelected && { backgroundColor: type.color }]}
                    onPress={() => setSelectedType(type.key)}
                  >
                    <IconComponent size={20} color={isSelected ? COLORS.surface : type.color} />
                    <Text
                      style={[
                        styles.filterTabText,
                        isSelected && { color: COLORS.surface },
                        !isSelected && { color: type.color },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>
        </View>

        {/* Summary Stats */}
        <Surface style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <TrendingUp size={24} color={COLORS.primary} />
            <Text style={styles.summaryTitle}>Health Summary</Text>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{observations.length}</Text>
              <Text style={styles.summaryLabel}>Total Records</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {
                  observations.filter((obs) => new Date(obs.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                    .length
                }
              </Text>
              <Text style={styles.summaryLabel}>This Week</Text>
            </View>
          </View>
        </Surface>

        {/* Observations List */}
        <Surface style={styles.observationsContainer}>
          <View style={styles.observationsHeader}>
            <Activity size={24} color={COLORS.accent} />
            <Text style={styles.observationsTitle}>Recent Observations</Text>
          </View>

          {observations.length > 0 ? (
            observations.map((observation, index) => {
              const IconComponent = getObservationIcon(observation.type)
              const iconColor = getObservationColor(observation.type)

              return (
                <View key={observation.id} style={styles.observationItem}>
                  <View style={styles.observationContent}>
                    <View style={styles.observationLeft}>
                      <View style={[styles.observationIcon, { backgroundColor: `${iconColor}20` }]}>
                        <IconComponent size={20} color={iconColor} />
                      </View>
                      <View style={styles.observationInfo}>
                        <Text style={styles.observationTitle}>
                          {observation.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Text>
                        <View style={styles.observationMeta}>
                          <Calendar size={14} color={COLORS.textSecondary} />
                          <Text style={styles.observationDate}>
                            {format(parseISO(observation.date), "MMM d, yyyy • h:mm a")}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.observationRight}>
                      <Text style={[styles.observationValue, { color: iconColor }]}>
                        {observation.value} {observation.unit}
                      </Text>
                      <Text style={styles.observationStatus}>
                        {observation.status.charAt(0).toUpperCase() + observation.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  {index < observations.length - 1 && <View style={styles.observationDivider} />}
                </View>
              )
            })
          ) : (
            <View style={styles.emptyState}>
              <Activity size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateText}>No health records found</Text>
              <Text style={styles.emptyStateSubtext}>
                Your health observations will appear here once they're recorded
              </Text>
            </View>
          )}
        </Surface>
      </ScrollView>
    </View>
  )
}
