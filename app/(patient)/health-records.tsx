"use client"

import { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { Text, Surface } from "react-native-paper"
import { Stack, useRouter } from "expo-router"
import { Activity, Heart, Weight, Thermometer, TrendingUp, Calendar } from "lucide-react-native"
import { format, parseISO } from "date-fns"
import { ApiService } from "../../services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoadingSpinner from "../../components/LoadingSpinner"
import ErrorMessage from "../../components/ErrorMessage"

const apiService = new ApiService()

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
  resourceType: string
  id: string
  status: string
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }
  subject: {
    reference: string
  }
  effectiveDateTime: string
  valueQuantity?: {
    value: number
    unit: string
    system: string
    code: string
  }
  component?: Array<{
    code: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    valueQuantity: {
      value: number
      unit: string
      system: string
      code: string
    }
  }>
}

interface ObservationsBundle {
  resourceType: string
  type: string
  total: number
  entry: Array<{
    resource: Observation
  }>
}

const observationTypes = [
  { key: "all", label: "All Records", icon: Activity, color: COLORS.primary },
  { key: "blood-pressure", label: "Blood Pressure", icon: Heart, color: COLORS.error },
  { key: "weight", label: "Weight", icon: Weight, color: COLORS.accent },
  { key: "temperature", label: "Temperature", icon: Thermometer, color: COLORS.warning },
]

export default function HealthRecordsScreen() {
  const [observations, setObservations] = useState<Observation[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchObservations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const token = await AsyncStorage.getItem("auth_token")
      if (!token) {
        console.log("No auth token found, redirecting to login")
        router.replace("/login")
        return
      }

      apiService.setAuthToken(token)
      const params: Record<string, string> = {}
      if (selectedType !== "all") {
        params.type = selectedType
      }
      const response = await apiService.getObservations(params)

      if (response.error) {
        throw new Error(response.error)
      }

      const bundle = response as ObservationsBundle
      setObservations(bundle.entry?.map((entry) => entry.resource) || [])
    } catch (error) {
      console.error("Error fetching observations:", error)
      
      // Handle authentication errors
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("token") || error.message.includes("auth")) {
          console.log("Authentication error, redirecting to login")
          await AsyncStorage.removeItem("auth_token")
          await AsyncStorage.removeItem("refresh_token")
          router.replace("/login")
          return
        }
        setError(error.message)
      } else {
        setError("Failed to load health records")
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedType, router])

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
  }

  useEffect(() => {
    fetchObservations()
  }, [selectedType])

  const onRefresh = () => {
    setRefreshing(true)
    // The fetchObservations function will be called when refreshing changes
  }
  
  // Fetch data when refreshing changes
  useEffect(() => {
    if (refreshing) {
      fetchObservations()
    }
  }, [refreshing, fetchObservations])

  const getObservationIcon = (observation: Observation) => {
    const display = observation.code.coding[0]?.display?.toLowerCase() || ""
    if (display.includes("blood pressure")) return Heart
    if (display.includes("weight")) return Weight
    if (display.includes("temperature")) return Thermometer
    return Activity
  }

  const getObservationColor = (observation: Observation) => {
    const display = observation.code.coding[0]?.display?.toLowerCase() || ""
    if (display.includes("blood pressure")) return COLORS.error
    if (display.includes("weight")) return COLORS.accent
    if (display.includes("temperature")) return COLORS.warning
    return COLORS.primary
  }

  const formatObservationValue = (observation: Observation) => {
    if (observation.component && observation.component.length > 0) {
      // For blood pressure with systolic/diastolic components
      const systolic = observation.component.find((c) => c.code.coding[0]?.display?.toLowerCase().includes("systolic"))
      const diastolic = observation.component.find((c) =>
        c.code.coding[0]?.display?.toLowerCase().includes("diastolic"),
      )

      if (systolic && diastolic) {
        return `${systolic.valueQuantity.value}/${diastolic.valueQuantity.value} ${systolic.valueQuantity.unit}`
      }
    }

    if (observation.valueQuantity) {
      return `${observation.valueQuantity.value} ${observation.valueQuantity.unit}`
    }

    return "N/A"
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchObservations} />
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
                  observations.filter(
                    (obs) => new Date(obs.effectiveDateTime) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  ).length
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
              const IconComponent = getObservationIcon(observation)
              const iconColor = getObservationColor(observation)
              const value = formatObservationValue(observation)

              return (
                <View key={observation.id} style={styles.observationItem}>
                  <View style={styles.observationContent}>
                    <View style={styles.observationLeft}>
                      <View style={[styles.observationIcon, { backgroundColor: `${iconColor}20` }]}>
                        <IconComponent size={20} color={iconColor} />
                      </View>
                      <View style={styles.observationInfo}>
                        <Text style={styles.observationTitle}>
                          {observation.code.coding[0]?.display || "Health Observation"}
                        </Text>
                        <View style={styles.observationMeta}>
                          <Calendar size={14} color={COLORS.textSecondary} />
                          <Text style={styles.observationDate}>
                            {format(parseISO(observation.effectiveDateTime), "MMM d, yyyy • h:mm a")}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.observationRight}>
                      <Text style={[styles.observationValue, { color: iconColor }]}>{value}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTabs: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 4,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: 8,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 12,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  observationsContainer: {
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  observationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  observationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 12,
  },
  observationItem: {
    marginBottom: 16,
  },
  observationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  observationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  observationIcon: {
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  observationInfo: {
    flex: 1,
  },
  observationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  observationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  observationDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  observationRight: {
    alignItems: "flex-end",
  },
  observationValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  observationStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },
  observationDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
})
