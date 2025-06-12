"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Send, Bot, User, Brain, Stethoscope } from "lucide-react-native"
import { mockChatMessages, mockPatients } from "../data/mockData"

export interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: string
  patientId?: string
}

interface AIChatProps {
  userType: "patient" | "doctor"
  patientId?: string
}

export default function AIChat({ userType, patientId }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Initialize with mock messages
    if (userType === "patient" && patientId) {
      const patientMessages = mockChatMessages.filter((msg) => msg.patientId === patientId)
      setMessages(patientMessages)
    } else {
      // Doctor gets a welcome message
      setMessages([
        {
          id: "welcome",
          type: "system",
          content:
            "AI Medical Assistant ready. You can ask about patient data, medical guidelines, or get clinical insights.",
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }, [userType, patientId])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Medical responses for doctors
    if (userType === "doctor") {
      if (lowerMessage.includes("patient") && lowerMessage.includes("data")) {
        const patient = mockPatients.find((p) => p.id === patientId) || mockPatients[0]
        return `Patient ${patient.name[0].given[0]} ${patient.name[0].family} is currently ${patient.weeksPregnant} weeks pregnant with a ${patient.riskLevel} risk pregnancy. Recent vitals show normal ranges. Would you like specific details about any aspect of her care?`
      }

      if (lowerMessage.includes("blood pressure") || lowerMessage.includes("hypertension")) {
        return "For pregnancy-related hypertension:\n\n• Monitor BP regularly\n• Consider preeclampsia screening\n• Evaluate for proteinuria\n• Assess fetal growth\n• Consider antihypertensive therapy if >160/110\n\nWould you like specific medication recommendations?"
      }

      if (lowerMessage.includes("referral")) {
        return "For high-risk pregnancies, consider referral to:\n\n• Maternal-Fetal Medicine specialist\n• Endocrinologist (for diabetes)\n• Cardiologist (for cardiac issues)\n• Nutritionist (for dietary management)\n\nShall I help you create a referral?"
      }

      return "I can help with clinical guidelines, patient data analysis, medication recommendations, and care protocols. What specific information do you need?"
    }

    // Patient responses
    if (lowerMessage.includes("nausea") || lowerMessage.includes("morning sickness")) {
      return "For nausea during pregnancy:\n\n• Eat small, frequent meals\n• Avoid triggers (spicy/fatty foods)\n• Try ginger tea or crackers\n• Stay hydrated\n• Rest when possible\n\nIf severe or persistent, contact your healthcare provider."
    }

    if (lowerMessage.includes("pain") || lowerMessage.includes("cramp")) {
      return "Mild cramping can be normal, but severe pain should be evaluated immediately. Contact your healthcare provider if you experience:\n\n• Severe abdominal pain\n• Bleeding\n• Persistent cramping\n• Fever\n\nFor mild discomfort, try rest and gentle stretching."
    }

    if (lowerMessage.includes("appointment") || lowerMessage.includes("visit")) {
      return "Your next appointment is scheduled for June 15th at 10:00 AM with Dr. Amara Conteh. Please bring:\n\n• Insurance card\n• List of current medications\n• Any questions or concerns\n\nWould you like to reschedule or add questions for your visit?"
    }

    if (lowerMessage.includes("exercise") || lowerMessage.includes("activity")) {
      return "Safe exercises during pregnancy include:\n\n• Walking\n• Swimming\n• Prenatal yoga\n• Light strength training\n\nAvoid contact sports and activities with fall risk. Always consult your doctor before starting new exercise routines."
    }

    return "I'm here to help with pregnancy-related questions, appointment scheduling, and health guidance. What would you like to know about your pregnancy journey?"
  }

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      patientId,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: generateAIResponse(inputText),
        timestamp: new Date().toISOString(),
        patientId,
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          {userType === "doctor" ? <Stethoscope size={24} color="#6366F1" /> : <Brain size={24} color="#6366F1" />}
        </View>
        <View>
          <Text style={styles.headerTitle}>
            {userType === "doctor" ? "Medical AI Assistant" : "Health AI Assistant"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {userType === "doctor" ? "Clinical insights and patient data" : "Your pregnancy health companion"}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageContainer, message.type === "user" ? styles.userMessage : styles.aiMessage]}
          >
            <View style={styles.messageHeader}>
              <View style={[styles.messageIcon, { backgroundColor: message.type === "user" ? "#6366F1" : "#10B981" }]}>
                {message.type === "user" ? (
                  <User size={16} color="#fff" />
                ) : message.type === "system" ? (
                  <Bot size={16} color="#fff" />
                ) : (
                  <Brain size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
            </View>
            <View style={[styles.messageBubble, message.type === "user" ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, message.type === "user" ? styles.userText : styles.aiText]}>
                {message.content}
              </Text>
            </View>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.messageHeader}>
              <View style={[styles.messageIcon, { backgroundColor: "#10B981" }]}>
                <Brain size={16} color="#fff" />
              </View>
              <Text style={styles.messageTime}>Now</Text>
            </View>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <Text style={styles.typingText}>AI is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={
            userType === "doctor"
              ? "Ask about patient data, guidelines, or clinical insights..."
              : "Ask about your pregnancy, symptoms, or appointments..."
          }
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isTyping}
        >
          <Send size={20} color={!inputText.trim() ? "#9CA3AF" : "#fff"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#6366F1",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#111827",
  },
  typingText: {
    color: "#6B7280",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
})
