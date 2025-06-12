"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from "react-native"
import { Search, BookOpen, Clock, Heart, Activity, Utensils, Shield } from "lucide-react-native"
import { mockEducationalContent } from "@/data/mockData"

const categories = [
  { id: "all", name: "All", icon: BookOpen, color: "#6366F1" },
  { id: "nutrition", name: "Nutrition", icon: Utensils, color: "#10B981" },
  { id: "fitness", name: "Fitness", icon: Activity, color: "#F59E0B" },
  { id: "medical", name: "Medical", icon: Heart, color: "#EF4444" },
  { id: "safety", name: "Safety", icon: Shield, color: "#8B5CF6" },
]

export default function EducationScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContent = mockEducationalContent.filter((content) => {
    const matchesCategory = selectedCategory === "all" || content.category.toLowerCase() === selectedCategory
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Education</Text>
        <Text style={styles.subtitle}>Learn about your pregnancy journey</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6B7280"
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => {
          const IconComponent = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton, isSelected && { backgroundColor: category.color }]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconComponent size={20} color={isSelected ? "#fff" : category.color} />
              <Text
                style={[styles.categoryText, isSelected && { color: "#fff" }, !isSelected && { color: category.color }]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Content List */}
      <ScrollView style={styles.contentList}>
        {filteredContent.map((content) => (
          <TouchableOpacity key={content.id} style={styles.contentCard}>
            <Image
              source={{ uri: content.image }}
              style={styles.contentImage}
              defaultSource={{ uri: "/placeholder.svg?height=120&width=200" }}
            />
            <View style={styles.contentInfo}>
              <View style={styles.contentHeader}>
                <Text style={styles.contentCategory}>{content.category}</Text>
                <View style={styles.readTime}>
                  <Clock size={12} color="#6B7280" />
                  <Text style={styles.readTimeText}>{content.readTime}</Text>
                </View>
              </View>
              <Text style={styles.contentTitle}>{content.title}</Text>
              <Text style={styles.contentDescription}>{content.description}</Text>
              <View style={styles.tagsContainer}>
                {content.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredContent.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No articles found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or category filter</Text>
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
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#F3F4F6",
  },
  contentInfo: {
    padding: 16,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  contentCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
    textTransform: "uppercase",
  },
  readTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyState: {
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
    textAlign: "center",
  },
})
