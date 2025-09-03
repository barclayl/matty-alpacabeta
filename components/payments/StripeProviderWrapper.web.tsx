import React from 'react';

interface StripeProviderWrapperProps {
  children: React.ReactNode;
}

export default function StripeProviderWrapper({ children }: StripeProviderWrapperProps) {
  return <>{children}</>;
}