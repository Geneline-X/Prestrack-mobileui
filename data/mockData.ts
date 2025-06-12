// Mock data for the application
import { Message } from "../components/AIChat"

export const mockPatients = [
    {
      id: "1",
      identifier: [{ value: "MTK001" }],
      name: [{ given: ["Sarah"], family: "Johnson" }],
      gender: "female",
      birthDate: "1992-05-15",
      address: [
        {
          line: ["123 Main St"],
          city: "Freetown",
          state: "Western Area",
          postalCode: "12345",
          country: "Sierra Leone",
        },
      ],
      telecom: [
        { system: "phone", value: "+232-76-123456" },
        { system: "email", value: "sarah.johnson@email.com" },
      ],
      pregnancyStatus: "active",
      weeksPregnant: 24,
      dueDate: "2024-12-15",
      riskLevel: "low",
    },
    {
      id: "2",
      identifier: [{ value: "MTK002" }],
      name: [{ given: ["Fatima"], family: "Kamara" }],
      gender: "female",
      birthDate: "1988-08-22",
      address: [
        {
          line: ["456 Oak Ave"],
          city: "Bo",
          state: "Southern Province",
          postalCode: "67890",
          country: "Sierra Leone",
        },
      ],
      telecom: [
        { system: "phone", value: "+232-77-987654" },
        { system: "email", value: "fatima.kamara@email.com" },
      ],
      pregnancyStatus: "active",
      weeksPregnant: 32,
      dueDate: "2024-10-20",
      riskLevel: "high",
    },
    {
      id: "3",
      identifier: [{ value: "MTK003" }],
      name: [{ given: ["Aminata"], family: "Sesay" }],
      gender: "female",
      birthDate: "1995-03-10",
      address: [
        {
          line: ["789 Pine St"],
          city: "Makeni",
          state: "Northern Province",
          postalCode: "54321",
          country: "Sierra Leone",
        },
      ],
      telecom: [
        { system: "phone", value: "+232-78-456789" },
        { system: "email", value: "aminata.sesay@email.com" },
      ],
      pregnancyStatus: "active",
      weeksPregnant: 16,
      dueDate: "2025-02-28",
      riskLevel: "medium",
    },
  ]
  
  export const mockObservations = [
    {
      id: "obs-1",
      patientId: "1",
      type: "blood-pressure",
      value: "120/80",
      unit: "mmHg",
      date: "2024-06-10T10:30:00Z",
      status: "final",
    },
    {
      id: "obs-2",
      patientId: "1",
      type: "weight",
      value: "68.5",
      unit: "kg",
      date: "2024-06-10T10:30:00Z",
      status: "final",
    },
    {
      id: "obs-3",
      patientId: "1",
      type: "temperature",
      value: "36.8",
      unit: "°C",
      date: "2024-06-10T10:30:00Z",
      status: "final",
    },
    {
      id: "obs-4",
      patientId: "2",
      type: "blood-pressure",
      value: "140/90",
      unit: "mmHg",
      date: "2024-06-09T14:15:00Z",
      status: "final",
    },
    {
      id: "obs-5",
      patientId: "2",
      type: "weight",
      value: "75.2",
      unit: "kg",
      date: "2024-06-09T14:15:00Z",
      status: "final",
    },
  ]
  
  export const mockAppointments = [
    {
      id: "apt-1",
      patientId: "1",
      patientName: "Sarah Johnson",
      doctorName: "Dr. Amara Conteh",
      specialty: "Obstetrics",
      date: "2024-06-15",
      time: "10:00",
      type: "In-person",
      location: "Princess Christian Maternity Hospital",
      status: "confirmed",
      reason: "Routine Prenatal Checkup",
    },
    {
      id: "apt-2",
      patientId: "2",
      patientName: "Fatima Kamara",
      doctorName: "Dr. Mohamed Bangura",
      specialty: "High-Risk Obstetrics",
      date: "2024-06-12",
      time: "14:30",
      type: "In-person",
      location: "Bo Government Hospital",
      status: "confirmed",
      reason: "High-Risk Pregnancy Monitoring",
    },
    {
      id: "apt-3",
      patientId: "3",
      patientName: "Aminata Sesay",
      doctorName: "Dr. Isata Mansaray",
      specialty: "Obstetrics",
      date: "2024-06-18",
      time: "09:15",
      type: "Video Call",
      location: "Telemedicine",
      status: "pending",
      reason: "First Trimester Consultation",
    },
  ]
  
  export const mockReferrals = [
    {
      id: "ref-1",
      patientId: "2",
      patientName: "Fatima Kamara",
      fromDoctor: "Dr. Amara Conteh",
      toDoctor: "Dr. Mohamed Bangura",
      fromSpecialty: "General Obstetrics",
      toSpecialty: "High-Risk Obstetrics",
      reason: "Gestational hypertension requiring specialist care",
      date: "2024-06-08",
      status: "accepted",
      priority: "high",
      notes: "Patient showing signs of preeclampsia. Requires immediate specialist evaluation.",
    },
    {
      id: "ref-2",
      patientId: "1",
      patientName: "Sarah Johnson",
      fromDoctor: "Dr. Isata Mansaray",
      toDoctor: "Dr. Fatima Koroma",
      fromSpecialty: "Obstetrics",
      toSpecialty: "Nutrition",
      reason: "Nutritional counseling for optimal pregnancy weight gain",
      date: "2024-06-05",
      status: "pending",
      priority: "medium",
      notes: "Patient needs guidance on proper nutrition during pregnancy.",
    },
  ]
  
  import { AppNotification, NotificationType, PriorityLevel } from "../types"

  export const mockNotifications: AppNotification[] = [
    {
      id: "notif-1",
      type: "appointment" as NotificationType,
      title: "Upcoming Appointment",
      message: "You have an appointment with Dr. Amara Conteh tomorrow at 10:00 AM",
      date: "2024-06-11T08:00:00Z",
      read: false,
      priority: "high" as PriorityLevel,
      patientId: "1",
    },
    {
      id: "notif-2",
      type: "referral" as NotificationType,
      title: "New Referral",
      message: "You have been referred to Dr. Mohamed Bangura for specialist care",
      date: "2024-06-08T15:30:00Z",
      read: false,
      priority: "high" as PriorityLevel,
      patientId: "2",
    },
    {
      id: "notif-3",
      type: "reminder" as NotificationType,
      title: "Medication Reminder",
      message: "Time to take your prenatal vitamins",
      date: "2024-06-11T09:00:00Z",
      read: true,
      priority: "medium" as PriorityLevel,
      patientId: "1",
    },
    {
      id: "notif-4",
      type: "education" as NotificationType,
      title: "New Educational Content",
      message: "Learn about nutrition during pregnancy",
      date: "2024-06-10T12:00:00Z",
      read: false,
      priority: "low" as PriorityLevel,
      patientId: "1",
    },
  ]
  
  export const mockChatMessages: Message[] = [
    {
      id: "msg-1",
      type: "user",
      content: "I've been experiencing some morning sickness. Is this normal at 24 weeks?",
      timestamp: "2024-06-11T10:30:00Z",
      patientId: "1",
    },
    {
      id: "msg-2",
      type: "ai",
      content:
        "Morning sickness can occasionally persist into the second trimester, though it's less common. At 24 weeks, if you're experiencing new or worsening nausea, it's important to discuss this with your healthcare provider as it could indicate other conditions that need attention.",
      timestamp: "2024-06-11T10:31:00Z",
      patientId: "1",
    },
    {
      id: "msg-3",
      type: "user",
      content: "What should I do about the nausea?",
      timestamp: "2024-06-11T10:35:00Z",
      patientId: "1",
    },
    {
      id: "msg-4",
      type: "ai",
      content:
        "Here are some recommendations:\n\n1. Eat small, frequent meals\n2. Avoid spicy or fatty foods\n3. Stay hydrated\n4. Try ginger tea or ginger supplements\n5. Get plenty of rest\n\nIf symptoms persist or worsen, please contact your healthcare provider immediately.",
      timestamp: "2024-06-11T10:36:00Z",
      patientId: "1",
    },
  ]
  
  export const mockEducationalContent = [
    {
      id: "edu-1",
      title: "Nutrition During Pregnancy",
      category: "Nutrition",
      description: "Essential nutrients and dietary guidelines for a healthy pregnancy",
      content: "Proper nutrition during pregnancy is crucial for both mother and baby...",
      readTime: "5 min",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["nutrition", "health", "pregnancy"],
    },
    {
      id: "edu-2",
      title: "Exercise During Pregnancy",
      category: "Fitness",
      description: "Safe exercises and activities for pregnant women",
      content: "Regular exercise during pregnancy can help improve your overall health...",
      readTime: "7 min",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["exercise", "fitness", "pregnancy"],
    },
    {
      id: "edu-3",
      title: "Understanding Prenatal Tests",
      category: "Medical",
      description: "Common prenatal tests and what they mean",
      content: "Prenatal testing helps monitor the health of both you and your baby...",
      readTime: "10 min",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["tests", "medical", "prenatal"],
    },
  ]
  
  export const mockAnalytics = {
    totalPatients: 156,
    activePregnancies: 42,
    highRiskPregnancies: 7,
    appointmentsToday: 12,
    appointmentsThisWeek: 48,
    averageGestationalAge: 22.5,
    completedDeliveries: 89,
    referralsPending: 5,
  }
  
  export const mockDoctorProfile = {
    id: "doc-1",
    name: "Dr. Amara Conteh",
    specialty: "Obstetrics & Gynecology",
    license: "SL-OB-2018-001",
    experience: "8 years",
    facility: "Princess Christian Maternity Hospital",
    phone: "+232-76-555-0123",
    email: "amara.conteh@pcmh.sl",
    qualifications: [
      "MBBS - University of Sierra Leone",
      "MD Obstetrics & Gynecology - Royal College",
      "Certificate in High-Risk Pregnancy Management",
    ],
  }
  
  export const mockPatientProfile = {
    id: "1",
    name: "Sarah Johnson",
    age: 32,
    phone: "+232-76-123456",
    email: "sarah.johnson@email.com",
    address: "123 Main St, Freetown, Sierra Leone",
    emergencyContact: {
      name: "John Johnson",
      relationship: "Husband",
      phone: "+232-77-123456",
    },
    medicalHistory: ["No previous pregnancies", "No known allergies", "No chronic conditions"],
    currentPregnancy: {
      startDate: "2024-01-15",
      dueDate: "2024-12-15",
      weeksPregnant: 24,
      riskLevel: "low",
    },
  }
  