import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, ComponentSizes, Shadows } from '@/constants/design';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  testID,
}: IconButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonSize = () => {
    switch (size) {
      case 'xs': return 32;
      case 'sm': return 36;
      case 'md': return 44;
      case 'lg': return 52;
      case 'xl': return 60;
    }
  };

  const getIconSize = () => {
    return ComponentSizes.icon[size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : 'md'];
  };

  const getIconColor = () => {
    if (isDisabled) return Colors.neutral[400];
    
    switch (variant) {
      case 'primary':
        return Colors.neutral[0];
      case 'secondary':
        return Colors.neutral[0];
      case 'outline':
        return Colors.primary[500];
      case 'ghost':
        return Colors.neutral[600];
    }
  };

  const buttonSize = getButtonSize();

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        {
          width: buttonSize,
          height: buttonSize,
        },
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getIconColor()} 
        />
      ) : (
        <Ionicons 
          name={icon} 
          size={getIconSize()} 
          color={getIconColor()} 
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: Colors.primary[500],
    ...Shadows.md,
  },
  secondary: {
    backgroundColor: Colors.orange[500],
    ...Shadows.md,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  ghost: {
    backgroundColor: Colors.surface.primary,
    ...Shadows.sm,
  },
  
  // States
  disabled: {
    backgroundColor: Colors.neutral[200],
    borderColor: Colors.neutral[200],
  },
});