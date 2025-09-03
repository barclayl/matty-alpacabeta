import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, BorderRadius, Animation, Shadows } from '@/constants/design';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  testID?: string;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  testID,
}: SwitchProps) {
  const animatedValue = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    animatedValue.value = withTiming(value ? 1 : 0, {
      duration: Animation.duration.fast,
    });
  }, [value]);

  const getSwitchDimensions = () => {
    switch (size) {
      case 'sm': return { width: 40, height: 24, thumbSize: 20 };
      case 'md': return { width: 50, height: 30, thumbSize: 26 };
      case 'lg': return { width: 60, height: 36, thumbSize: 32 };
    }
  };

  const { width, height, thumbSize } = getSwitchDimensions();
  const thumbOffset = width - thumbSize - 2;

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [Colors.neutral[300], Colors.primary[500]]
    );

    return {
      backgroundColor: disabled ? Colors.neutral[200] : backgroundColor,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = animatedValue.value * thumbOffset;

    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.track,
        { width, height },
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}>
      <Animated.View style={[styles.trackBackground, trackStyle]} />
      <Animated.View 
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
          },
          thumbStyle,
        ]} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: BorderRadius.full,
    padding: 2,
    justifyContent: 'center',
  },
  trackBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.full,
  },
  thumb: {
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[0],
    ...Shadows.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});