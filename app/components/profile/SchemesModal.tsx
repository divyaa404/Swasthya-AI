import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#10B981', // Green for schemes
  primaryLight: '#D1FAE5',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
};

const MOCK_SCHEMES = [
  {
    id: '1',
    name: 'Ayushman Bharat - PM-JAY',
    description: 'Health insurance scheme providing coverage of up to ₹5 lakh per family per year.',
    department: 'Ministry of Health',
    category: 'Healthcare',
    benefit: '₹5 lakh coverage',
    eligibility: 'BPL families',
  },
  {
    id: '2',
    name: 'Pradhan Mantri Matru Vandana Yojana',
    description: 'Maternity benefit program providing cash incentives to pregnant mothers.',
    department: 'Women & Child Development',
    category: 'Women',
    benefit: '₹5,000 cash',
    eligibility: 'Pregnant mothers',
  },
  {
    id: '3',
    name: 'National Health Mission',
    description: 'Healthcare scheme providing accessible healthcare to rural and urban populations.',
    department: 'Ministry of Health',
    category: 'Healthcare',
    benefit: 'Free healthcare',
    eligibility: 'All citizens',
  },
  {
    id: '4',
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    description: 'Accidental insurance scheme for death or disability due to accident.',
    department: 'Ministry of Finance',
    category: 'Financial',
    benefit: '₹2 lakh cover',
    eligibility: 'Age 18-70 years',
  },
  {
    id: '5',
    name: 'National Disability Pension Scheme',
    description: 'Pension scheme for persons with severe or multiple disabilities.',
    department: 'Social Justice',
    category: 'Disability',
    benefit: '₹1,000-1,500/month',
    eligibility: '80%+ disability',
  },
  {
    id: '6',
    name: 'Indira Gandhi Old Age Pension Scheme',
    description: 'Pension scheme for elderly persons above 60 years.',
    department: 'Rural Development',
    category: 'Elderly',
    benefit: '₹200-500/month',
    eligibility: 'Age 60+ years',
  },
  {
    id: '7',
    name: 'Balika Samriddhi Yojana',
    description: 'Scheme for welfare of girl children providing financial assistance.',
    department: 'Women & Child Development',
    category: 'Children',
    benefit: '₹500-1,000',
    eligibility: 'Girl child',
  },
  {
    id: '8',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    description: 'Life insurance scheme for death due to any cause.',
    department: 'Ministry of Finance',
    category: 'Financial',
    benefit: '₹2 lakh cover',
    eligibility: 'Age 18-50 years',
  },
];

interface SchemesModalProps {
  visible: boolean;
  onClose: () => void;
  onReupload?: () => void;
}

export const SchemesModal: React.FC<SchemesModalProps> = ({ visible, onClose, onReupload }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredSchemes, setFilteredSchemes] = useState(MOCK_SCHEMES);

  const categories = ['All', 'Healthcare', 'Financial', 'Disability', 'Elderly', 'Women', 'Children'];

  useEffect(() => {
    let filtered = MOCK_SCHEMES;

    if (searchQuery) {
      filtered = filtered.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (scheme) => scheme.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredSchemes(filtered);
  }, [searchQuery, selectedCategory]);

  const handleSchemePress = (scheme: any) => {
    Alert.alert(
      scheme.name,
      `${scheme.description}\n\n• Department: ${scheme.department}\n• Benefits: ${scheme.benefit}\n• Eligibility: ${scheme.eligibility}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Apply Now',
          onPress: () => {
            Alert.alert(
              'How to Apply',
              'Please visit the nearest Jan Seva Kendra or official government portal to apply.\n\nRequired documents:\n• Aadhaar Card\n• Verified Income Certificate\n• Residence Proof'
            );
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Government Schemes</Text>
          {onReupload ? (
            <TouchableOpacity onPress={onReupload} style={styles.reuploadHeaderBtn}>
              <Ionicons name="cloud-upload-outline" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.text.light} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search schemes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.text.light}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.text.light} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories horizontal scroll */}
        <View style={{ height: 50, marginBottom: 12 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List of schemes */}
        <ScrollView
          style={styles.schemesList}
          contentContainerStyle={styles.schemesContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredSchemes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={COLORS.text.light} />
              <Text style={styles.emptyTitle}>No schemes found</Text>
              <Text style={styles.emptyText}>Try adjusting your search query or filter.</Text>
            </View>
          ) : (
            filteredSchemes.map((scheme) => (
              <TouchableOpacity
                key={scheme.id}
                style={styles.schemeCard}
                onPress={() => handleSchemePress(scheme)}
                activeOpacity={0.7}
              >
                <View style={styles.schemeHeader}>
                  <View style={styles.schemeIconBg}>
                    <Ionicons name="ribbon-outline" size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.schemeName}>{scheme.name}</Text>
                    <Text style={styles.schemeDept}>{scheme.department}</Text>
                  </View>
                </View>
                <Text style={styles.schemeDesc} numberOfLines={2}>
                  {scheme.description}
                </Text>
                <View style={styles.schemeFooter}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{scheme.benefit}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={[styles.tagText, { color: COLORS.text.secondary }]}>
                      {scheme.eligibility}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  schemesList: {
    flex: 1,
  },
  schemesContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  schemeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  schemeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  schemeIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  schemeDept: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  schemeDesc: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  schemeFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  reuploadHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default SchemesModal;
