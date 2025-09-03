import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

interface StripeProviderWrapperProps {
  children: React.ReactNode;
}

export default function StripeProviderWrapper({ children }: StripeProviderWrapperProps) {
  const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_default_key';
  
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      {children}
    </StripeProvider>
  );
}