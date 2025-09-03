import React from 'react';
import { View, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/design';

interface ScreenProps {
  children: React.ReactNode;
  variant?: 'default' | 'scroll' | 'modal';
  padding?: keyof typeof Spacing;
  backgroundColor?: string;
  style?: ViewStyle;
  testID?: string;
}

export function Screen({
  children,
  variant = 'default',
  padding = 'xl',
  backgroundColor = Colors.surface.secondary,
  style,
  testID,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.base,
    {
      backgroundColor,
      paddingTop: variant === 'modal' ? Spacing.xl : 0,
      paddingBottom: insets.bottom,
      paddingHorizontal: padding === 'none' ? 0 : Spacing[padding],
    },
    style,
  ];

  if (variant === 'scroll') {
    return (
      <ScrollView 
        style={containerStyle}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        testID={testID}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});