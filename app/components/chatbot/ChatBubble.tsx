// components/chat/ChatBubble.tsx
import { Avatar } from '@/components/ui/Avatar';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  saveStatus?: {
    action: string;
    message: string;
    symptoms_created?: string[];
    symptoms_updated?: string[];
    symptoms_resolved?: string[];
    saved_data?: Record<string, string[]>;
    importance_score?: number;
  };
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, timestamp, saveStatus }) => {
  const isUser = role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Avatar name="AI" size={32} />
        </View>
      )}
      
      <View style={[styles.bubbleWrapper, isUser ? styles.userBubbleWrapper : styles.assistantBubbleWrapper]}>
        {isUser ? (
          <LinearGradient
            colors={GRADIENTS.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.userBubble]}
          >
            <Text style={styles.userText}>{content}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.bubble, styles.assistantBubble]}>
            <Text style={styles.assistantText}>{content}</Text>
          </View>
        )}
        
        {/* Save Status Graph Card */}
        {saveStatus && (
          <View style={styles.savedDataCard}>
            <Text style={styles.savedTitle}>✅ {saveStatus.action || "Saved to health graph"}</Text>
            <Text style={styles.savedMessage}>{saveStatus.message}</Text>
            
            {saveStatus.saved_data && Object.keys(saveStatus.saved_data).length > 0 && (
              <View style={styles.detailsContainer}>
                {Object.entries(saveStatus.saved_data).map(([key, list]) => {
                  if (!Array.isArray(list) || list.length === 0) return null;
                  return (
                    <View key={key} style={styles.detailItem}>
                      <Text style={styles.detailLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </Text>
                      {list.map((item, idx) => (
                        <Text key={idx} style={styles.detailValue}>• {item}</Text>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}

            {saveStatus.importance_score !== undefined && (
              <View style={styles.scoreBar}>
                <Text style={styles.scoreText}>
                  Graph Importance Score: {saveStatus.importance_score}/10
                </Text>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.scoreIndicator,
                      { width: `${(saveStatus.importance_score / 10) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {timestamp && (
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: SPACING.sm,
  },
  bubbleWrapper: {
    maxWidth: '80%',
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
  },
  assistantBubbleWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fonts.regular,
    fontSize: TYPOGRAPHY.sizes.md,
  },
  assistantText: {
    color: COLORS.text.primary,
    fontFamily: TYPOGRAPHY.fonts.regular,
    fontSize: TYPOGRAPHY.sizes.md,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: SPACING.xs,
  },
  userTimestamp: {
    color: COLORS.gray[400],
    textAlign: 'right',
  },
  assistantTimestamp: {
    color: COLORS.gray[400],
    textAlign: 'left',
  },
  savedDataCard: {
    marginTop: SPACING.sm,
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
    padding: SPACING.sm,
    borderRadius: 8,
    width: '100%',
  },
  savedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27AE60',
    marginBottom: 4,
  },
  savedMessage: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 6,
  },
  detailsContainer: {
    marginTop: 4,
  },
  detailItem: {
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 11,
    color: '#475569',
    marginLeft: 6,
  },
  scoreBar: {
    marginTop: 6,
  },
  scoreText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  track: {
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    width: '100%',
  },
  scoreIndicator: {
    height: 4,
    backgroundColor: '#27AE60',
    borderRadius: 2,
  },
});