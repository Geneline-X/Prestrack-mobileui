import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ColorValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Users,
  Building2,
  FileSpreadsheet,
  Activity,
  TrendingUp,
  UserPlus,
  Building,
  FilePlus,
  ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const statistics = [
  {
    id: 1,
    title: 'Total Users',
    value: '2,547',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    gradient: ['#2563EB', '#4F46E5'] as readonly [ColorValue, ColorValue],
  },
  {
    id: 2,
    title: 'Organizations',
    value: '85',
    change: '+7.2%',
    trend: 'up',
    icon: Building2,
    gradient: ['#0EA5E9', '#06B6D4'] as readonly [ColorValue, ColorValue],
  },
  {
    id: 3,
    title: 'Active Forms',
    value: '164',
    change: '+24.3%',
    trend: 'up',
    icon: FileSpreadsheet,
    gradient: ['#8B5CF6', '#A855F7'] as readonly [ColorValue, ColorValue],
  },
  {
    id: 4,
    title: 'System Health',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up',
    icon: Activity,
    gradient: ['#2DD4BF', '#34D399'] as readonly [ColorValue, ColorValue],
  },
];

const quickActions = [
  {
    id: 1,
    title: 'Add New User',
    description: 'Register patient or staff member',
    icon: UserPlus,
    color: '#0EA5E9', // Light blue
  },
  {
    id: 2,
    title: 'Register Facility',
    description: 'Add new healthcare facility',
    icon: Building,
    color: '#8B5CF6', // Violet
  },
  {
    id: 3,
    title: 'Create Form',
    description: 'Design health assessment form',
    icon: FilePlus,
    color: '#2DD4BF', // Teal
  },
];

export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.adminName}>Super Admin</Text>
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          {statistics.map((stat) => (
            <TouchableOpacity key={stat.id} style={styles.statCard}>
              <LinearGradient
                colors={stat.gradient}
                style={styles.statGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.statHeader}>
                  <stat.icon size={24} color="#FFFFFF" strokeWidth={2} />
                  <View style={styles.trendContainer}>
                    <TrendingUp size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.trendText}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <action.icon size={24} color={action.color} strokeWidth={2} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
                <View style={styles.actionArrow}>
                  <ChevronRight size={20} color="#6B7280" strokeWidth={1.5} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  adminName: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    width: (width - 30) / 2,
  },
  statGradient: {
    borderRadius: 12,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  statValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginTop: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    opacity: 0.9,
  },
  actionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 