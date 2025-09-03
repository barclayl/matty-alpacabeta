import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Colors, BorderRadius, Shadows } from '@/constants/design';

interface AvatarProps {
  name?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  testID?: string;
}

export function Avatar({
  name,
  initials,
  size = 'md',
  backgroundColor = Colors.primary[500],
  textColor = Colors.neutral[0],
  style,
  testID,
}: AvatarProps) {
  const getAvatarSize = () => {
    switch (size) {
      case 'sm': return 32;
      case 'md': return 48;
      case 'lg': return 64;
      case 'xl': return 80;
    }
  };

  const getInitials = () => {
    if (initials) return initials;
    if (name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return '??';
  };

  const getTextVariant = () => {
    switch (size) {
      case 'sm': return 'caption';
      case 'md': return 'body';
      case 'lg': return 'h4';
      case 'xl': return 'h3';
      default: return 'body';
    }
  };

  const avatarSize = getAvatarSize();

  return (
    <View
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor,
        },
        style,
      ]}
      testID={testID}>
      <Typography 
        variant={getTextVariant() as any}
        weight="bold"
        style={{ color: textColor }}>
        {getInitials()}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
});