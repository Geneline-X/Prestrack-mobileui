import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, User, Heart, Calendar, FileText, Phone, Mail, MapPin, CreditCard as Edit, MessageSquare } from 'lucide-react-native';

const profileStats = [
  {
    id: 1,
    label: 'Appointments',
    value: '24',
    icon: Calendar,
    color: '#6366F1',
  },
  {
    id: 2,
    label: 'Health Records',
    value: '12',
    icon: FileText,
    color: '#10B981',
  },
  {
    id: 3,
    label: 'Prescriptions',
    value: '8',
    icon: Heart,
    color: '#F59E0B',
  },
];

const menuItems = [
  {
    id: 1,
    title: 'Personal Information',
    icon: User,
    color: '#6366F1',
  },
  {
    id: 2,
    title: 'Medical History',
    icon: FileText,
    color: '#10B981',
  },
  {
    id: 3,
    title: 'Notifications',
    icon: Bell,
    color: '#F59E0B',
    hasSwitch: true,
  },
  {
    id: 4,
    title: 'Privacy & Security',
    icon: Shield,
    color: '#EF4444',
  },
  {
    id: 5,
    title: 'Help & Support',
    icon: HelpCircle,
    color: '#8B5CF6',
  },
  {
    id: 6,
    title: 'Settings',
    icon: Settings,
    color: '#6B7280',
  },
];

const emergencyContacts = [
  {
    id: 1,
    name: 'Dr. Jennifer Smith',
    relation: 'Primary Doctor',
    phone: '+1 (555) 123-4567',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    name: 'Emergency Services',
    relation: 'Emergency',
    phone: '911',
    image: null,
  },
];

const notificationSettings = [
  {
    id: 'email',
    title: 'Email Updates',
    description: 'Get updates via email',
    icon: Mail,
    color: '#6366F1',
  },
  {
    id: 'sms',
    title: 'SMS Alerts',
    description: 'Receive text messages',
    icon: MessageSquare,
    color: '#10B981',
  },
  {
    id: 'reminders',
    title: 'Visit Reminders',
    description: 'Get visit notifications',
    icon: Bell,
    color: '#F59E0B',
  },
];

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    reminders: true,
  });

  const toggleNotification = (id: string) => {
    setNotifications(prev => ({
      ...prev,
      [id as keyof typeof prev]: !prev[id as keyof typeof prev],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={20} color="#6366F1" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileContent}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
                }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Siyam Ahmed</Text>
                <Text style={styles.profileAge}>28 years old</Text>
                <Text style={styles.profileId}>Patient ID: #SA2024</Text>
              </View>
            </View>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Phone size={16} color="#E0E7FF" strokeWidth={2} />
                <Text style={styles.contactText}>+1 (555) 987-6543</Text>
              </View>
              <View style={styles.contactItem}>
                <Mail size={16} color="#E0E7FF" strokeWidth={2} />
                <Text style={styles.contactText}>siyam.ahmed@email.com</Text>
              </View>
              <View style={styles.contactItem}>
                <MapPin size={16} color="#E0E7FF" strokeWidth={2} />
                <Text style={styles.contactText}>New York, NY</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat) => (
            <TouchableOpacity key={stat.id} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <stat.icon size={20} color="#FFFFFF" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Pregnancy Status */}
        <View style={styles.pregnancyCard}>
          <View style={styles.pregnancyHeader}>
            <Text style={styles.pregnancyTitle}>Current Pregnancy</Text>
            <View style={styles.pregnancyBadge}>
              <Text style={styles.pregnancyBadgeText}>Active</Text>
            </View>
          </View>
          <View style={styles.pregnancyDetails}>
            <View style={styles.pregnancyItem}>
              <Text style={styles.pregnancyLabel}>Gestational Age</Text>
              <Text style={styles.pregnancyValue}>24 weeks, 3 days</Text>
            </View>
            <View style={styles.pregnancyItem}>
              <Text style={styles.pregnancyLabel}>Due Date</Text>
              <Text style={styles.pregnancyValue}>December 15, 2024</Text>
            </View>
            <View style={styles.pregnancyItem}>
              <Text style={styles.pregnancyLabel}>Next Appointment</Text>
              <Text style={styles.pregnancyValue}>Sep 7, 2024 - 10:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <item.icon size={20} color={item.color} strokeWidth={2} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.hasSwitch ? (
                  <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
                ) : (
                  <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.emergencyContact}>
              <View style={styles.emergencyContactLeft}>
                {contact.image ? (
                  <Image source={{ uri: contact.image }} style={styles.emergencyImage} />
                ) : (
                  <View style={styles.emergencyPlaceholder}>
                    <Phone size={20} color="#EF4444" strokeWidth={2} />
                  </View>
                )}
                <View style={styles.emergencyInfo}>
                  <Text style={styles.emergencyName}>{contact.name}</Text>
                  <Text style={styles.emergencyRelation}>{contact.relation}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Phone size={16} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#EF4444" strokeWidth={2} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // softer background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7EF',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 28,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileCard: {
    marginHorizontal: 28,
    marginBottom: 28,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E7EF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  profileGradient: {
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileContent: {
    padding: 28,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 18,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 28,
    color: '#0F172A',
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  profileAge: {
    fontSize: 18,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  profileId: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E0E7EF',
    paddingTop: 28,
    gap: 18,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 18,
    color: '#0F172A',
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    marginBottom: 28,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7EF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  pregnancyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 28,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pregnancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  pregnancyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  pregnancyBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pregnancyBadgeText: {
    fontSize: 13,
    color: '#16A34A',
    fontFamily: 'Inter-Medium',
  },
  pregnancyDetails: {
    gap: 14,
  },
  pregnancyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pregnancyLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  pregnancyValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter-Medium',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 28,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7EF',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 18,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  menuItemRight: {
    marginLeft: 14,
  },
  emergencyContainer: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 18,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyContactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
  },
  emergencyPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  emergencyRelation: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  callButton: {
    backgroundColor: '#EF4444',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 20,
    paddingVertical: 18,
    gap: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 18,
    color: '#EF4444',
    fontFamily: 'Inter-Medium',
  },
  bottomSpacer: {
    height: 36,
  },
});