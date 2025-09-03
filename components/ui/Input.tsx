import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  ViewStyle, 
  TextInputProps,
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from './Typography';
import { Colors, Typography as TypographyConstants, BorderRadius, ComponentSizes, Spacing } from '@/constants/design';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  testID?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  size = 'md',
  variant = 'default',
  style,
  inputStyle,
  testID,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon;
  
  const getInputColor = () => {
    if (hasError) return Colors.error[500];
    if (isFocused) return Colors.primary[500];
    return Colors.neutral[400];
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {label && (
        <Typography 
          variant="caption" 
          weight="semiBold" 
          color="700" 
          style={styles.label}>
          {label}
        </Typography>
      )}
      
      <View style={[
        styles.inputContainer,
        styles[variant],
        styles[size],
        isFocused && styles.focused,
        hasError && styles.error,
        inputStyle,
      ]}>
        {hasLeftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={ComponentSizes.icon.sm} 
            color={getInputColor()} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            hasLeftIcon && styles.inputWithLeftIcon,
            hasRightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={Colors.neutral[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        
        {hasRightIcon && (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}>
            <Ionicons 
              name={rightIcon} 
              size={ComponentSizes.icon.sm} 
              color={getInputColor()} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || hint) && (
        <Typography 
          variant="caption" 
          color={hasError ? 'error' : '500'} 
          style={styles.helperText}>
          {error || hint}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  
  // Variants
  default: {
    backgroundColor: Colors.surface.primary,
    borderColor: Colors.neutral[200],
  },
  filled: {
    backgroundColor: Colors.surface.secondary,
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.neutral[300],
  },
  
  // Sizes
  sm: ComponentSizes.input.sm,
  md: ComponentSizes.input.md,
  lg: ComponentSizes.input.lg,
  
  // States
  focused: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
  },
  error: {
    borderColor: Colors.error[500],
    borderWidth: 2,
  },
  
  // Input styling
  input: {
    flex: 1,
    fontSize: TypographyConstants.fontSize.base,
    fontFamily: TypographyConstants.fontFamily.regular,
    color: Colors.neutral[900],
    paddingVertical: 0, // Remove default padding
  },
  inputWithLeftIcon: {
    marginLeft: Spacing.sm,
  },
  inputWithRightIcon: {
    marginRight: Spacing.sm,
  },
  leftIcon: {
    marginLeft: Spacing.md,
  },
  rightIcon: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  helperText: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});