import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#0474FC',
  primaryLight: '#E8F1FE',
  card: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
};

interface HealthStatusGridProps {
  riskLevel?: string;
  conditionsCount: number;
  recordsCount: number;
  medicationsCount: number;
  membersCount?: number;
  mode?: 'profile' | 'family';
}

export const HealthStatusGrid: React.FC<HealthStatusGridProps> = ({
  riskLevel = 'Low',
  conditionsCount,
  recordsCount,
  medicationsCount,
  membersCount = 3,
  mode = 'profile',
}) => {
  // Convert text risk level to a realistic numerical score out of 10
  const getRiskScore = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return '2.3/10';
      case 'moderate':
        return '4.8/10';
      case 'elevated':
        return '6.9/10';
      case 'high':
        return '8.7/10';
      default:
        return '2.0/10';
    }
  };

  if (mode === 'family') {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Family Health Status</Text>
        <View style={styles.gridContainer}>
          {/* Card 1: Family Risk Score */}
          <View style={styles.gridItem}>
            <View style={[styles.gridIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="speedometer-outline" size={24} color="#D97706" />
            </View>
            <Text style={styles.gridLabel}>Family Risk</Text>
            <Text style={styles.gridValue}>{getRiskScore(riskLevel)}</Text>
          </View>

          {/* Card 2: Family Conditions */}
          <View style={styles.gridItem}>
            <View style={[styles.gridIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="fitness-outline" size={24} color="#EF4444" />
            </View>
            <Text style={styles.gridLabel}>Total Conditions</Text>
            <Text style={styles.gridValue}>{conditionsCount} Listed</Text>
          </View>

          {/* Card 3: Family Records */}
          <View style={styles.gridItem}>
            <View style={[styles.gridIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.gridLabel}>Family Records</Text>
            <Text style={styles.gridValue}>{recordsCount} Stored</Text>
          </View>

          {/* Card 4: Family Members */}
          <View style={styles.gridItem}>
            <View style={[styles.gridIcon, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="people-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.gridLabel}>Family Size</Text>
            <Text style={styles.gridValue}>{membersCount} {membersCount === 1 ? 'Member' : 'Members'}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Profile Mode
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Health Status</Text>
      <View style={styles.gridContainer}>
        {/* Card 1: Risk Score */}
        <View style={styles.gridItem}>
          <View style={[styles.gridIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="speedometer-outline" size={24} color="#D97706" />
          </View>
          <Text style={styles.gridLabel}>Risk Score</Text>
          <Text style={styles.gridValue}>{getRiskScore(riskLevel)}</Text>
        </View>

        {/* Card 2: Conditions */}
        <View style={styles.gridItem}>
          <View style={[styles.gridIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="fitness-outline" size={24} color="#EF4444" />
          </View>
          <Text style={styles.gridLabel}>Conditions</Text>
          <Text style={styles.gridValue}>{conditionsCount} Listed</Text>
        </View>

        {/* Card 3: Medical Records */}
        <View style={styles.gridItem}>
          <View style={[styles.gridIcon, { backgroundColor: COLORS.primaryLight }]}>
            <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.gridLabel}>Medical Records</Text>
          <Text style={styles.gridValue}>{recordsCount} Stored</Text>
        </View>

        {/* Card 4: Active Medications */}
        <View style={styles.gridItem}>
          <View style={[styles.gridIcon, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="medkit-outline" size={24} color="#10B981" />
          </View>
          <Text style={styles.gridLabel}>Medications</Text>
          <Text style={styles.gridValue}>{medicationsCount} Active</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  gridValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: 4,
  },
});
