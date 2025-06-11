import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Clock,
  Users2,
  MoreVertical,
  Copy,
  Pencil,
  Trash2,
} from 'lucide-react-native';

const forms = [
  {
    id: 1,
    title: 'Patient Intake Form',
    description: 'Initial patient registration and medical history',
    type: 'Medical History',
    submissions: 1247,
    lastUpdated: '2 days ago',
    status: 'active',
  },
  {
    id: 2,
    title: 'Pregnancy Progress Form',
    description: 'Weekly pregnancy checkup and progress tracking',
    type: 'Progress Tracking',
    submissions: 856,
    lastUpdated: '5 days ago',
    status: 'active',
  },
  {
    id: 3,
    title: 'Mental Health Assessment',
    description: 'Comprehensive mental health evaluation',
    type: 'Assessment',
    submissions: 432,
    lastUpdated: '1 week ago',
    status: 'draft',
  },
];

const formTypes = ['All Types', 'Medical History', 'Progress Tracking', 'Assessment', 'Feedback'];

export default function FormsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Forms</Text>
            <Text style={styles.headerSubtitle}>Manage dynamic forms</Text>
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
              placeholder="Search forms"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Form Type Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeFilters}
          contentContainerStyle={styles.typeFiltersContent}>
          {formTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeChip,
                selectedType === type && styles.typeChipSelected,
              ]}
              onPress={() => setSelectedType(type)}>
              <Text
                style={[
                  styles.typeChipText,
                  selectedType === type && styles.typeChipTextSelected,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Forms List */}
        <View style={styles.listContainer}>
          {forms.map((form) => (
            <View key={form.id} style={styles.formCard}>
              <View style={styles.formHeader}>
                <View style={styles.formIcon}>
                  <FileSpreadsheet size={24} color="#0EA5E9" strokeWidth={2} />
                </View>
                <View style={styles.formTitleContainer}>
                  <Text style={styles.formTitle}>{form.title}</Text>
                  <Text style={styles.formDescription}>{form.description}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={20} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <View style={styles.formMeta}>
                <View style={styles.metaItem}>
                  <Clock size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.metaText}>Updated {form.lastUpdated}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Users2 size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.metaText}>{form.submissions} submissions</Text>
                </View>
              </View>

              <View style={styles.formFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    form.status === 'active'
                      ? styles.statusActive
                      : styles.statusDraft,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      form.status === 'active'
                        ? styles.statusTextActive
                        : styles.statusTextDraft,
                    ]}>
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </Text>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Copy size={20} color="#6366F1" strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Pencil size={20} color="#6366F1" strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.actionButtonDanger]}>
                    <Trash2 size={20} color="#EF4444" strokeWidth={2} />
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
    backgroundColor: '#6366F1',
    width: 48,
    height: 48,
    borderRadius: 24,
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeFilters: {
    paddingHorizontal: 20,
  },
  typeFiltersContent: {
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  typeChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  typeChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  typeChipTextSelected: {
    color: '#6366F1',
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  formHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  formIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitleContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  formDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  formMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusDraft: {
    backgroundColor: '#F5F3FF',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statusTextActive: {
    color: '#059669',
  },
  statusTextDraft: {
    color: '#7C3AED',
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDanger: {
    backgroundColor: '#FEE2E2',
  },
}); 