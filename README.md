# Matty Fintech App

A comprehensive fintech mobile application built with React Native and Expo that demonstrates the seamless integration of a consumer debit card with an automated, algorithm-driven investment account performing short-term trades.

## Features

### 🏦 Core Banking & Investment
- **User Onboarding**: Complete profile creation with Alpaca brokerage account integration
- **Virtual Debit Card**: Simulated card issuance using Lithic API with Google Wallet integration
- **Real-time Trading**: Intraday trading timeline showing how funds are actively invested
- **Instant Transfers**: Quick transfer functionality between trading and spending accounts

### 💡 Smart Features
- **Round-Up & Invest**: Automatically round up purchases and invest the spare change
- **AI-Powered Insights**: Personalized market analysis and investment recommendations
- **Goal-Based Investing**: Set financial goals with progress tracking
- **Community Pulse**: See trending stocks within the Matty ecosystem

### 🔒 Security & User Experience
- **Biometric Authentication**: Secure app access with fingerprint/Face ID
- **Push Notifications**: Real-time alerts for trades, transfers, and market updates
- **Professional UI**: Modern fintech design with smooth animations and micro-interactions

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **APIs**: Alpaca Broker API (sandbox), Lithic Card Issuing API
- **Payments**: Stripe React Native SDK with Google Pay integration
- **Navigation**: Expo Router with tab-based navigation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- iOS Simulator or Android emulator (or Expo Go app on your device)
- Alpaca API credentials (for sandbox environment)
- Lithic API credentials (optional, for virtual card creation)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy the `.env` file and add your API credentials:
   ```bash
   # Required for Alpaca integration
   ALPACA_API_KEY=your_alpaca_api_key_here
   ALPACA_SECRET_KEY=your_alpaca_secret_key_here
   
   # Optional for Lithic card creation
   LITHIC_API_KEY=your_lithic_api_key_here
   ```
   
   # Required for Stripe payments
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   
   **Getting Alpaca API Keys:**
   1. Sign up at [Alpaca Broker API](https://alpaca.markets/broker)
   2. Navigate to the sandbox environment
   3. Generate your API key and secret key
   4. Add them to your `.env` file
   
   **Getting Stripe API Keys:**
   1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com/register)
   2. Navigate to the Developers section
   3. Get your publishable and secret keys from the API keys page
   4. Use the test keys (starting with `pk_test_` and `sk_test_`)
   5. Add them to your `.env` file

3. **Start the Backend Server**
   ```bash
   node server.js
   ```
   The server will start on http://localhost:3001

4. **Start the Expo Development Server**
   ```bash
   npm run dev
   ```

5. **Run the App**
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the QR code with the Expo Go app
   
   **Note**: For Google Pay functionality, you'll need to create a development build:
   ```bash
   npx expo run:android
   ```
   Google Pay requires native code and won't work in Expo Go.

### API Integration Status

The app now integrates with real APIs:

**✅ Alpaca Broker API (Sandbox)**
- Real brokerage account creation
- Live trading positions and balances
- Actual order execution and management
- Real-time market data and quotes
- Portfolio history and performance tracking

**🔄 Lithic Card API (Optional)**
- Virtual debit card creation
- Falls back to mock data if not configured

**📊 Real Market Data**
- Live stock quotes and pricing
- Market open/close status
- Trading calendar integration

**💳 Stripe Payments**
- Google Pay integration for secure payments
- Payment intent creation and processing
- Real payment confirmation flow
### Testing the Integration

1. **Check API Status**: Visit http://localhost:3001/health to verify API configuration
2. **Create Account**: Use the profile tab to create a new Alpaca account
3. **View Real Data**: Trading and insights tabs will show live market data
4. **Execute Trades**: Use the simulate trading feature to place real orders in sandbox
5. **Test Payments**: Use the card tab to test Google Pay payments with trading profits

## App Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation configuration
│   ├── index.tsx            # Home screen with balance and trading timeline
│   ├── card.tsx             # Virtual debit card management
│   ├── trading.tsx          # Trading positions and transfers
│   ├── insights.tsx         # AI insights and goal-based investing
│   └── profile.tsx          # User profile and account creation
├── _layout.tsx              # Root layout with navigation setup
└── +not-found.tsx          # 404 error screen

server.js                    # Node.js backend with API endpoints
```

## Key Features Implementation

### User Onboarding
- Complete KYC flow with Alpaca account creation
- Real-time validation and error handling
- Seamless transition to active trading account

### Virtual Card Integration
- Mock Lithic API integration for card issuance
- Google Wallet simulation for contactless payments
- Real-time balance updates

### Trading Timeline
- Visual representation of intraday trading activity
- Real-time profit/loss calculations
- Seamless fund availability for spending

### Round-up Investing
- Automatic transaction rounding with investment allocation
- Monthly summary and category breakdowns
- One-touch enable/disable functionality

## API Endpoints

### Alpaca Integration
- `POST /api/create-alpaca-account` - Create new brokerage account
- `GET /api/account/:id/balance` - Fetch account balance
- `GET /api/account/:id/positions` - Get current trading positions
- `POST /api/simulate-trade` - Execute mock trades

### Stripe Integration
- `POST /api/create-payment-intent` - Create payment intent for Google Pay

### Banking Features
- `POST /api/transfer` - Initiate bank transfers
- `GET /health` - Health check endpoint

## Design System

### Colors
- **Primary Green**: #10B981 (success, profits, primary actions)
- **Accent Blue**: #3B82F6 (information, secondary actions)
- **Warning Orange**: #F59E0B (alerts, pending states)
- **Error Red**: #EF4444 (losses, errors, sell actions)
- **Neutral Grays**: #111827, #374151, #6B7280, #9CA3AF

### Typography
- **Headings**: System font, bold weights
- **Body Text**: System font, regular and medium weights
- **Proper hierarchy**: 32px → 24px → 20px → 16px → 14px → 12px

### Spacing
- Consistent 8px spacing system
- 20px horizontal margins
- 24px vertical spacing for cards
- 16px internal card padding

## Production Considerations

### Security
- Implement proper API key management with environment variables
- Add rate limiting and request validation
- Use HTTPS for all API communications
- Implement proper user authentication and session management
- Secure payment processing with Stripe's security standards

### Performance
- Add loading states and skeleton screens
- Implement proper error boundaries
- Add offline functionality for critical features
- Optimize images and animations for smooth performance
- Handle payment timeouts and network errors gracefully

### Compliance
- Ensure FINRA and SEC compliance for trading features  
- Implement proper audit trails for all transactions
- Add required disclosures and risk warnings
- Follow data privacy regulations (GDPR, CCPA)
- Comply with PCI DSS standards for payment processing

## Development Notes

This is a prototype/MVP implementation designed to demonstrate the core concept of seamless spending and investing integration. For production use, you would need to:

1. Implement real API integrations with production credentials
2. Add comprehensive error handling and validation
3. Implement proper user authentication and security measures
4. Add comprehensive testing (unit, integration, e2e)
5. Follow financial industry compliance requirements
6. Add proper analytics and monitoring

## Support

For technical questions or issues:
1. Check the API endpoint responses in the server console
2. Verify all dependencies are installed correctly  
3. Ensure both frontend and backend servers are running
4. Check network connectivity between frontend and backend

---

**Disclaimer**: This is a demonstration app using sandbox/mock APIs. Do not use real financial credentials or attempt real trading with this code.