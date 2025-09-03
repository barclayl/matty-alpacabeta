import { Platform } from 'react-native';

export interface PaymentIntent {
  client_secret: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: any;
  error?: string;
}

const API_BASE_URL = 'http://192.168.1.100:3001/api'; // Replace 192.168.1.100 with your machine's IP address

// Mock Stripe hooks for web platform
const mockStripeHooks = {
  initGooglePay: async () => ({ error: null }),
  presentGooglePay: async () => ({ error: { code: 'Canceled', message: 'Not supported on web' }, paymentIntent: null }),
  isGooglePaySupported: async () => false,
};

// Conditionally import Stripe hooks
const useStripeHooks = Platform.OS === 'web' 
  ? () => mockStripeHooks
  : () => require('@stripe/stripe-react-native').useStripe();

export class PaymentService {
  static async createPaymentIntent(
    amount: number,
    description?: string,
    currency: string = 'usd'
  ): Promise<PaymentIntent> {
    const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return response.json();
  }
}

export function usePayment() {
  const { initGooglePay, presentGooglePay, isGooglePaySupported } = useStripeHooks();

  const processGooglePayPayment = async (
    amount: number,
    description?: string
  ): Promise<PaymentResult> => {
    if (Platform.OS === 'web') {
      return {
        success: false,
        error: 'Payments are not supported on web platform',
      };
    }

    try {
      // Check if Google Pay is supported
      const isSupported = await isGooglePaySupported({
        testEnv: true, // Set to false in production
      });

      if (!isSupported) {
        throw new Error('Google Pay is not supported on this device');
      }

      // Create payment intent on server
      const paymentIntent = await PaymentService.createPaymentIntent(amount, description);

      // Initialize Google Pay
      const { error: initError } = await initGooglePay({
        testEnv: true, // Set to false in production
        merchantName: 'Matty',
        countryCode: 'US',
        merchantIdentifier: 'merchant.com.mattyfintech',
        billingAddressConfig: {
          format: 'FULL',
          isPhoneNumberRequired: true,
          isRequired: false,
        },
        existingPaymentMethodRequired: false,
        isEmailRequired: true,
      });

      if (initError) {
        throw new Error(`Google Pay initialization failed: ${initError.message}`);
      }

      // Present Google Pay sheet
      const { error: presentError, paymentIntent: confirmedPaymentIntent } = await presentGooglePay({
        clientSecret: paymentIntent.client_secret,
        forSetupIntent: false,
      });

      if (presentError) {
        if (presentError.code === 'Canceled') {
          return { success: false, error: 'Payment was canceled' };
        }
        throw new Error(`Payment failed: ${presentError.message}`);
      }

      return {
        success: true,
        paymentIntent: confirmedPaymentIntent,
      };
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  };

  return {
    processGooglePayPayment,
    isGooglePaySupported,
  };
}