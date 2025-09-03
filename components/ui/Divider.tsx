import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/design';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
  margin?: keyof typeof Spacing;
  style?: ViewStyle;
  testID?: string;
}

export function Divider({
  orientation = 'horizontal',
  color = Colors.neutral[200],
  thickness = 1,
  margin = 'md',
  style,
  testID,
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: color,
          [isHorizontal ? 'height' : 'width']: thickness,
          [isHorizontal ? 'marginVertical' : 'marginHorizontal']: Spacing[margin],
        },
        style,
      ]}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    // Base styles are applied dynamically
  },
});