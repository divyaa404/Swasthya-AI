// app/components/profile/FamilyMembersList.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#0474FC',
  primaryDark: '#0360D0',
  primaryLight: '#E8F1FE',
  card: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    light: '#9CA3AF',
  },
  risk: {
    low: '#10B981',
    moderate: '#F59E0B',
    elevated: '#F97316',
    high: '#EF4444',
  },
  divider: '#E5E7EB',
  success: '#10B981',
  successLight: '#D1FAE5',
};

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: string;
  risk: string;
  phone?: string;
}

interface FamilyMembersListProps {
  members: FamilyMember[];
}

interface CallAlertProps {
  visible: boolean;
  name: string;
  phone: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Custom Call Alert Component
const CallAlert = ({ visible, name, phone, onConfirm, onCancel }: CallAlertProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.alertOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.alertContainer}>
              <LinearGradient
                colors={[COLORS.success, '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.alertGradientIcon}
              >
                <Ionicons name="call" size={32} color="#FFFFFF" />
              </LinearGradient>
              
              <Text style={styles.alertTitle}>📞 Call {name}?</Text>
              <Text style={styles.alertMessage}>
                You are about to call {name} at {phone}
              </Text>

              <View style={styles.alertButtons}>
                <TouchableOpacity style={styles.alertCancelBtn} onPress={onCancel}>
                  <Text style={styles.alertCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertConfirmBtn} onPress={onConfirm}>
                  <LinearGradient
                    colors={[COLORS.success, '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.alertConfirmGradient}
                  >
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                    <Text style={styles.alertConfirmText}>Call Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const FamilyMembersList: React.FC<FamilyMembersListProps> = ({ members }) => {
  const [callAlertVisible, setCallAlertVisible] = useState(false);
  const [callName, setCallName] = useState('');
  const [callPhone, setCallPhone] = useState('');

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
      case 'green':
        return COLORS.risk.low;
      case 'moderate':
      case 'yellow':
        return COLORS.risk.moderate;
      case 'elevated':
      case 'orange':
        return COLORS.risk.elevated;
      case 'high':
      case 'red':
        return COLORS.risk.high;
      default:
        return COLORS.risk.low;
    }
  };

  const showCallAlert = (name: string, phone: string) => {
    if (!phone) {
      Alert.alert('Unavailable', `No phone number saved for ${name}`);
      return;
    }
    setCallName(name);
    setCallPhone(phone);
    setCallAlertVisible(true);
  };

  const handleCall = () => {
    const cleanPhone = callPhone.replace(/\D/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Error', 'Could not initiate call');
    });
    setCallAlertVisible(false);
  };

  const getAvatarColor = (relationship: string) => {
    switch (relationship) {
      case 'Father': return '#0474FC';
      case 'Mother': return '#EC4899';
      case 'Grandfather': return '#6B7280';
      case 'Grandmother': return '#8B5CF6';
      case 'Child': return '#10B981';
      case 'Sister': return '#EC4899';
      case 'Brother': return '#0474FC';
      default: return COLORS.primary;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Family Members</Text>
      {members.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={40} color={COLORS.text.secondary} />
          <Text style={styles.emptyText}>No family members found.</Text>
        </View>
      ) : (
        members.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={[styles.memberAvatar, { backgroundColor: getAvatarColor(member.relationship) }]}>
              <Text style={styles.memberInitial}>{member.name[0]}</Text>
            </View>

            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberSubtext}>
                {member.age} yrs • {member.relationship}
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(member.risk) }]}>
                <Text style={styles.riskBadgeText}>{member.risk}</Text>
              </View>

              {member.phone && (
                <TouchableOpacity 
                  style={styles.callButton} 
                  onPress={() => showCallAlert(member.name, member.phone!)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}

      {/* Custom Call Alert */}
      <CallAlert
        visible={callAlertVisible}
        name={callName}
        phone={callPhone}
        onConfirm={handleCall}
        onCancel={() => setCallAlertVisible(false)}
      />
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
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  memberSubtext: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  callButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 8,
  },
  // Alert Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  alertGradientIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  alertCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  alertCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  alertConfirmBtn: {
    flex: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertConfirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  alertConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FamilyMembersList;