"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Bell, Calendar, UserCheck, AlertCircle, BookOpen, Check, X } from "lucide-react-native"
import { mockNotifications } from "../data/mockData"
import { AppNotification, NotificationType, PriorityLevel } from "../types"

interface NotificationCenterProps {
  userType: "patient" | "doctor"
  patientId?: string
}

interface NotificationItem extends AppNotification {
  // Additional properties from Web Notifications API that we might use
  badge?: string;
  body?: string;
  data?: any;
  dir?: 'auto' | 'ltr' | 'rtl';
  icon?: string;
  image?: string;
  lang?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
  title: string;
  vibrate?: number[];
}

export default function NotificationCenter({ userType, patientId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all")

  useEffect(() => {
    // Filter notifications based on user type
    let filteredNotifications = mockNotifications;

    if (userType === "patient" && patientId) {
      filteredNotifications = filteredNotifications.filter((n) => n.patientId === patientId);
    }

    // Convert to NotificationItem array with proper typing
    const typedNotifications: NotificationItem[] = filteredNotifications.map(notif => ({
      ...notif,
      type: notif.type as NotificationType,
      priority: notif.priority as PriorityLevel,
      read: notif.read ?? false,
      patientId: notif.patientId,
      // Add any additional properties from Web Notifications API if needed
      title: notif.title,
      message: notif.message,
      date: notif.date
    }));

    setNotifications(typedNotifications);
  }, [userType, patientId])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return Calendar
      case "referral":
        return UserCheck
      case "reminder":
        return AlertCircle
      case "education":
        return BookOpen
      default:
        return Bell
    }
  }

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444"
      case "medium":
        return "#F59E0B"
      case "low":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotifications(prevNotifications => 
              prevNotifications.filter(notification => notification.id !== id)
            )
          }
        }
      ]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case "unread":
        return !notif.read
      case "high":
        return notif.priority === "high"
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.unreadCount}>{unreadCount} unread</Text>}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={markAllAsRead} disabled={unreadCount === 0}>
            <Check size={20} color={unreadCount > 0 ? "#6366F1" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabs}>
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "high", label: "High Priority" },
            ].map((filterOption) => (
              <TouchableOpacity
                key={filterOption.key}
                style={[styles.filterTab, filter === filterOption.key && styles.filterTabActive]}
                onPress={() => setFilter(filterOption.key as any)}
              >
                <Text style={[styles.filterTabText, filter === filterOption.key && styles.filterTabTextActive]}>
                  {filterOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type)
            const iconColor = getNotificationColor(notification.priority)

            return (
              <TouchableOpacity
                key={notification.id}
                style={[styles.notificationItem, !notification.read && styles.unreadNotification]}
                onPress={() => markAsRead(notification.id)}
              >
                <View style={styles.notificationContent}>
                  <View style={[styles.notificationIcon, { backgroundColor: `${iconColor}20` }]}>
                    <IconComponent size={20} color={iconColor} />
                  </View>

                  <View style={styles.notificationText}>
                    <View style={styles.notificationHeader}>
                      <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationDate}>{formatDate(notification.date)}</Text>
                    </View>

                    <Text style={styles.notificationMessage}>{notification.message}</Text>

                    <View style={styles.notificationMeta}>
                      <View style={[styles.priorityBadge, { backgroundColor: iconColor }]}>
                        <Text style={styles.priorityText}>{notification.priority.toUpperCase()}</Text>
                      </View>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNotification(notification.id)}>
                  <X size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </TouchableOpacity>
            )
          })
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No notifications</Text>
            <Text style={styles.emptyStateSubtext}>
              {filter === "all" ? "You're all caught up!" : `No ${filter} notifications found`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  unreadCount: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterTabActive: {
    backgroundColor: "#6366F1",
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterTabTextActive: {
    color: "#fff",
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "600",
  },
  notificationDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366F1",
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
})
