import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Input } from '@/components/ui';
import { Spacing } from '@/constants/design';

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
  };
  onUpdateField: (field: string, value: string) => void;
}

export function PersonalInfoStep({ formData, onUpdateField }: PersonalInfoStepProps) {
  return (
    <View style={styles.container}>
      <Typography variant="h3" color="900" style={styles.title}>
        Personal Information
      </Typography>
      <Typography variant="body" color="500" style={styles.description}>
        We need some basic information to create your brokerage account
      </Typography>

      <Input
        label="First Name *"
        value={formData.firstName}
        onChangeText={(value) => onUpdateField('firstName', value)}
        placeholder="Enter your first name"
        variant="filled"
        leftIcon="person"
      />

      <Input
        label="Last Name *"
        value={formData.lastName}
        onChangeText={(value) => onUpdateField('lastName', value)}
        placeholder="Enter your last name"
        variant="filled"
        leftIcon="person"
      />

      <Input
        label="Date of Birth *"
        value={formData.dateOfBirth}
        onChangeText={(value) => onUpdateField('dateOfBirth', value)}
        placeholder="MM/DD/YYYY"
        variant="filled"
        leftIcon="calendar"
      />

      <Input
        label="Social Security Number *"
        value={formData.ssn}
        onChangeText={(value) => onUpdateField('ssn', value)}
        placeholder="XXX-XX-XXXX"
        variant="filled"
        leftIcon="shield-checkmark"
        secureTextEntry
      />
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
});