import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Input } from '@/components/ui';
import { Spacing } from '@/constants/design';

interface ContactInfoStepProps {
  formData: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onUpdateField: (field: string, value: string) => void;
}

export function ContactInfoStep({ formData, onUpdateField }: ContactInfoStepProps) {
  return (
    <View style={styles.container}>
      <Typography variant="h3" color="900" style={styles.title}>
        Contact Information
      </Typography>
      <Typography variant="body" color="500" style={styles.description}>
        How can we reach you?
      </Typography>

      <Input
        label="Email Address *"
        value={formData.email}
        onChangeText={(value) => onUpdateField('email', value)}
        placeholder="your.email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        variant="filled"
        leftIcon="mail"
      />

      <Input
        label="Phone Number *"
        value={formData.phone}
        onChangeText={(value) => onUpdateField('phone', value)}
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
        variant="filled"
        leftIcon="call"
      />

      <Input
        label="Street Address *"
        value={formData.address}
        onChangeText={(value) => onUpdateField('address', value)}
        placeholder="123 Main Street"
        variant="filled"
        leftIcon="home"
      />

      <View style={styles.addressRow}>
        <Input
          label="City *"
          value={formData.city}
          onChangeText={(value) => onUpdateField('city', value)}
          placeholder="New York"
          variant="filled"
          style={styles.cityInput}
        />

        <Input
          label="State *"
          value={formData.state}
          onChangeText={(value) => onUpdateField('state', value)}
          placeholder="NY"
          variant="filled"
          style={styles.stateInput}
        />
      </View>

      <Input
        label="ZIP Code *"
        value={formData.zipCode}
        onChangeText={(value) => onUpdateField('zipCode', value)}
        placeholder="10001"
        keyboardType="numeric"
        variant="filled"
        leftIcon="location"
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
  addressRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cityInput: {
    flex: 2,
  },
  stateInput: {
    flex: 1,
  },
});