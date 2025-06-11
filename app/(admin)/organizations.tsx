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
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Users2,
  Building2,
} from 'lucide-react-native';

const organizations = [
  {
    id: 1,
    name: 'City General Hospital',
    type: 'Hospital',
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    email: 'contact@citygeneral.com',
    totalUsers: 245,
    logo: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    name: 'Women\'s Health Center',
    type: 'Clinic',
    location: 'Los Angeles, CA',
    phone: '+1 (555) 987-6543',
    email: 'info@whc.com',
    totalUsers: 128,
    logo: 'https://images.pexels.com/photos/4483327/pexels-photo-4483327.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function OrganizationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Organizations</Text>
            <Text style={styles.headerSubtitle}>Manage healthcare facilities</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search organizations"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Organizations List */}
        <View style={styles.listContainer}>
          {organizations.map((org) => (
            <View key={org.id} style={styles.orgCard}>
              <View style={styles.orgHeader}>
                <Image source={{ uri: org.logo }} style={styles.orgLogo} />
                <View style={styles.orgTitleContainer}>
                  <Text style={styles.orgName}>{org.name}</Text>
                  <View style={styles.orgTypeBadge}>
                    <Building2 size={12} color="#6366F1" strokeWidth={2} />
                    <Text style={styles.orgType}>{org.type}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={20} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <View style={styles.orgDetails}>
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>{org.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Phone size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>{org.phone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Mail size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>{org.email}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users2 size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailText}>{org.totalUsers} users</Text>
                </View>
              </View>

              <View style={styles.orgActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Edit Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonDanger]}>
                  <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                    Remove
                  </Text>
                </TouchableOpacity>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: '#6366F1',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  orgCard: {
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
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orgLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  orgTitleContainer: {
    flex: 1,
  },
  orgName: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  orgTypeBadge: {
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
  orgType: {
    fontSize: 12,
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
  },
  moreButton: {
    padding: 8,
  },
  orgDetails: {
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
  orgActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 40,
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