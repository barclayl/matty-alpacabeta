import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Card, Typography, Button, IconButton, ProgressBar } from '@/components/ui';
import { 
  SignupSteps, 
  PersonalInfoStep, 
  ContactInfoStep, 
  EmploymentStep, 
  FinancialStep, 
  ReviewStep 
} from '@/components/signup';
import { useSignupForm } from '@/hooks/useSignupForm';
import { AlpacaService } from '@/services/alpacaService';
import { Colors, Spacing, BorderRadius } from '@/constants/design';

const STEPS = [
  { id: 'personal', title: 'Personal Information', icon: 'person' },
  { id: 'contact', title: 'Contact Details', icon: 'mail' },
  { id: 'employment', title: 'Employment Info', icon: 'briefcase' },
  { id: 'financial', title: 'Financial Profile', icon: 'trending-up' },
  { id: 'review', title: 'Review & Submit', icon: 'checkmark-circle' },
];

export default function AlpacaSignupScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { formData, updateField, validateStep, resetForm } = useSignupForm();

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Missing Information', 'Please fill in all required fields before continuing.');
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep - 1)) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }

    setLoading(true);

    try {
      const result = await AlpacaService.createAccount({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });

      Alert.alert(
        'Account Created Successfully!',
        `Your Alpaca brokerage account has been created.\n\nAccount ID: ${result.alpaca_account.id}\n\nYou can now start trading and using your Matty card.`,
        [
          {
            text: 'Continue to App',
            onPress: () => {
              resetForm();
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Account Creation Failed',
        error instanceof Error ? error.message : 'Please try again or contact support.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep 
            formData={formData} 
            onUpdateField={updateField} 
          />
        );
      case 1:
        return (
          <ContactInfoStep 
            formData={formData} 
            onUpdateField={updateField} 
          />
        );
      case 2:
        return (
          <EmploymentStep 
            formData={formData} 
            onUpdateField={updateField} 
          />
        );
      case 3:
        return (
          <FinancialStep 
            formData={formData} 
            onUpdateField={updateField} 
          />
        );
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            onPress={() => router.back()}
            variant="ghost"
          />
          <Typography variant="h3" color="900">Create Account</Typography>
          <View style={{ width: 44 }} />
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Typography variant="body" color="700" weight="semiBold">
              Step {currentStep + 1} of {STEPS.length}
            </Typography>
            <Typography variant="caption" color="500">
              {STEPS[currentStep].title}
            </Typography>
          </View>
          <ProgressBar 
            progress={progress}
            color={Colors.primary[500]}
            height={6}
            style={styles.progressBar}
          />
        </View>

        {/* Step Indicators */}
        <SignupSteps steps={STEPS} currentStep={currentStep} />

        {/* Form Content */}
        <Card style={styles.formCard} padding="2xl">
          {renderCurrentStep()}
        </Card>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              size="lg"
              style={styles.backButton}
            />
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <Button
              title="Continue"
              onPress={handleNext}
              size="lg"
              style={styles.nextButton}
            />
          ) : (
            <Button
              title="Create Account"
              onPress={handleSubmit}
              loading={loading}
              size="lg"
              style={styles.nextButton}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['5xl'],
    paddingBottom: Spacing.lg,
  },
  progressSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBar: {
    marginTop: Spacing.sm,
  },
  formCard: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surface.primary,
    marginBottom: Spacing['2xl'],
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});