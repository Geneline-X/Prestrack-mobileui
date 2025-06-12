"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl } from "react-native"
import { Text, Surface } from "react-native-paper"
import { Stack } from "expo-router"
import { User, Phone, Mail, MapPin, Edit3, Save, X } from "lucide-react-native"
import { mockPatientProfile } from "@/data/mockData"

const COLORS = {
  warning: "#F59E0B",
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  secondary: "#EC4899",
  accent: "#10B981",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  divider: "#E2E8F0",
  error: "#EF4444",
  success: "#22C55E",
}

interface PatientProfile {
  id: string
  name: string
  age: number
  phone: string
  email: string
  address: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  medicalHistory: string[]
  currentPregnancy: {
    startDate: string
    dueDate: string
    weeksPregnant: number
    riskLevel: string
  }
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Editable fields
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")

  const fetchProfile = async () => {
    try {
      // Use mock data
      setProfile(mockPatientProfile)

      // Set editable fields
      setPhone(mockPatientProfile.phone)
      setEmail(mockPatientProfile.email)
      setAddress(mockPatientProfile.address)
      setEmergencyName(mockPatientProfile.emergencyContact.name)
      setEmergencyPhone(mockPatientProfile.emergencyContact.phone)

      setError(null)
    } catch (err: any) {
      console.error("Profile fetch error:", err)
      setError(err.message || "Failed to load profile")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate saving
      const updatedProfile = {
        ...profile!,
        phone,
        email,
        address,
        emergencyContact: {
          ...profile!.emergencyContact,
          name: emergencyName,
          phone: emergencyPhone,
        },
      }

      setProfile(updatedProfile)
      Alert.alert("Success", "Profile updated successfully!")
      setEditing(false)
    } catch (err: any) {
      console.error("Profile update error:", err)
      Alert.alert("Error", err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    // Reset fields to original values
    if (profile) {
      setPhone(profile.phone)
      setEmail(profile.email)
      setAddress(profile.address)
      setEmergencyName(profile.emergencyContact.name)
      setEmergencyPhone(profile.emergencyContact.phone)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchProfile()
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <User size={48} color={COLORS.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.textSecondary }}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: COLORS.error, textAlign: "center" }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchProfile}
          style={{ marginTop: 16, padding: 12, backgroundColor: COLORS.primary, borderRadius: 8 }}
        >
          <Text style={{ color: "white" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!profile) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>No profile data available</Text>
        <TouchableOpacity
          onPress={fetchProfile}
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
          title: "My Profile",
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
            <TouchableOpacity onPress={editing ? handleCancel : () => setEditing(true)} style={styles.headerButton}>
              {editing ? <X size={24} color={COLORS.error} /> : <Edit3 size={24} color={COLORS.primary} />}
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
        {/* Profile Header */}
        <Surface style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color={COLORS.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileDetails}>
              {profile.age} years old • Patient ID: {profile.id}
            </Text>
          </View>
        </Surface>

        {/* Contact Information */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Phone size={20} color={COLORS.textSecondary} />
              <Text style={styles.fieldLabel}>Phone Number</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{phone || "Not provided"}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Mail size={20} color={COLORS.textSecondary} />
              <Text style={styles.fieldLabel}>Email Address</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>{email || "Not provided"}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <MapPin size={20} color={COLORS.textSecondary} />
              <Text style={styles.fieldLabel}>Address</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                multiline
              />
            ) : (
              <Text style={styles.fieldValue}>{address || "Not provided"}</Text>
            )}
          </View>
        </Surface>

        {/* Emergency Contact */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={emergencyName}
                onChangeText={setEmergencyName}
                placeholder="Emergency contact name"
              />
            ) : (
              <Text style={styles.fieldValue}>{emergencyName || "Not provided"}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Relationship</Text>
            <Text style={styles.fieldValue}>{profile.emergencyContact.relationship}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                placeholder="Emergency contact phone"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{emergencyPhone || "Not provided"}</Text>
            )}
          </View>
        </Surface>

        {/* Current Pregnancy */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Current Pregnancy</Text>

          <View style={styles.pregnancyInfo}>
            <Text style={styles.pregnancyWeeks}>{profile.currentPregnancy.weeksPregnant} weeks</Text>
            <Text style={styles.pregnancyLabel}>Weeks Pregnant</Text>
          </View>

          <View style={styles.pregnancyDetails}>
            <View style={styles.pregnancyDetail}>
              <Text style={styles.detailLabel}>Due Date</Text>
              <Text style={styles.detailValue}>{profile.currentPregnancy.dueDate}</Text>
            </View>
            <View style={styles.pregnancyDetail}>
              <Text style={styles.detailLabel}>Risk Level</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: profile.currentPregnancy.riskLevel === "low" ? COLORS.success : COLORS.warning },
                ]}
              >
                {profile.currentPregnancy.riskLevel.toUpperCase()}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Save Button */}
        {editing && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Save size={20} color={COLORS.surface} />
            <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        )}
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
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
  row: {
    flexDirection: "row",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
    marginLeft: 8,
  },
  pregnancyInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pregnancyWeeks: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginRight: 8,
  },
  pregnancyLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  pregnancyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pregnancyDetail: {
    flex: 1,
    marginRight: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "bold",
  },
  warning: {
    color: COLORS.error,
  },
})
