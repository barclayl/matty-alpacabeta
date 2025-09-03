import { useState } from 'react';

export interface FormData {
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

const initialFormData: FormData = {
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
};

export function useSignupForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = (field: keyof FormData, value: string) => {
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

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    updateField,
    validateStep,
    resetForm,
  };
}