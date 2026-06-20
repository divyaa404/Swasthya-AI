// app/components/profile/HealthStatsCard.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
};

interface StatData {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  iconColor: string;
}

interface HealthStatsCardProps {
  stats?: StatData[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Extracted individual item to handle its own animation state
const StatItemCard: React.FC<{ stat: StatData; index: number }> = ({ stat, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entry animation on mount
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100, // Staggers the appearance
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacityAnim, slideAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95, // Shrink slightly on press
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Bounce back
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${stat.label}, ${stat.value}`}
      style={[
        styles.statItem,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
        <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
      </View>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {stat.value}
      </Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </AnimatedPressable>
  );
};

export const HealthStatsCard: React.FC<HealthStatsCardProps> = ({
  stats = [
    { icon: 'medical', label: 'Records', value: '12', color: '#E8F1FE', iconColor: '#0474FC' },
    { icon: 'fitness', label: 'Symptoms', value: '5', color: '#FEE2E2', iconColor: '#EF4444' },
    { icon: 'medkit', label: 'Medications', value: '2', color: '#ECFDF5', iconColor: '#10B981' },
  ],
}) => {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <StatItemCard key={index} stat={stat} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16, // Slightly rounder for a modern feel
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    // Upgraded cross-platform shadows
    ...Platform.select({
      ios: {
        shadowColor: '#111827',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24, // Perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5, // Tighter letter spacing looks more premium for numbers
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
    marginTop: 4,
  },
});

export default HealthStatsCard;