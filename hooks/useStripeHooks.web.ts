// Mock Stripe hooks for web platform
const mockStripeHooks = {
  initPaymentSheet: async () => ({ error: null }),
  presentPaymentSheet: async () => ({ error: { code: 'Canceled', message: 'Not supported on web' } }),
};

export const useStripe = () => mockStripeHooks;