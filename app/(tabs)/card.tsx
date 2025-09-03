import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, IconButton, Button, Switch, Badge } from '@/components/ui';
import { Screen } from '@/components/layout';
import { PaymentButton } from '@/components/payments/PaymentButton';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/design';
import { formatCurrency, formatDate } from '@/utils';

const { width } = Dimensions.get('window');

export default function CardScreen() {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [roundUpEnabled, setRoundUpEnabled] = useState(true);
  
  const cardNumber = '**** **** **** 4532';
  const expiryDate = '12/27';
  const cvv = '***';
  const cardBalance = 1247.83;

  const recentTransactions = [
    { id: '1', merchant: 'Starbucks', amount: -4.85, date: new Date(), category: 'Food & Drink', roundUp: 0.15 },
    { id: '2', merchant: 'Uber', amount: -12.30, date: new Date(), category: 'Transportation', roundUp: 0.70 },
    { id: '3', merchant: 'Amazon', amount: -67.99, date: new Date(Date.now() - 86400000), category: 'Shopping', roundUp: 0.01 },
    { id: '4', merchant: 'Shell Gas', amount: -45.67, date: new Date(Date.now() - 86400000), category: 'Gas', roundUp: 0.33 },
  ];

  const handleAddToWallet = () => {
    setShowWalletModal(true);
  };

  const simulateWalletAdd = () => {
    setShowWalletModal(false);
    Alert.alert(
      'Success!',
      'Your Matty card has been added to Google Wallet. You can now use it for contactless payments.',
      [{ text: 'OK' }]
    );
  };

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Drink':
        return 'restaurant';
      case 'Transportation':
        return 'car';
      case 'Shopping':
        return 'bag';
      case 'Gas':
        return 'car-sport';
      default:
        return 'card';
    }
  };

  return (
    <Screen variant="scroll" padding="none" backgroundColor={Colors.neutral[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2" color="900">Matty Card</Typography>
        <IconButton 
          icon="ellipsis-horizontal" 
          onPress={() => console.log('More options')}
          variant="ghost"
        />
      </View>

      {/* Virtual Card */}
      <View style={styles.cardSection}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.cardHeader}>
            <Typography variant="h3" style={styles.cardTitle}>
              Matty
            </Typography>
            <View style={styles.cardChip}>
              <Ionicons name="card" size={24} color={Colors.orange[400]} />
            </View>
          </View>
          
          <View style={styles.cardNumber}>
            <Typography variant="xl" style={styles.cardNumberText}>
              {showCardDetails ? '4532 1234 5678 9012' : cardNumber}
            </Typography>
          </View>
          
          <View style={styles.cardFooter}>
            <View>
              <Typography variant="overline" style={styles.cardLabel}>
                Valid Thru
              </Typography>
              <Typography variant="body" style={styles.cardValue}>
                {showCardDetails ? expiryDate : '**/**'}
              </Typography>
            </View>
            <View>
              <Typography variant="overline" style={styles.cardLabel}>
                CVV
              </Typography>
              <Typography variant="body" style={styles.cardValue}>
                {showCardDetails ? '123' : cvv}
              </Typography>
            </View>
          </View>
        </LinearGradient>
        
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={toggleCardDetails}>
          <Ionicons 
            name={showCardDetails ? 'eye-off' : 'eye'} 
            size={18} 
            color={Colors.neutral[500]} 
          />
          <Typography variant="caption" color="500" style={{ marginLeft: Spacing.sm }}>
            {showCardDetails ? 'Hide Details' : 'Show Details'}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Balance Display */}
      <View style={styles.balanceSection}>
        <Typography variant="caption" color="500">Available Balance</Typography>
        <Typography variant="h1" color="900" style={{ marginTop: Spacing.xs }}>
          {formatCurrency(cardBalance)}
        </Typography>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddToWallet}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary[100] }]}>
              <Ionicons name="wallet" size={22} color={Colors.primary[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              Add to Wallet
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowPaymentModal(true)}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.success[100] }]}>
              <Ionicons name="card" size={22} color={Colors.success[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              Make Payment
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.warning[100] }]}>
              <Ionicons name="lock-closed" size={22} color={Colors.warning[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              Lock Card
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.neutral[200] }]}>
              <Ionicons name="settings" size={22} color={Colors.neutral[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              Settings
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Round-up Feature */}
      <View style={styles.featureSection}>
        <Card style={styles.featureCard} padding="xl">
          <View style={styles.featureHeader}>
            <View style={styles.featureInfo}>
              <Typography variant="h4" color="900">Round-Up & Invest</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                Round up purchases and invest the change
              </Typography>
            </View>
            <Switch
              value={roundUpEnabled}
              onValueChange={setRoundUpEnabled}
              size="md"
            />
          </View>
          {roundUpEnabled && (
            <View style={styles.roundUpStats}>
              <Badge variant="success" size="md">
                This month: {formatCurrency(23.47)} invested from round-ups
              </Badge>
            </View>
          )}
        </Card>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Recent Transactions
        </Typography>
        <Card style={styles.transactionsCard} padding="xl">
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Ionicons 
                    name={getCategoryIcon(transaction.category)} 
                    size={20} 
                    color={Colors.neutral[600]} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Typography variant="body" color="900" weight="semiBold">
                    {transaction.merchant}
                  </Typography>
                  <Typography variant="caption" color="500" style={{ marginTop: 2 }}>
                    {formatDate(transaction.date, { style: 'relative' })}
                  </Typography>
                  {roundUpEnabled && transaction.roundUp > 0 && (
                    <Typography variant="caption" color="success" weight="medium" style={{ marginTop: 2 }}>
                      +{formatCurrency(transaction.roundUp)} invested
                    </Typography>
                  )}
                </View>
                <Typography variant="body" color="900" weight="semiBold">
                  {formatCurrency(Math.abs(transaction.amount))}
                </Typography>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Google Wallet Modal */}
      <Modal
        visible={showWalletModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWalletModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" color="900">Add to Google Wallet</Typography>
              <IconButton 
                icon="close" 
                onPress={() => setShowWalletModal(false)}
                variant="ghost"
              />
            </View>
            
            <View style={styles.walletSteps}>
              <View style={styles.walletStep}>
                <View style={styles.stepNumber}>
                  <Typography variant="caption" color="0" weight="bold">1</Typography>
                </View>
                <Typography variant="body" color="700" style={{ flex: 1 }}>
                  Open Google Wallet on your device
                </Typography>
              </View>
              
              <View style={styles.walletStep}>
                <View style={styles.stepNumber}>
                  <Typography variant="caption" color="0" weight="bold">2</Typography>
                </View>
                <Typography variant="body" color="700" style={{ flex: 1 }}>
                  Tap "Add to Wallet" and scan your Matty card
                </Typography>
              </View>
              
              <View style={styles.walletStep}>
                <View style={styles.stepNumber}>
                  <Typography variant="caption" color="0" weight="bold">3</Typography>
                </View>
                <Typography variant="body" color="700" style={{ flex: 1 }}>
                  Verify your identity and start using contactless payments
                </Typography>
              </View>
            </View>
            
            <Button 
              title="Add to Google Wallet"
              onPress={simulateWalletAdd}
              size="lg"
              fullWidth
            />
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" color="900">Make a Payment</Typography>
              <IconButton 
                icon="close" 
                onPress={() => setShowPaymentModal(false)}
                variant="ghost"
              />
            </View>
            
            <View style={styles.paymentOptions}>
              <Typography variant="body" color="700" style={{ marginBottom: Spacing.lg }}>
                Choose a payment amount to test Google Pay integration:
              </Typography>
              
              <View style={styles.paymentAmounts}>
                <PaymentButton
                  amount={9.99}
                  description="Coffee Purchase"
                  title="Pay $9.99 - Coffee"
                  onPaymentSuccess={() => {
                    setShowPaymentModal(false);
                    Alert.alert('Success!', 'Payment completed successfully');
                  }}
                  onPaymentError={(error) => {
                    console.error('Payment error:', error);
                  }}
                />
                
                <View style={{ marginTop: Spacing.md }}>
                  <PaymentButton
                    amount={24.99}
                    description="Lunch Purchase"
                    title="Pay $24.99 - Lunch"
                    onPaymentSuccess={() => {
                      setShowPaymentModal(false);
                      Alert.alert('Success!', 'Payment completed successfully');
                    }}
                    onPaymentError={(error) => {
                      console.error('Payment error:', error);
                    }}
                  />
                </View>
                
                <View style={{ marginTop: Spacing.md }}>
                  <PaymentButton
                    amount={99.99}
                    description="Shopping Purchase"
                    title="Pay $99.99 - Shopping"
                    onPaymentSuccess={() => {
                      setShowPaymentModal(false);
                      Alert.alert('Success!', 'Payment completed successfully');
                    }}
                    onPaymentError={(error) => {
                      console.error('Payment error:', error);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['5xl'],
    paddingBottom: Spacing.lg,
  },
  cardSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    justifyContent: 'space-between',
    ...Shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.neutral[0],
  },
  cardChip: {
    width: 40,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumber: {
    marginTop: Spacing.lg,
  },
  cardNumberText: {
    color: Colors.neutral[0],
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  cardLabel: {
    color: Colors.neutral[0],
    opacity: 0.8,
  },
  cardValue: {
    color: Colors.neutral[0],
    marginTop: Spacing.xs,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  balanceSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionLabel: {
    marginTop: Spacing.sm,
  },
  featureSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  featureCard: {
    backgroundColor: Colors.surface.primary,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  roundUpStats: {
    marginTop: Spacing.lg,
  },
  transactionsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['3xl'],
  },
  transactionsCard: {
    marginTop: Spacing.lg,
  },
  transactionsList: {
    gap: Spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.neutral[0],
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  walletSteps: {
    marginBottom: Spacing['3xl'],
  },
  walletStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  paymentOptions: {
    marginBottom: Spacing['2xl'],
  },
  paymentAmounts: {
    gap: Spacing.md,
  },
});