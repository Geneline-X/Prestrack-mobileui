"use client"

import { Tabs, router } from "expo-router"
import { View, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Home, Calendar, FileText, User, HeartPulse } from "lucide-react-native"
import { useEffect, useState } from "react"
import * as SecureStore from 'expo-secure-store';

export default function PatientLayout() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token')
        if (!token) {
          console.log('No auth token found, redirecting to login')
          router.replace('/login')
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#6366F1",
            tabBarInactiveTintColor: "#64748B",
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: "#E2E8F0",
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
              backgroundColor: "#FFFFFF",
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="pregnancy"
            options={{
              title: "Pregnancy",
              tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="health-records"
            options={{
              title: "Health Records",
              tabBarIcon: ({ color, size }) => <HeartPulse size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        </Tabs>
      </SafeAreaView>
    </View>
  )
}
