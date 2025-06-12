"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from "react-native"
import { Download, FileText, Calendar, Activity, User, Shield, CheckCircle, Clock } from "lucide-react-native"

interface ExportOption {
  id: string
  title: string
  description: string
  icon: any
  dataTypes: string[]
  format: "PDF" | "CSV" | "JSON"
  size: string
}

interface DataExportProps {
  userType: "patient" | "doctor"
  patientId?: string
}

export default function DataExport({ userType, patientId }: DataExportProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [includePersonalInfo, setIncludePersonalInfo] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const exportOptions: ExportOption[] = [
    {
      id: "medical-records",
      title: "Medical Records",
      description: "Complete medical history, diagnoses, and treatments",
      icon: FileText,
      dataTypes: ["Diagnoses", "Medications", "Allergies", "Medical History"],
      format: "PDF",
      size: "2.3 MB",
    },
    {
      id: "pregnancy-data",
      title: "Pregnancy Data",
      description: "Prenatal visits, ultrasounds, and pregnancy timeline",
      icon: Activity,
      dataTypes: ["Prenatal Visits", "Ultrasounds", "Lab Results", "Growth Charts"],
      format: "PDF",
      size: "1.8 MB",
    },
    {
      id: "appointments",
      title: "Appointments",
      description: "Past and upcoming appointments with healthcare providers",
      icon: Calendar,
      dataTypes: ["Appointment History", "Provider Notes", "Follow-ups"],
      format: "CSV",
      size: "0.5 MB",
    },
    {
      id: "vital-signs",
      title: "Vital Signs & Observations",
      description: "Blood pressure, weight, temperature, and other measurements",
      icon: Activity,
      dataTypes: ["Blood Pressure", "Weight", "Temperature", "Heart Rate"],
      format: "CSV",
      size: "0.3 MB",
    },
  ]

  const doctorExportOptions: ExportOption[] = [
    {
      id: "patient-summary",
      title: "Patient Summary Report",
      description: "Comprehensive patient overview for referrals",
      icon: User,
      dataTypes: ["Demographics", "Current Conditions", "Medications", "Recent Visits"],
      format: "PDF",
      size: "1.2 MB",
    },
    {
      id: "clinical-data",
      title: "Clinical Data Export",
      description: "Detailed clinical information for research or transfer",
      icon: FileText,
      dataTypes: ["Lab Results", "Imaging", "Procedures", "Assessments"],
      format: "JSON",
      size: "3.1 MB",
    },
    {
      id: "analytics-report",
      title: "Analytics Report",
      description: "Patient outcomes and care quality metrics",
      icon: Activity,
      dataTypes: ["Outcomes", "Quality Metrics", "Care Plans", "Progress Notes"],
      format: "PDF",
      size: "0.8 MB",
    },
  ]

  const options = userType === "doctor" ? doctorExportOptions : exportOptions

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]))
  }

  const handleExport = async () => {
    if (selectedOptions.length === 0) {
      Alert.alert("No Selection", "Please select at least one data type to export.")
      return
    }

    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      Alert.alert(
        "Export Complete",
        `Your data has been exported successfully. ${selectedOptions.length} file(s) have been saved to your device.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedOptions([])
            },
          },
        ],
      )
    }, 3000)
  }

  const getTotalSize = () => {
    const selectedItems = options.filter((opt) => selectedOptions.includes(opt.id))
    const totalMB = selectedItems.reduce((total, item) => {
      const size = Number.parseFloat(item.size.replace(" MB", ""))
      return total + size
    }, 0)
    return `${totalMB.toFixed(1)} MB`
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Download size={24} color="#6366F1" />
          </View>
          <View>
            <Text style={styles.title}>Export Data</Text>
            <Text style={styles.subtitle}>
              {userType === "doctor"
                ? "Export patient data securely for referrals or research"
                : "Download your health records and data"}
            </Text>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Shield size={20} color="#10B981" />
          <View style={styles.privacyText}>
            <Text style={styles.privacyTitle}>Data Privacy & Security</Text>
            <Text style={styles.privacyDescription}>
              All exported data is encrypted and complies with healthcare privacy regulations. Files are
              password-protected and automatically expire after 30 days.
            </Text>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Data to Export</Text>

          {options.map((option) => {
            const IconComponent = option.icon
            const isSelected = selectedOptions.includes(option.id)

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, isSelected && styles.selectedOption]}
                onPress={() => toggleOption(option.id)}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.optionLeft}>
                    <View style={[styles.optionIcon, { backgroundColor: isSelected ? "#6366F1" : "#F3F4F6" }]}>
                      <IconComponent size={20} color={isSelected ? "#fff" : "#6B7280"} />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={[styles.optionTitle, isSelected && styles.selectedOptionTitle]}>{option.title}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                  </View>
                  <View style={styles.optionMeta}>
                    <Text style={styles.optionFormat}>{option.format}</Text>
                    <Text style={styles.optionSize}>{option.size}</Text>
                  </View>
                </View>

                <View style={styles.dataTypes}>
                  {option.dataTypes.map((type, index) => (
                    <View key={index} style={styles.dataTypeTag}>
                      <Text style={styles.dataTypeText}>{type}</Text>
                    </View>
                  ))}
                </View>

                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.selectedText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Export Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Include Personal Information</Text>
              <Text style={styles.settingDescription}>
                Include name, address, and contact details in exported files
              </Text>
            </View>
            <Switch
              value={includePersonalInfo}
              onValueChange={setIncludePersonalInfo}
              trackColor={{ false: "#E5E7EB", true: "#6366F1" }}
              thumbColor={includePersonalInfo ? "#fff" : "#fff"}
            />
          </View>
        </View>

        {/* Export Summary */}
        {selectedOptions.length > 0 && (
          <View style={styles.summary}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Export Summary</Text>
            </View>
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Selected Files:</Text>
                <Text style={styles.summaryValue}>{selectedOptions.length}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Size:</Text>
                <Text style={styles.summaryValue}>{getTotalSize()}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Format:</Text>
                <Text style={styles.summaryValue}>Multiple</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Export Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.exportButton, (selectedOptions.length === 0 || isExporting) && styles.exportButtonDisabled]}
          onPress={handleExport}
          disabled={selectedOptions.length === 0 || isExporting}
        >
          {isExporting ? (
            <>
              <Clock size={20} color="#fff" />
              <Text style={styles.exportButtonText}>Exporting...</Text>
            </>
          ) : (
            <>
              <Download size={20} color="#fff" />
              <Text style={styles.exportButtonText}>
                Export {selectedOptions.length > 0 ? `${selectedOptions.length} File(s)` : "Data"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  privacyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0FDF4",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  privacyText: {
    flex: 1,
    marginLeft: 12,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 12,
    color: "#047857",
    lineHeight: 16,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedOption: {
    borderColor: "#6366F1",
    backgroundColor: "#F8FAFF",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: "row",
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  selectedOptionTitle: {
    color: "#6366F1",
  },
  optionDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  optionMeta: {
    alignItems: "flex-end",
  },
  optionFormat: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  optionSize: {
    fontSize: 12,
    color: "#6B7280",
  },
  dataTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  dataTypeTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dataTypeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  selectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  summary: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  summaryDetails: {
    padding: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
})
