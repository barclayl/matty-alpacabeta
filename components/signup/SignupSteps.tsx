import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '@/components/ui';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/design';

interface Step {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface SignupStepsProps {
  steps: Step[];
  currentStep: number;
}

export function SignupSteps({ steps, currentStep }: SignupStepsProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepIndicator}>
          <View style={[
            styles.stepCircle,
            {
              backgroundColor: index <= currentStep ? Colors.primary[500] : Colors.neutral[200],
            }
          ]}>
            <Ionicons 
              name={step.icon}
              size={16} 
              color={index <= currentStep ? Colors.neutral[0] : Colors.neutral[500]} 
            />
          </View>
          <Typography 
            variant="caption" 
            color={index <= currentStep ? 'primary' : '500'}
            weight={index === currentStep ? 'semiBold' : 'regular'}
            style={styles.stepLabel}>
            {step.title}
          </Typography>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  stepLabel: {
    textAlign: 'center',
    fontSize: 10,
  },
});