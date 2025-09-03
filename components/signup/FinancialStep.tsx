import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Button } from '@/components/ui';
import { Spacing } from '@/constants/design';

interface FinancialStepProps {
  formData: {
    annualIncome: string;
    netWorth: string;
    investmentExperience: string;
    riskTolerance: string;
  };
  onUpdateField: (field: string, value: string) => void;
}

export function FinancialStep({ formData, onUpdateField }: FinancialStepProps) {
  const incomeOptions = ['<$25k', '$25k-$50k', '$50k-$100k', '$100k-$250k', '>$250k'];
  const networthOptions = ['<$10k', '$10k-$50k', '$50k-$100k', '$100k-$500k', '>$500k'];
  const experienceOptions = ['beginner', 'intermediate', 'advanced'];
  const riskOptions = ['conservative', 'moderate', 'aggressive'];

  return (
    <View style={styles.container}>
      <Typography variant="h3" color="900" style={styles.title}>
        Financial Profile
      </Typography>
      <Typography variant="body" color="500" style={styles.description}>
        Help us understand your financial situation
      </Typography>

      <View style={styles.optionsSection}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Annual Income *
        </Typography>
        <View style={styles.optionButtons}>
          {incomeOptions.map((income) => (
            <Button
              key={income}
              title={income}
              onPress={() => onUpdateField('annualIncome', income)}
              variant={formData.annualIncome === income ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.optionsSection}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Net Worth *
        </Typography>
        <View style={styles.optionButtons}>
          {networthOptions.map((worth) => (
            <Button
              key={worth}
              title={worth}
              onPress={() => onUpdateField('netWorth', worth)}
              variant={formData.netWorth === worth ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.optionsSection}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Investment Experience
        </Typography>
        <View style={styles.optionButtons}>
          {experienceOptions.map((exp) => (
            <Button
              key={exp}
              title={exp.charAt(0).toUpperCase() + exp.slice(1)}
              onPress={() => onUpdateField('investmentExperience', exp)}
              variant={formData.investmentExperience === exp ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.optionsSection}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Risk Tolerance
        </Typography>
        <View style={styles.optionButtons}>
          {riskOptions.map((risk) => (
            <Button
              key={risk}
              title={risk.charAt(0).toUpperCase() + risk.slice(1)}
              onPress={() => onUpdateField('riskTolerance', risk)}
              variant={formData.riskTolerance === risk ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  optionsSection: {
    marginBottom: Spacing.lg,
  },
  optionLabel: {
    marginBottom: Spacing.md,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    minWidth: 100,
  },
});