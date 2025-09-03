import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '@/constants/design';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof Spacing;
  margin?: keyof typeof Spacing;
  style?: ViewStyle;
  testID?: string;
}

export function Card({ 
  children, 
  variant = 'default', 
  padding = 'xl',
  margin,
  style,
  testID,
}: CardProps) {
  return (
    <View 
      style={[
        styles.base,
        styles[variant],
        { padding: Spacing[padding] },
        margin && { margin: Spacing[margin] },
        style
      ]}
      testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
  },
  default: {
    backgroundColor: Colors.surface.primary,
    ...Shadows.md,
  },
  elevated: {
    backgroundColor: Colors.surface.elevated,
    ...Shadows.lg,
  },
  outlined: {
    backgroundColor: Colors.surface.primary,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    ...Shadows.sm,
  },
  filled: {
    backgroundColor: Colors.surface.secondary,
    ...Shadows.none,
  },
});