import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/design';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

const Icon = ({ name, size = 24, color = 'currentColor' }: IconProps) => {
  return <Ionicons name={name} size={size} color={color} />;
};

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button = ({ onPress, children, disabled = false, variant = 'primary' }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
};

export default function MattyWalletSimulation() {
  const [step, setStep] = useState('initial'); // initial, addingCard, cardAdded, transfer, confirmed
  const [loading, setLoading] = useState(false);
  const [transferAmount, setTransferAmount] = useState('150.00');

  const MATTY_CARD_BALANCE = 500.00; // The available balance after trading

  const handleAddCard = () => {
    setLoading(true);
    setStep('addingCard');
    setTimeout(() => {
      setLoading(false);
      setStep('cardAdded');
    }, 2500);
  };

  const handleInitiateTransfer = () => {
    setLoading(true);
    setStep('transfer');
    setTimeout(() => {
      setLoading(false);
      setStep('confirmed');
    }, 3000);
  };

  const resetSimulation = () => {
    setStep('initial');
  };

  const renderInitialState = () => (
    <View style={styles.walletContainer}>
      <View style={styles.walletHeader}>
        <Text style={styles.walletTitle}>Google Wallet</Text>
        <Text style={styles.googleLogo}>Google</Text>
      </View>
      <View style={styles.walletBodyEmpty}>
        <Icon name="wallet-outline" size={64} color={Colors.neutral[400]} />
        <Text style={styles.emptyText}>No payment methods</Text>
      </View>
      <View style={styles.walletFooter}>
        <Button onPress={handleAddCard}>
          <View style={styles.buttonContent}>
            <Icon name="add" size={20} color={Colors.neutral[0]} />
            <Text style={styles.buttonText}>Add to Wallet</Text>
          </View>
        </Button>
      </View>
    </View>
  );

  const renderAddingCardState = () => (
    <View style={styles.walletContainer}>
      <View style={styles.walletHeader}>
        <Text style={styles.walletTitle}>Adding Card</Text>
      </View>
      <View style={styles.walletBodyCentered}>
        <View style={styles.loader} />
        <Text style={styles.loadingText}>Contacting your bank...</Text>
        <View style={[styles.cardArt, { opacity: 0.5 }]}>
          <Text style={styles.cardText}>Matty</Text>
        </View>
      </View>
    </View>
  );

  const renderCardAddedState = () => (
    <View style={styles.walletContainer}>
      <View style={styles.walletHeader}>
        <Text style={styles.walletTitle}>Google Wallet</Text>
        <Text style={styles.googleLogo}>Google</Text>
      </View>
      <View style={styles.walletBody}>
        <View style={styles.cardArt}>
          <Text style={styles.cardText}>Matty</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardName}>Matty Debit Card</Text>
          <Text style={styles.cardNumber}>•••• 1234</Text>
        </View>
      </View>
      <View style={styles.walletFooter}>
        <Button onPress={() => setStep('transfer')}>
          <View style={styles.buttonContent}>
            <Icon name="send" size={20} color={Colors.neutral[0]} />
            <Text style={styles.buttonText}>Transfer Funds</Text>
          </View>
        </Button>
      </View>
    </View>
  );

  const renderTransferState = () => (
    <View style={styles.transferUiContainer}>
      <Text style={styles.uiTitle}>Instant Transfer</Text>
      
      {/* From Account */}
      <View style={styles.accountBox}>
        <Text style={styles.boxLabel}>From</Text>
        <View style={styles.accountDetails}>
          <View style={[styles.iconBg, { backgroundColor: Colors.primary[50] }]}>
            <Text style={styles.mattyIcon}>M</Text>
          </View>
          <View>
            <Text style={styles.accountName}>Matty Debit Card</Text>
            <Text style={styles.accountBalance}>Balance: ${MATTY_CARD_BALANCE.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Icon name="arrow-forward" size={32} color={Colors.neutral[400]} />
      </View>
      
      {/* To Account */}
      <View style={styles.accountBox}>
        <Text style={styles.boxLabel}>To</Text>
        <View style={styles.accountDetails}>
          <View style={[styles.iconBg, { backgroundColor: Colors.success[50] }]}>
            <Icon name="business" size={24} color={Colors.success[700]} />
          </View>
          <View>
            <Text style={styles.accountName}>Bank of America</Text>
            <Text style={styles.accountBalance}>Checking •••• 5678</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.amountInputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          value={transferAmount}
          onChangeText={setTransferAmount}
          style={styles.amountInput}
          keyboardType="numeric"
          placeholder="0.00"
        />
      </View>

      <Button 
        onPress={handleInitiateTransfer} 
        disabled={loading || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > MATTY_CARD_BALANCE}>
        <View style={styles.buttonContent}>
          {loading ? (
            <View style={styles.buttonLoader} />
          ) : (
            <Icon name="send" size={20} color={Colors.neutral[0]} />
          )}
          <Text style={styles.buttonText}>Transfer ${parseFloat(transferAmount).toFixed(2)}</Text>
        </View>
      </Button>
    </View>
  );
  
  const renderConfirmedState = () => (
    <View style={styles.transferUiContainer}>
      <View style={styles.confirmationContent}>
        <View style={styles.checkCircle}>
          <Icon name="checkmark" size={48} color={Colors.neutral[0]} />
        </View>
        <Text style={[styles.uiTitle, { color: Colors.success[500] }]}>Success!</Text>
        <Text style={styles.confirmationText}>
          You sent <Text style={styles.boldText}>${parseFloat(transferAmount).toFixed(2)}</Text> to Bank of America.
        </Text>
        <Text style={styles.confirmationSubtext}>Funds will be available instantly.</Text>
        <Button onPress={resetSimulation} variant="secondary">
          <Text style={[styles.buttonText, { color: Colors.neutral[800] }]}>Done</Text>
        </Button>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch(step) {
      case 'initial':
        return renderInitialState();
      case 'addingCard':
        return renderAddingCardState();
      case 'cardAdded':
        return renderCardAddedState();
      case 'transfer':
      case 'confirmed':
        return (
          <View style={styles.splitScreen}>
            {step === 'transfer' ? renderTransferState() : renderConfirmedState()}
            <TradingTimeline />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.simulationContainer}>
      {renderCurrentStep()}
    </View>
  );
}

const TradingTimeline = () => {
  const events = [
    { time: "09:30 AM", action: "DEPOSIT", amount: 10000, desc: "Initial funds moved to trading account" },
    { time: "10:15 AM", action: "BUY", amount: 2500, desc: "Bought 10 shares of NVDA" },
    { time: "11:00 AM", action: "BUY", amount: 3000, desc: "Bought 15 shares of AAPL" },
    { time: "01:45 PM", action: "SELL", amount: 2575, desc: "Sold 10 shares of NVDA for a profit" },
    { time: "03:50 PM", action: "SELL", amount: 3025, desc: "Sold 15 shares of AAPL for a profit" },
    { time: "04:01 PM", action: "WITHDRAW", amount: 500, desc: "Trading profits returned to Matty Card" },
  ];

  const getEventColor = (action: string) => {
    switch (action) {
      case 'BUY':
      case 'DEPOSIT':
        return Colors.primary[500];
      case 'SELL':
      case 'WITHDRAW':
        return Colors.success[500];
      default:
        return Colors.neutral[500];
    }
  };

  const getAmountColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return Colors.error[500];
      case 'SELL':
      case 'WITHDRAW':
        return Colors.success[500];
      default:
        return Colors.neutral[700];
    }
  };

  return (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineTitle}>Today's Trading Activity</Text>
      <Text style={styles.timelineSubtitle}>How your funds worked for you today:</Text>
      <View style={styles.timeline}>
        {events.map((event, index) => (
          <View key={index} style={styles.timelineEvent}>
            <View style={[styles.timelineIcon, { backgroundColor: getEventColor(event.action) }]}>
              <Text style={styles.timelineIconText}>{event.action.slice(0, 1)}</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTime}>{event.time}</Text>
              <Text style={styles.timelineDesc}>{event.desc}</Text>
            </View>
            <Text style={[styles.timelineAmount, { color: getAmountColor(event.action) }]}>
              {event.action === 'BUY' ? '-' : '+'}
              ${event.amount.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  simulationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface.secondary,
    padding: Spacing['2xl'],
  },
  splitScreen: {
    flexDirection: 'row',
    gap: Spacing['4xl'],
    width: '100%',
    maxWidth: 900,
    alignItems: 'flex-start',
  },
  // Wallet Styles
  walletContainer: {
    width: 380,
    height: 650,
    backgroundColor: Colors.surface.primary,
    borderRadius: BorderRadius['2xl'],
    ...Shadows.xl,
    overflow: 'hidden',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  walletTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[800],
  },
  googleLogo: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.neutral[600],
  },
  walletBody: {
    flex: 1,
    padding: Spacing.xl,
  },
  walletBodyEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletBodyCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    color: Colors.neutral[500],
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize.base,
  },
  cardArt: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  cardText: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[0],
  },
  cardDetails: {
    marginTop: Spacing['2xl'],
  },
  cardName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.neutral[900],
  },
  cardNumber: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
  walletFooter: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: Colors.neutral[200],
    borderTopColor: Colors.primary[500],
  },
  loadingText: {
    color: Colors.neutral[600],
    marginTop: Spacing.xl,
    fontSize: Typography.fontSize.lg,
  },
  // Transfer UI Styles
  transferUiContainer: {
    backgroundColor: Colors.surface.primary,
    padding: Spacing['3xl'],
    borderRadius: BorderRadius['2xl'],
    ...Shadows.xl,
    width: '100%',
    maxWidth: 420,
  },
  uiTitle: {
    fontSize: Typography.fontSize['4xl'],
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
    color: Colors.neutral[800],
    marginBottom: Spacing['3xl'],
  },
  accountBox: {
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  boxLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.neutral[500],
    marginBottom: Spacing.sm,
  },
  accountDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mattyIcon: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary[500],
  },
  accountName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.neutral[800],
  },
  accountBalance: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  amountInputContainer: {
    marginVertical: Spacing['3xl'],
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: Spacing.lg,
    top: '50%',
    fontSize: Typography.fontSize['5xl'],
    color: Colors.neutral[400],
    zIndex: 1,
  },
  amountInput: {
    width: '100%',
    fontSize: Typography.fontSize['6xl'],
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
    color: Colors.neutral[800],
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: Spacing.lg,
  },
  confirmationContent: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.neutral[700],
    textAlign: 'center',
  },
  boldText: {
    fontFamily: Typography.fontFamily.bold,
  },
  confirmationSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[500],
    marginTop: Spacing.sm,
  },
  // Timeline Styles
  timelineContainer: {
    backgroundColor: Colors.surface.primary,
    padding: Spacing['3xl'],
    borderRadius: BorderRadius['2xl'],
    ...Shadows.xl,
    width: '100%',
    maxWidth: 420,
  },
  timelineTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[800],
  },
  timelineSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[500],
    marginBottom: Spacing['2xl'],
  },
  timeline: {
    position: 'relative',
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  timelineIconText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.neutral[0],
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[500],
  },
  timelineDesc: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.neutral[800],
  },
  timelineAmount: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.bold,
  },
  // Button Styles
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary[500],
  },
  buttonSecondary: {
    backgroundColor: Colors.neutral[200],
  },
  buttonDisabled: {
    backgroundColor: Colors.neutral[300],
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.neutral[0],
  },
  buttonLoader: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: Colors.neutral[0],
  },
});