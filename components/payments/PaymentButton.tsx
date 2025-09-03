import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Button } from '@/components/ui';
import { useStripe } from '@/hooks/useStripeHooks';

interface PaymentButtonProps {
  amount: number;
  description?: string;
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
  title?: string;
}

export function PaymentButton({
  amount,
  description,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  title = 'Pay with Google Pay',
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error(`Server responded with: ${errorText}`);
      }

      const { clientSecret } = await response.json();
      return { clientSecret };
    } catch (error) {
      console.error("Network Error:", error);
      throw new Error('Could not connect to the server to initialize payment.');
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const { clientSecret } = await fetchPaymentSheetParams();

      if (!clientSecret) {
        throw new Error('No client secret received');
      }

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Matty, Inc.',
        allowsDelayedPaymentMethods: true,
        googlePay: {
          merchantCountryCode: 'US',
          testEnv: true,
          currencyCode: 'USD',
          merchantIdentifier: 'merchant.com.mattyfintech',
        },
      });

      if (error) {
        console.error('Stripe initPaymentSheet error:', error);
        throw new Error(`Error initializing payment sheet: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Payment sheet initialization error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Supported', 'Payments are not supported on web platform. Please use the mobile app.');
      return;
    }

    setIsLoading(true);

    try {
      // Initialize payment sheet
      await initializePaymentSheet();

      // Present payment sheet
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === 'Canceled') {
          // User canceled the payment
          return;
        }
        throw new Error(error.message);
      }

      // Payment successful
      Alert.alert('Success', 'Your payment was successful!');
      onPaymentSuccess?.(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      Alert.alert('Payment Error', errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      title={title}
      onPress={handlePayment}
      loading={isLoading}
      disabled={disabled || isLoading}
      variant="primary"
      size="lg"
      fullWidth
    />
  );
}