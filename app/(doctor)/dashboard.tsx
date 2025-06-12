"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native"
import { Bell, Search, UserPlus, CalendarPlus, AlertTriangle, Clock, Baby, Brain, Download } from "lucide-react-native"
import { router, useRouter } from "expo-router"
import { mockAppointments, mockAnalytics } from "@/data/mockData"
import { useNavigation } from '@react-navigation/native';

// Example user data
const user = {
  name: "Dr. Amara Conteh",
  profilePic: require("../../assets/images/icon.png"),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingContainer: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: 16,
    color: "#64748B",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginRight: 16,
  },
  profilePicWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profilePic: {
    width: "100%",
    height: "100%",
  },
  quickActionsScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickActionButton: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 20,
  },
  quickActionText: {
    fontSize: 14,
    color: "#6366F1",
    marginTop: 8,
  },
  searchBarContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  appointmentsScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentCard: {
    backgroundColor: "#6366F1",
    borderRadius: 8,
    padding: 16,
    marginRight: 20,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  appointmentDetails: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
  },
  appointmentDateTimeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  appointmentDateTimeText: {
    fontSize: 16,
    color: "#fff",
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  metricsHorizontalScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricCard: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 16,
    marginRight: 20,
  },
  metricIconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  metricIcon: {
    marginRight: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  metricLabelText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
})

