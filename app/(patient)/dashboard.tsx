"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, StyleSheet, StatusBar, RefreshControl, TouchableOpacity } from "react-native"
import { Text, Surface } from "react-native-paper"
import { Stack } from "expo-router"
import { format } from "date-fns"
import { Calendar, Activity, FileText, Heart, Baby, TrendingUp } from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { mockPatientProfile, mockObservations, mockAppointments } from "@/data/mockData"
import { useRouter } from "expo-router"

// Enhanced color palette for maternal health
const COLORS = {
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  primaryLight: "#A5B4FC",
  secondary: "#EC4899",
  accent: "#10B981",
  warning: "#F59E0B",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  text: "#1E293B",
  textSecondary: "#64748B",
  divider: "#E2E8F0",
  success: "#22C55E",
  error: "#EF4444",
}

interface DashboardData {
  patientId: string
  pregnancyStatus: string
  weeksPregnant: number
  nextAppointment?: string
  recentObservations: Array<{
    id: string
    type: string
    value: string
    date: string
  }>
}

export default function PatientDashboard() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      // Use mock data
      const patientObs = mockObservations.filter((obs) => obs.patientId === "1").slice(0, 3)
      const nextApt = mockAppointments.find((apt) => apt.patientId === "1")

      const mockDashboardData: DashboardData = {
        patientId: "1",
        pregnancyStatus: mockPatientProfile.currentPregnancy ? "active" : "inactive",
        weeksPregnant: mockPatientProfile.currentPregnancy?.weeksPregnant || 0,
        nextAppointment: nextApt ? `${nextApt.date}T${nextApt.time}:00` : undefined,
        recentObservations: patientObs.map((obs) => ({
          id: obs.id,
          type: obs.type,
          value: `${obs.value} ${obs.unit}`,
          date: obs.date,
        })),
      }

      setDashboardData(mockDashboardData)
      setError(null)
    } catch (err: any) {
      console.error("Dashboard fetch error:", err)
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const getObservationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "blood-pressure":
        return Heart
      case "weight":
        return TrendingUp
      case "temperature":
        return Activity
      default:
        return FileText
    }
  }

  const getObservationColor = (type: string) => {
    switch (type.toLowerCase()) {
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
          onPress={fetchDashboardData}
          style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}
        >
          <Text style={{ color: "white" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!dashboardData) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>No dashboard data available</Text>
        <TouchableOpacity
          onPress={fetchDashboardData}
          style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}
        >
          <Text style={{ color: "white" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} translucent />

      <Stack.Screen
        options={{
          title: "My Health",
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

      {/* Welcome Header */}
      <View style={[styles.welcomeSection, { paddingTop: insets.top }]}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeText}>Welcome back! 👋</Text>
          <Text style={styles.subtitleText}>Here's your pregnancy journey</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.mainContent}>
          {/* Pregnancy Status Card */}
          <Surface style={[styles.pregnancyCard, { borderLeftColor: COLORS.secondary }]}>
            <View style={styles.pregnancyHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.secondary}20` }]}>
                <Baby size={28} color={COLORS.secondary} />
              </View>
              <View style={styles.pregnancyInfo}>
                <Text style={styles.pregnancyStatus}>
                  {dashboardData.pregnancyStatus === "active" ? "Active Pregnancy" : "Pregnancy Status"}
                </Text>
                <Text style={styles.pregnancyWeeks}>{dashboardData.weeksPregnant} weeks pregnant</Text>
              </View>
            </View>
          </Surface>

          {/* Next Appointment Card */}
          {dashboardData.nextAppointment && (
            <Surface style={[styles.appointmentCard, { borderLeftColor: COLORS.primary }]}>
              <View style={styles.appointmentHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}20` }]}>
                  <Calendar size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>Next Appointment</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.appointmentDate}>
                {format(new Date(dashboardData.nextAppointment), "EEEE, MMMM d")}
              </Text>
              <Text style={styles.appointmentTime}>{format(new Date(dashboardData.nextAppointment), "h:mm a")}</Text>
            </Surface>
          )}

          {/* Recent Observations */}
          <Surface style={[styles.observationsCard, { borderLeftColor: COLORS.accent }]}>
            <View style={styles.observationHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accent}20` }]}>
                <Activity size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.sectionTitle}>Recent Health Data</Text>
            </View>
            <View style={styles.divider} />

            {dashboardData.recentObservations.length > 0 ? (
              dashboardData.recentObservations.map((observation, index) => {
                const IconComponent = getObservationIcon(observation.type)
                const iconColor = getObservationColor(observation.type)

                return (
                  <View key={observation.id} style={styles.observationItem}>
                    <View style={styles.observationContent}>
                      <View style={styles.observationLeft}>
                        <View style={[styles.observationIcon, { backgroundColor: `${iconColor}20` }]}>
                          <IconComponent size={20} color={iconColor} />
                        </View>
                        <View>
                          <Text style={styles.observationType}>
                            {observation.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Text>
                          <Text style={styles.observationDate}>
                            {format(new Date(observation.date), "MMM d, h:mm a")}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.observationValue}>{observation.value}</Text>
                    </View>
                    {index < dashboardData.recentObservations.length - 1 && <View style={styles.itemDivider} />}
                  </View>
                )
              })
            ) : (
              <Text style={styles.noDataText}>No recent observations available</Text>
            )}
          </Surface>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => router.push("/(patient)/health-records")}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.primary}20` }]}>
                  <FileText size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.quickActionText}>View Records</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/(patient)/pregnancy")}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
                  <Baby size={24} color={COLORS.secondary} />
                </View>
                <Text style={styles.quickActionText}>Pregnancy Info</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/(patient)/ai-chat")}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.accent}20` }]}>
                  <Activity size={24} color={COLORS.accent} />
                </View>
                <Text style={styles.quickActionText}>AI Health Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/(patient)/education")}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.warning}20` }]}>
                  <FileText size={24} color={COLORS.warning} />
                </View>
                <Text style={styles.quickActionText}>Education</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeSection: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    zIndex: 1,
  },
  welcomeContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryDark,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  mainContent: {
    paddingTop: 24,
  },
  pregnancyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pregnancyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  pregnancyInfo: {
    marginLeft: 16,
    flex: 1,
  },
  pregnancyStatus: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  pregnancyWeeks: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  appointmentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 16,
  },
  appointmentDate: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  appointmentTime: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  observationsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  observationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  observationItem: {
    marginBottom: 12,
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
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  observationType: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  observationDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  observationValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
})
