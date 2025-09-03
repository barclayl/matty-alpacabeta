import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, BorderRadius, Animation } from '@/constants/design';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  showGradient?: boolean;
}

export function ProgressBar({
  progress,
  color = Colors.primary[500],
  backgroundColor = Colors.neutral[200],
  height = 8,
  animated = true,
  showGradient = false,
}: ProgressBarProps) {
  const animatedProgress = useSharedValue(0);
  const clampedProgress = Math.max(0, Math.min(100, progress));

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(clampedProgress, {
        duration: Animation.duration.slow,
      });
    } else {
      animatedProgress.value = clampedProgress;
    }
  }, [clampedProgress, animated]);

  const animatedStyle = useAnimatedStyle(() => {
    const width = `${animatedProgress.value}%`;
    
    return {
      width,
      backgroundColor: showGradient 
        ? interpolateColor(
            animatedProgress.value,
            [0, 50, 100],
            [Colors.error[500], Colors.warning[500], Colors.success[500]]
          )
        : color,
    };
  });

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <Animated.View
        style={[
          styles.fill,
          { height },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.sm,
  },
});