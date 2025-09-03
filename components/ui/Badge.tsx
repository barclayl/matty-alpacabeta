import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Colors, BorderRadius, Spacing } from '@/constants/design';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  testID?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  testID,
}: BadgeProps) {
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return '700';
    }
  };

  return (
    <View 
      style={[
        styles.base,
        styles[variant],
        styles[size],
        style,
      ]}
      testID={testID}>
      <Typography 
        variant="caption" 
        weight="semiBold" 
        color={getTextColor() as any}>
        {children}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  default: {
    backgroundColor: Colors.neutral[100],
  },
  primary: {
    backgroundColor: Colors.primary[50],
  },
  secondary: {
    backgroundColor: Colors.orange[50],
  },
  success: {
    backgroundColor: Colors.success[50],
  },
  error: {
    backgroundColor: Colors.error[50],
  },
  warning: {
    backgroundColor: Colors.warning[50],
  },
  
  // Sizes
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  lg: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});