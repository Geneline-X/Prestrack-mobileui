"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Heart,
  Weight,
  MessageSquare,
  FileText,
  AlertTriangle,
} from "lucide-react-native"
import { mockPatients, mockObservations, mockAppointments } from "@/data/mockData"

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [observations, setObservations] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    // Find patient by ID
    const foundPatient = mockPatients.find((p) => p.id === id)
    if (foundPatient) {
      setPatient(foundPatient)

      // Get patient's observations
      const patientObs = mockObservations.filter((obs) => obs.patientId === id)
      setObservations(patientObs)

      // Get patient's appointments
      const patientApts = mockAppointments.filter((apt) => apt.patientId === id)
      setAppointments(patientApts)
    }
  }, [id])

  const getObservationIcon = (type: string) => {
    switch (type) {
      case "blood-pressure":
        return Heart
      case "weight":
        return Weight
      case "temperature":
        return Activity
      default:
        return Activity
    }
  }

  const getObservationColor = (type: string) => {
    switch (type) {
      case "blood-pressure":
        return "#EF4444"
      case "weight":
        return "#10B981"
      case "temperature":
        return "#F59E0B"
      default:
        return "#6366F1"
    }
  }

  const handleChatWithData = () => {
    router.push(`/(doctor)/ai-chat?patientId=${id}`)
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Patient not found</Text>
      </View>
    )
  }

  const fullName = `${patient.name?.[0]?.given?.join(" ") || ""} ${patient.name?.[0]?.family || ""}`.trim()

  return (
    <ScrollView style={styles.container}>
      {/* Patient Header */}
      <View style={styles.header}>
        <View style={styles.patientInfo}>
          <View style={styles.avatarContainer}>
            <User size={32} color="#6366F1" />
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>{fullName}</Text>
            <Text style={styles.patientId}>ID: {patient.identifier?.[0]?.value}</Text>
            {patient.pregnancyStatus === "active" && (
              <View style={styles.pregnancyBadge}>
                <Text style={styles.pregnancyText}>{patient.weeksPregnant} weeks pregnant</Text>
              </View>
            )}
          </View>
        </View>

        {patient.riskLevel && (
          <View
            style={[
              styles.riskIndicator,
              {
                backgroundColor:
                  patient.riskLevel === "high" ? "#FEE2E2" : patient.riskLevel === "medium" ? "#FEF3C7" : "#DCFCE7",
              },
            ]}
          >
            <AlertTriangle
              size={16}
              color={patient.riskLevel === "high" ? "#DC2626" : patient.riskLevel === "medium" ? "#D97706" : "#16A34A"}
            />
            <Text
              style={[
                styles.riskText,
                {
                  color:
                    patient.riskLevel === "high" ? "#DC2626" : patient.riskLevel === "medium" ? "#D97706" : "#16A34A",
                },
              ]}
            >
              {patient.riskLevel?.toUpperCase()} RISK
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleChatWithData}>
          <MessageSquare size={20} color="#6366F1" />
          <Text style={styles.actionText}>Chat with AI about this patient</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <FileText size={20} color="#10B981" />
          <Text style={styles.actionText}>Generate Report</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
          <Phone size={20} color="#6B7280" />
          <Text style={styles.contactText}>
            {patient.telecom?.find((t: any) => t.system === "phone")?.value || "Not provided"}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Mail size={20} color="#6B7280" />
          <Text style={styles.contactText}>
            {patient.telecom?.find((t: any) => t.system === "email")?.value || "Not provided"}
          </Text>
        </View>
        <View style={styles.contactItem}>
          <MapPin size={20} color="#6B7280" />
          <Text style={styles.contactText}>
            {patient.address?.[0]
              ? `${patient.address[0].line?.[0] || ""}, ${patient.address[0].city || ""}, ${patient.address[0].state || ""}`
              : "Not provided"}
          </Text>
        </View>
      </View>

      {/* Recent Observations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Observations</Text>
        {observations.length > 0 ? (
          observations.map((obs) => {
            const IconComponent = getObservationIcon(obs.type)
            const iconColor = getObservationColor(obs.type)

            return (
              <View key={obs.id} style={styles.observationItem}>
                <View style={[styles.observationIcon, { backgroundColor: `${iconColor}20` }]}>
                  <IconComponent size={20} color={iconColor} />
                </View>
                <View style={styles.observationDetails}>
                  <Text style={styles.observationType}>
                    {obs.type.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                  <Text style={styles.observationValue}>
                    {obs.value} {obs.unit}
                  </Text>
                  <Text style={styles.observationDate}>{new Date(obs.date).toLocaleDateString()}</Text>
                </View>
              </View>
            )
          })
        ) : (
          <Text style={styles.noDataText}>No recent observations</Text>
        )}
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointments</Text>
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <View key={apt.id} style={styles.appointmentItem}>
              <View style={styles.appointmentIcon}>
                <Calendar size={20} color="#6366F1" />
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentReason}>{apt.reason}</Text>
                <Text style={styles.appointmentDoctor}>with {apt.doctorName}</Text>
                <Text style={styles.appointmentDateTime}>
                  {apt.date} at {apt.time} • {apt.type}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        apt.status === "confirmed" ? "#DCFCE7" : apt.status === "pending" ? "#FEF3C7" : "#FEE2E2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          apt.status === "confirmed" ? "#16A34A" : apt.status === "pending" ? "#D97706" : "#DC2626",
                      },
                    ]}
                  >
                    {apt.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No appointments scheduled</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  patientId: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  pregnancyBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  pregnancyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },
  riskIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  observationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  observationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  observationDetails: {
    flex: 1,
  },
  observationType: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  observationValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6366F1",
    marginBottom: 2,
  },
  observationDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  appointmentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentReason: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  appointmentDoctor: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 40,
  },
})