export default function PatientDashboard() {
  const navigation = useNavigation()
  const { width, height } = useWindowDimensions()
  // Responsive breakpoints
  const isSmall = width < 375
  const isTablet = width >= 600
  const isLarge = width >= 900

  const [patientCount, setPatientCount] = useState<number>(mockAnalytics.totalPatients)
  const [isLoadingCount, setIsLoadingCount] = useState(false)
  const [errorCount, setErrorCount] = useState<string | null>(null)
  const [upcomingVisits, setUpcomingVisits] = useState<any[]>([])
  const [loadingVisits, setLoadingVisits] = useState(false)

  useEffect(() => {
    // Use mock data instead of API calls
    const mockVisits = mockAppointments.slice(0, 3).map((apt) => ({
      id: apt.id,
      reasonCode: [{ text: apt.reason }],
      description: `${apt.type} appointment with ${apt.patientName}`,
      start: `${apt.date}T${apt.time}:00`,
    }))
    setUpcomingVisits(mockVisits)
  }, [])

  // Calculate responsive horizontal padding
  const horizontalPadding = isLarge ? 120 : isTablet ? 48 : Math.max(12, width * 0.04)

  // Calculate dynamic metric card width
  const metricCardWidth = isLarge ? 220 : isTablet ? 180 : Math.max(140, (width - 2 * horizontalPadding - 20) / 2)

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: horizontalPadding,
          paddingTop: isLarge ? 80 : isTablet ? 60 : 40,
          maxWidth: 900,
          alignSelf: "center",
          width: "100%",
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.header}>
        {/* Greeting and Name (Top Left) */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
        {/* Notification Bell and Profile Pic (Top Right) */}
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/(doctor)/notifications")}>
            <Bell size={24} color="#6366F1" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profilePicWrapper}>
            <Image source={user.profilePic} style={styles.profilePic} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions - now slidable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.quickActionsScroll,
          { paddingLeft: horizontalPadding, paddingRight: horizontalPadding - 12 },
        ]}
      >
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.replace("/(doctor)/create-patient")}>
          <UserPlus size={28} color="#6366F1" />
          <Text style={styles.quickActionText}>Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/(doctor)/visits")}>
          <CalendarPlus size={28} color="#10B981" />
          <Text style={styles.quickActionText}>Schedule Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/(doctor)/ai-chat")}>
          <Brain size={28} color="#8B5CF6" />
          <Text style={styles.quickActionText}>AI Assistant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/(doctor)/create-pregnancy")}>
          <Baby size={28} color="#A0522D" />
          <Text style={styles.quickActionText}>Add Pregnancy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push("/(doctor)/export")}>
          <Download size={28} color="#059669" />
          <Text style={styles.quickActionText}>Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <AlertTriangle size={28} color="#EF4444" />
          <Text style={styles.quickActionText}>High Risk</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Search Bar - moved up under quick actions */}
      <View style={[styles.searchBarContainer, { paddingHorizontal: horizontalPadding }]}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients, appointments..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Upcoming Visits Section */}
      <Text style={[styles.sectionTitle, { paddingHorizontal: horizontalPadding }]}>Upcoming Visits</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.appointmentsScroll,
          { paddingLeft: horizontalPadding, paddingRight: horizontalPadding - 12 },
        ]}
        style={{ marginTop: 10, marginBottom: 20 }}
      >
        {loadingVisits ? (
          <ActivityIndicator size="small" color="#6366F1" style={{ marginTop: 20 }} />
        ) : upcomingVisits.length === 0 ? (
          <Text style={{ color: "#64748B", fontSize: 16, marginTop: 20 }}>No upcoming visits.</Text>
        ) : (
          upcomingVisits.map((visit, idx) => (
            <TouchableOpacity
              key={visit.id || idx}
              style={[
                styles.appointmentCard,
                { width: isLarge ? 500 : isTablet ? 380 : Math.max(220, width - 2 * horizontalPadding - 12) },
              ]}
            >
              <Text style={styles.appointmentTitle}>{visit.reasonCode?.[0]?.text || "Prenatal Visit"}</Text>
              <Text style={styles.appointmentDetails}>{visit.description || "Scheduled prenatal care visit"}</Text>
              <View style={styles.appointmentDateTimeBox}>
                <CalendarPlus size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.appointmentDateTimeText}>{visit.start?.split("T")[0]}</Text>
                <View style={{ width: 18 }} />
                <Clock size={16} color="#fff" style={{ marginRight: 6, marginLeft: 0 }} />
                <Text style={styles.appointmentDateTimeText}>{visit.start?.split("T")[1]?.slice(0, 5) || ""}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Overview Matrices Title */}
      <Text style={[styles.overviewTitle, { paddingHorizontal: horizontalPadding, marginTop: 20 }]}>
        Overview Matrices
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.metricsHorizontalScroll,
          { paddingLeft: horizontalPadding, paddingRight: horizontalPadding - 10 },
        ]}
      >
        <View style={[styles.metricCard, { width: metricCardWidth, backgroundColor: "#3B82F6" }]}>
          <View style={styles.metricIconRow}>
            <UserPlus size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>{mockAnalytics.totalPatients}</Text>
          <Text style={[styles.metricLabelText, { color: "#DBEAFE" }]}>Patients Under Care</Text>
        </View>
        <View style={[styles.metricCard, { width: metricCardWidth, backgroundColor: "#10B981" }]}>
          <View style={styles.metricIconRow}>
            <Baby size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>{mockAnalytics.activePregnancies}</Text>
          <Text style={[styles.metricLabelText, { color: "#D1FAE5" }]}>Active Pregnancies</Text>
        </View>
        <View style={[styles.metricCard, { width: metricCardWidth, backgroundColor: "#EF4444" }]}>
          <View style={styles.metricIconRow}>
            <AlertTriangle size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>{mockAnalytics.highRiskPregnancies}</Text>
          <Text style={[styles.metricLabelText, { color: "#FECACA" }]}>High-Risk Pregnancies</Text>
        </View>
        <View style={[styles.metricCard, { width: metricCardWidth, backgroundColor: "#F59E0B" }]}>
          <View style={styles.metricIconRow}>
            <UserPlus size={28} color="#fff" style={styles.metricIcon} />
          </View>
          <Text style={styles.metricValue}>{mockAnalytics.referralsPending}</Text>
          <Text style={[styles.metricLabelText, { color: "#FEF3C7" }]}>Pending Referrals</Text>
        </View>
      </ScrollView>
    </View>
  )
}
