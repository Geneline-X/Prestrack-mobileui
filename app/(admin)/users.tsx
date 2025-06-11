import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Building2,
  Mail,
  Phone,
  Shield,
} from 'lucide-react-native';

const users = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    role: 'Doctor',
    organization: 'City General Hospital',
    email: 'sarah.wilson@citygeneral.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'active',
  },
  {
    id: 2,
    name: 'John Martinez',
    role: 'Administrator',
    organization: 'Women\'s Health Center',
    email: 'john.m@whc.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'inactive',
  },
];

const roleFilters = ['All Roles', 'Doctor', 'Nurse', 'Administrator', 'Patient'];

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Users</Text>
            <Text style={styles.headerSubtitle}>Manage system users</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6366F1" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Role Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.roleFilters}
          contentContainerStyle={styles.roleFiltersContent}>
          {roleFilters.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleChip,
                selectedRole === role && styles.roleChipSelected,
              ]}
              onPress={() => setSelectedRole(role)}>
              <Text
                style={[
                  styles.roleChipText,
                  selectedRole === role && styles.roleChipTextSelected,
                ]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Users List */}
        <View style={styles.listContainer}>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View style={styles.userTitleContainer}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.userRoleBadge}>
                    <Shield size={12} color="#6366F1" strokeWidth={2} />
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={20} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailItem}>
                  <Building2 size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>{user.organization}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Mail size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>{user.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Phone size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>{user.phone}</Text>
                </View>
              </View>

              <View style={styles.userActions}>
                <View
                  style={[
                    styles.statusBadge,
                    user.status === 'active'
                      ? styles.statusActive
                      : styles.statusInactive,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      user.status === 'active'
                        ? styles.statusTextActive
                        : styles.statusTextInactive,
                    ]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonDanger]}>
                    <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
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
  headerTitle: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#0EA5E9',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 20,
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleFilters: {
    paddingHorizontal: 20,
  },
  roleFiltersContent: {
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginRight: 8,
  },
  roleChipSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0EA5E9',
  },
  roleChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  roleChipTextSelected: {
    color: '#0EA5E9',
  },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userTitleContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  userRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
  },
  moreButton: {
    padding: 8,
  },
  userDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#DCFCE7',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statusTextActive: {
    color: '#059669',
  },
  statusTextInactive: {
    color: '#DC2626',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
  },
  actionButtonDanger: {
    backgroundColor: '#FEE2E2',
  },
  actionButtonTextDanger: {
    color: '#EF4444',
  },
}); 