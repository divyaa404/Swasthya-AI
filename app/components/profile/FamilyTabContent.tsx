// app/components/profile/FamilyTabContent.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FamilySimilarityGraph } from './FamilySimilarityGraph';

const COLORS = {
  primary: '#0474FC',
  primaryDark: '#0360D0',
  card: '#FFFFFF',
  background: '#F8FAFC',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
};

interface FamilyTabContentProps {
  familyData: any;
  onCopyFamilyCode: () => void;
  onShareFamilyCode?: () => void;
  onSetupFamily: () => void;
  membersCount: number;
  familyRiskLevel?: string;
  getRiskColor: (risk: string) => string;
}

export const FamilyTabContent: React.FC<FamilyTabContentProps> = ({
  familyData,
  onCopyFamilyCode,
  onSetupFamily,
  membersCount,
  familyRiskLevel = 'Low',
  getRiskColor,
}) => {
  if (!familyData) {
    return (
      <View style={styles.noFamilyCard}>
        <Ionicons name="people-outline" size={48} color={COLORS.primary} />
        <Text style={styles.noFamilyTitle}>No Family Yet</Text>
        <Text style={styles.noFamilyText}>
          Create a family or join an existing one to share health data with family members
        </Text>
        <TouchableOpacity
          style={styles.joinFamilyButton}
          activeOpacity={0.8}
          onPress={onSetupFamily}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.joinFamilyButtonGradient}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.joinFamilyButtonText}>Set Up Family</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Family Header Card */}
      <View style={styles.headerCard}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.familyIcon}>
              <Ionicons name="people" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.familyInfo}>
              <Text style={styles.familyName}>{familyData.family_name || 'Your Family'}</Text>
              <Text style={styles.familyDetails}>
                {membersCount} {membersCount === 1 ? 'Member' : 'Members'} • {familyData.join_code}
              </Text>
            </View>
            <View
              style={[
                styles.riskBadge,
                { backgroundColor: getRiskColor(familyRiskLevel) },
              ]}
            >
              <Text style={styles.riskBadgeText}>{familyRiskLevel}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Family Similarity Graph - Directly in the tab */}
      <FamilySimilarityGraph />

      {/* Join Code Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={onCopyFamilyCode}>
          <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Copy Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerGradient: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  familyDetails: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  riskBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  noFamilyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noFamilyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  noFamilyText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  joinFamilyButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  joinFamilyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  joinFamilyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FamilyTabContent;