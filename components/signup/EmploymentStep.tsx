import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Input, Button } from '@/components/ui';
import { Spacing } from '@/constants/design';

interface EmploymentStepProps {
  formData: {
    employmentStatus: string;
    employerName: string;
  };
  onUpdateField: (field: string, value: string) => void;
}

export function EmploymentStep({ formData, onUpdateField }: EmploymentStepProps) {
  const employmentOptions = ['employed', 'self_employed', 'unemployed', 'retired', 'student'];

  return (
    <View style={styles.container}>
      <Typography variant="h3" color="900" style={styles.title}>
        Employment Information
      </Typography>
      <Typography variant="body" color="500" style={styles.description}>
        Tell us about your employment status
      </Typography>

      <View style={styles.optionsSection}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Employment Status *
        </Typography>
        <View style={styles.optionButtons}>
          {employmentOptions.map((status) => (
            <Button
              key={status}
              title={status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              onPress={() => onUpdateField('employmentStatus', status)}
              variant={formData.employmentStatus === status ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>

      {(formData.employmentStatus === 'employed' || formData.employmentStatus === 'self_employed') && (
        <Input
          label="Employer Name *"
          value={formData.employerName}
          onChangeText={(value) => onUpdateField('employerName', value)}
          placeholder="Company Name"
          variant="filled"
          leftIcon="business"
        />
      )}
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