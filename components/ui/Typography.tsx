import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, Typography as TypographyConstants } from '@/constants/design';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLarge' | 'caption' | 'overline';
  color?: keyof typeof Colors.neutral | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: TextStyle;
  testID?: string;
}

export function Typography({
  children,
  variant = 'body',
  color = '800',
  weight,
  align = 'left',
  numberOfLines,
  style,
  testID,
}: TypographyProps) {
  const getColor = () => {
    switch (color) {
      case 'primary':
        return Colors.primary[500];
      case 'secondary':
        return Colors.orange[500];
      case 'success':
        return Colors.success[500];
      case 'error':
        return Colors.error[500];
      case 'warning':
        return Colors.warning[500];
      default:
        return Colors.neutral[color as keyof typeof Colors.neutral];
    }
  };

  const getFontWeight = () => {
    if (weight) return weight;
    
    switch (variant) {
      case 'display':
      case 'h1':
      case 'h2':
        return 'bold';
      case 'h3':
      case 'h4':
        return 'semiBold';
      case 'overline':
        return 'medium';
      default:
        return 'regular';
    }
  };

  return (
    <Text 
      style={[
        styles.base,
        styles[variant],
        {
          color: getColor(),
          fontFamily: TypographyConstants.fontFamily[getFontWeight()],
          textAlign: align,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      testID={testID}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  display: {
    fontSize: TypographyConstants.fontSize['6xl'],
    lineHeight: TypographyConstants.fontSize['6xl'] * TypographyConstants.lineHeight.tight,
    letterSpacing: TypographyConstants.letterSpacing.tight,
  },
  h1: {
    fontSize: TypographyConstants.fontSize['4xl'],
    lineHeight: TypographyConstants.fontSize['4xl'] * TypographyConstants.lineHeight.tight,
    letterSpacing: TypographyConstants.letterSpacing.tight,
  },
  h2: {
    fontSize: TypographyConstants.fontSize['3xl'],
    lineHeight: TypographyConstants.fontSize['3xl'] * TypographyConstants.lineHeight.tight,
    letterSpacing: TypographyConstants.letterSpacing.tight,
  },
  h3: {
    fontSize: TypographyConstants.fontSize['2xl'],
    lineHeight: TypographyConstants.fontSize['2xl'] * TypographyConstants.lineHeight.tight,
  },
  h4: {
    fontSize: TypographyConstants.fontSize.xl,
    lineHeight: TypographyConstants.fontSize.xl * TypographyConstants.lineHeight.tight,
  },
  bodyLarge: {
    fontSize: TypographyConstants.fontSize.lg,
    lineHeight: TypographyConstants.fontSize.lg * TypographyConstants.lineHeight.normal,
  },
  body: {
    fontSize: TypographyConstants.fontSize.base,
    lineHeight: TypographyConstants.fontSize.base * TypographyConstants.lineHeight.normal,
  },
  caption: {
    fontSize: TypographyConstants.fontSize.sm,
    lineHeight: TypographyConstants.fontSize.sm * TypographyConstants.lineHeight.normal,
  },
  overline: {
    fontSize: TypographyConstants.fontSize.xs,
    lineHeight: TypographyConstants.fontSize.xs * TypographyConstants.lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: TypographyConstants.letterSpacing.wider,
  },
});