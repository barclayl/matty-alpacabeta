import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from '../ui/Typography';
import { IconButton } from '../ui/IconButton';
import { Spacing } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  leftAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  style?: ViewStyle;
  testID?: string;
}

export function Header({
  title,
  subtitle,
  rightAction,
  leftAction,
  style,
  testID,
}: HeaderProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.content}>
        {leftAction && (
          <IconButton
            icon={leftAction.icon}
            onPress={leftAction.onPress}
            variant="ghost"
            size="md"
          />
        )}
        
        <View style={styles.titleContainer}>
          <Typography variant="h2" color="900" align="center">
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              color="500" 
              align="center"
              style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
        
        {rightAction && (
          <IconButton
            icon={rightAction.icon}
            onPress={rightAction.onPress}
            variant="ghost"
            size="md"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
});