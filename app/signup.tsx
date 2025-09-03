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
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, Button, Input, IconButton, ProgressBar } from '@/components/ui';
import { AlpacaService } from '@/services/alpacaService';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/design';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
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
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: 'employed',
    employerName: '',
    annualIncome: '',
    netWorth: '',
    investmentExperience: 'beginner',
    riskTolerance: 'moderate',
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal Information
        return !!(formData.firstName && formData.lastName && formData.dateOfBirth && formData.ssn);
      case 1: // Contact Details
        return !!(formData.email && formData.phone && formData.address && formData.city && formData.state && formData.zipCode);
      case 2: // Employment
        return !!(formData.employmentStatus && (formData.employmentStatus !== 'employed' || formData.employerName));
      case 3: // Financial
        return !!(formData.annualIncome && formData.netWorth);
      default:
        return true;
    }
  };

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
            onPress: () => router.replace('/(tabs)'),
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

  const renderPersonalInfo = () => (
    <View style={styles.stepContent}>
      <Typography variant="h3" color="900" style={styles.stepTitle}>
        Personal Information
      </Typography>
      <Typography variant="body" color="500" style={styles.stepDescription}>
        We need some basic information to create your brokerage account
      </Typography>

      <Input
        label="First Name *"
        value={formData.firstName}
        onChangeText={(value) => updateFormData('firstName', value)}
        placeholder="Enter your first name"
        variant="filled"
        leftIcon="person"
      />

      <Input
        label="Last Name *"
        value={formData.lastName}
        onChangeText={(value) => updateFormData('lastName', value)}
        placeholder="Enter your last name"
        variant="filled"
        leftIcon="person"
      />

      <Input
        label="Date of Birth *"
        value={formData.dateOfBirth}
        onChangeText={(value) => updateFormData('dateOfBirth', value)}
        placeholder="MM/DD/YYYY"
        variant="filled"
        leftIcon="calendar"
      />

      <Input
        label="Social Security Number *"
        value={formData.ssn}
        onChangeText={(value) => updateFormData('ssn', value)}
        placeholder="XXX-XX-XXXX"
        variant="filled"
        leftIcon="shield-checkmark"
        secureTextEntry
      />
    </View>
  );

  const renderContactDetails = () => (
    <View style={styles.stepContent}>
      <Typography variant="h3" color="900" style={styles.stepTitle}>
        Contact Information
      </Typography>
      <Typography variant="body" color="500" style={styles.stepDescription}>
        How can we reach you?
      </Typography>

      <Input
        label="Email Address *"
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value)}
        placeholder="your.email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        variant="filled"
        leftIcon="mail"
      />

      <Input
        label="Phone Number *"
        value={formData.phone}
        onChangeText={(value) => updateFormData('phone', value)}
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
        variant="filled"
        leftIcon="call"
      />

      <Input
        label="Street Address *"
        value={formData.address}
        onChangeText={(value) => updateFormData('address', value)}
        placeholder="123 Main Street"
        variant="filled"
        leftIcon="home"
      />

      <View style={styles.addressRow}>
        <Input
          label="City *"
          value={formData.city}
          onChangeText={(value) => updateFormData('city', value)}
          placeholder="New York"
          variant="filled"
          style={styles.cityInput}
        />

        <Input
          label="State *"
          value={formData.state}
          onChangeText={(value) => updateFormData('state', value)}
          placeholder="NY"
          variant="filled"
          style={styles.stateInput}
        />
      </View>

      <Input
        label="ZIP Code *"
        value={formData.zipCode}
        onChangeText={(value) => updateFormData('zipCode', value)}
        placeholder="10001"
        keyboardType="numeric"
        variant="filled"
        leftIcon="location"
      />
    </View>
  );

  const renderEmploymentInfo = () => (
    <View style={styles.stepContent}>
      <Typography variant="h3" color="900" style={styles.stepTitle}>
        Employment Information
      </Typography>
      <Typography variant="body" color="500" style={styles.stepDescription}>
        Tell us about your employment status
      </Typography>

      <View style={styles.employmentOptions}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Employment Status *
        </Typography>
        <View style={styles.optionButtons}>
          {['employed', 'self_employed', 'unemployed', 'retired', 'student'].map((status) => (
            <Button
              key={status}
              title={status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              onPress={() => updateFormData('employmentStatus', status)}
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
          onChangeText={(value) => updateFormData('employerName', value)}
          placeholder="Company Name"
          variant="filled"
          leftIcon="business"
        />
      )}
    </View>
  );

  const renderFinancialProfile = () => (
    <View style={styles.stepContent}>
      <Typography variant="h3" color="900" style={styles.stepTitle}>
        Financial Profile
      </Typography>
      <Typography variant="body" color="500" style={styles.stepDescription}>
        Help us understand your financial situation
      </Typography>

      <View style={styles.incomeOptions}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Annual Income *
        </Typography>
        <View style={styles.optionButtons}>
          {['<$25k', '$25k-$50k', '$50k-$100k', '$100k-$250k', '>$250k'].map((income) => (
            <Button
              key={income}
              title={income}
              onPress={() => updateFormData('annualIncome', income)}
              variant={formData.annualIncome === income ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.networthOptions}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Net Worth *
        </Typography>
        <View style={styles.optionButtons}>
          {['<$10k', '$10k-$50k', '$50k-$100k', '$100k-$500k', '>$500k'].map((worth) => (
            <Button
              key={worth}
              title={worth}
              onPress={() => updateFormData('netWorth', worth)}
              variant={formData.netWorth === worth ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.experienceOptions}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Investment Experience
        </Typography>
        <View style={styles.optionButtons}>
          {['beginner', 'intermediate', 'advanced'].map((exp) => (
            <Button
              key={exp}
              title={exp.charAt(0).toUpperCase() + exp.slice(1)}
              onPress={() => updateFormData('investmentExperience', exp)}
              variant={formData.investmentExperience === exp ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.riskOptions}>
        <Typography variant="body" color="700" weight="semiBold" style={styles.optionLabel}>
          Risk Tolerance
        </Typography>
        <View style={styles.optionButtons}>
          {['conservative', 'moderate', 'aggressive'].map((risk) => (
            <Button
              key={risk}
              title={risk.charAt(0).toUpperCase() + risk.slice(1)}
              onPress={() => updateFormData('riskTolerance', risk)}
              variant={formData.riskTolerance === risk ? 'primary' : 'outline'}
              size="sm"
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContent}>
      <Typography variant="h3" color="900" style={styles.stepTitle}>
        Review Your Information
      </Typography>
      <Typography variant="body" color="500" style={styles.stepDescription}>
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderContactDetails();
      case 2:
        return renderEmploymentInfo();
      case 3:
        return renderFinancialProfile();
      case 4:
        return renderReview();
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
        <View style={styles.stepIndicators}>
          {STEPS.map((step, index) => (
            <View key={step.id} style={styles.stepIndicator}>
              <View style={[
                styles.stepCircle,
                {
                  backgroundColor: index <= currentStep ? Colors.primary[500] : Colors.neutral[200],
                }
              ]}>
                <Ionicons 
                  name={step.icon as any}
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
  stepIndicators: {
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
  formCard: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surface.primary,
    marginBottom: Spacing['2xl'],
  },
  stepContent: {
    gap: Spacing.lg,
  },
  stepTitle: {
    textAlign: 'center',
  },
  stepDescription: {
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
  employmentOptions: {
    marginBottom: Spacing.lg,
  },
  incomeOptions: {
    marginBottom: Spacing.lg,
  },
  networthOptions: {
    marginBottom: Spacing.lg,
  },
  experienceOptions: {
    marginBottom: Spacing.lg,
  },
  riskOptions: {
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