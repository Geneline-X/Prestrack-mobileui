"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl } from "react-native"
import { Text, Surface } from "react-native-paper"
import { Stack } from "expo-router"
import { User, Phone, Mail, MapPin, Edit3, Save, X } from "lucide-react-native"
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
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  divider: "#E2E8F0",
  error: "#EF4444",
  success: "#22C55E",
}

interface PatientProfile {
  resourceType: string
  id: string
  name: Array<{
    given: string[]
    family: string
  }>
  gender: string
  birthDate: string
  telecom: Array<{
    system: string
    value: string
    use: string
  }>
  address: Array<{
    line: string[]
    city: string
    state: string
    postalCode: string
    country: string
  }>
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
  const [addressLine, setAddressLine] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      apiService.setAuthToken(token)
      const response = await apiService.getPatientProfile()

      if (response.error) {
        throw new Error(response.error)
      }

      const profileData = response as PatientProfile
      setProfile(profileData)

      // Set editable fields
      const phoneContact = profileData.telecom?.find((t) => t.system === "phone")
      const emailContact = profileData.telecom?.find((t) => t.system === "email")
      const address = profileData.address?.[0]

      setPhone(phoneContact?.value || "")
      setEmail(emailContact?.value || "")
      setAddressLine(address?.line?.[0] || "")
      setCity(address?.city || "")
      setState(address?.state || "")
      setPostalCode(address?.postalCode || "")
      setCountry(address?.country || "")

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
      const updateData = {
        telecom: [
          ...(phone ? [{ system: "phone", value: phone, use: "mobile" }] : []),
          ...(email ? [{ system: "email", value: email, use: "home" }] : []),
        ],
        address: [
          {
            line: [addressLine],
            city,
            state,
            postalCode,
            country,
          },
        ],
      }

      const response = await apiService.updatePatientProfile(updateData)

      if (response.error) {
        throw new Error(response.error)
      }

      Alert.alert("Success", "Profile updated successfully!")
      setEditing(false)
      fetchProfile() // Refresh data
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
      const phoneContact = profile.telecom?.find((t) => t.system === "phone")
      const emailContact = profile.telecom?.find((t) => t.system === "email")
      const address = profile.address?.[0]

      setPhone(phoneContact?.value || "")
      setEmail(emailContact?.value || "")
      setAddressLine(address?.line?.[0] || "")
      setCity(address?.city || "")
      setState(address?.state || "")
      setPostalCode(address?.postalCode || "")
      setCountry(address?.country || "")
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
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />
  }

  if (!profile) {
    return <ErrorMessage message="No profile data available" onRetry={fetchProfile} />
  }

  const fullName = `${profile.name?.[0]?.given?.join(" ") || ""} ${profile.name?.[0]?.family || ""}`.trim()

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
            <Text style={styles.profileName}>{fullName}</Text>
            <Text style={styles.profileDetails}>
              {profile.gender?.charAt(0).toUpperCase() + profile.gender?.slice(1)} • Born {profile.birthDate}
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
        </Surface>

        {/* Address Information */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>

          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <MapPin size={20} color={COLORS.textSecondary} />
              <Text style={styles.fieldLabel}>Street Address</Text>
            </View>
            {editing ? (
              <TextInput
                style={styles.input}
                value={addressLine}
                onChangeText={setAddressLine}
                placeholder="Enter street address"
              />
            ) : (
              <Text style={styles.fieldValue}>{addressLine || "Not provided"}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>City</Text>
              {editing ? (
                <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" />
              ) : (
                <Text style={styles.fieldValue}>{city || "Not provided"}</Text>
              )}
            </View>

            <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.fieldLabel}>State</Text>
              {editing ? (
                <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="State" />
              ) : (
                <Text style={styles.fieldValue}>{state || "Not provided"}</Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Postal Code</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="Postal Code"
                />
              ) : (
                <Text style={styles.fieldValue}>{postalCode || "Not provided"}</Text>
              )}
            </View>

            <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.fieldLabel}>Country</Text>
              {editing ? (
                <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="Country" />
              ) : (
                <Text style={styles.fieldValue}>{country || "Not provided"}</Text>
              )}
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
})
