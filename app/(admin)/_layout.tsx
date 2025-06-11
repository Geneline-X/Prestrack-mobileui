import { Tabs } from 'expo-router';
import { Building2, Users2, FileSpreadsheet, LayoutDashboard, UserCircle } from 'lucide-react-native';
import { StyleSheet, Platform, Dimensions } from 'react-native';

const ANDROID_NAV_BAR_HEIGHT = 48; // Standard Android navigation bar height

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <LayoutDashboard size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ size, color }) => (
            <Users2 size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="organizations"
        options={{
          title: 'Facilities',
          tabBarIcon: ({ size, color }) => (
            <Building2 size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="forms"
        options={{
          title: 'Forms',
          tabBarIcon: ({ size, color }) => (
            <FileSpreadsheet size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <UserCircle size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    height: Platform.select({
      android: 60 + ANDROID_NAV_BAR_HEIGHT, // Base height + navigation bar height
      ios: 85,
      default: 60,
    }),
    paddingBottom: Platform.select({
      android: ANDROID_NAV_BAR_HEIGHT, // Use full navigation bar height as padding
      ios: 28,
      default: 8,
    }),
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  tabBarItem: {
    paddingTop: 8,
  },
}); 