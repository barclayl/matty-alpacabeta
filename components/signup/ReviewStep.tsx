import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Card } from '@/components/ui';
import { Colors, Spacing, BorderRadius } from '@/constants/design';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  employmentStatus: string;
  employerName: string;
  annualIncome: string;
  netWorth: string;
  investmentExperience: string;
  riskTolerance: string;
}

interface ReviewStepProps {
  formData: FormData;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <View style={styles.container}>
      <Typography variant="h3" color="900" style={styles.title}>
        Review Your Information
      </Typography>
      <Typography variant="body" color="500" style={styles.description}>
        Please review your information before submitting
      </Typography>

      <Card style={styles.reviewCard} padding="lg">
        <View style={styles.reviewSection}>
          <Typography variant="body" color="700" weight="semiBold">Personal Information</Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            DOB: {formData.dateOfBirth}
          </Typography>
        </View>

        <View style={styles.reviewSection}>
          <Typography variant="body" color="700" weight="semiBold">Contact Information</Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            {formData.email}
          </Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            {formData.phone}
          </Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
          </Typography>
        </View>

        <View style={styles.reviewSection}>
          <Typography variant="body" color="700" weight="semiBold">Employment</Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            Status: {formData.employmentStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Typography>
          {formData.employerName && (
            <Typography variant="caption" color="600" style={styles.reviewText}>
              Employer: {formData.employerName}
            </Typography>
          )}
        </View>

        <View style={styles.reviewSection}>
          <Typography variant="body" color="700" weight="semiBold">Financial Profile</Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            Annual Income: {formData.annualIncome}
          </Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            Net Worth: {formData.netWorth}
          </Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            Experience: {formData.investmentExperience}
          </Typography>
          <Typography variant="caption" color="600" style={styles.reviewText}>
            Risk Tolerance: {formData.riskTolerance}
          </Typography>
        </View>
      </Card>

      <View style={styles.disclaimerSection}>
        <Typography variant="caption" color="500" style={styles.disclaimerText}>
          By submitting this application, you agree to Alpaca's Terms of Service and Privacy Policy. 
          Your account will be reviewed and approved within 1-2 business days.
        </Typography>
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
  reviewCard: {
    backgroundColor: Colors.neutral[100],
    marginTop: Spacing.lg,
  },
  reviewSection: {
    marginBottom: Spacing.lg,
  },
  reviewText: {
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  disclaimerSection: {
    backgroundColor: Colors.warning[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning[500],
  },
  disclaimerText: {
    lineHeight: 20,
  },
});