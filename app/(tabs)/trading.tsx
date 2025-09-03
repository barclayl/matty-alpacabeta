import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, IconButton, Button, Input, Badge } from '@/components/ui';
import { Screen } from '@/components/layout';
import { PaymentButton } from '@/components/payments/PaymentButton';
import { useAlpacaAccount, useAlpacaPositions, useAlpacaOrders, useAlpacaTrading, useMarketData } from '@/hooks/useAlpaca';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/design';
import { formatCurrency, formatPercentage, formatTime } from '@/utils';

export default function TradingScreen() {
  const [transferAmount, setTransferAmount] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeSymbol, setTradeSymbol] = useState('');
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [tradeSide, setTradeSide] = useState<'buy' | 'sell'>('buy');
  
  // Mock account ID for demo - in production this would come from user auth
  const mockAccountId = 'demo-account-123';
  
  const { account, balance, loading: accountLoading, error: accountError } = useAlpacaAccount(mockAccountId);
  const { positions, loading: positionsLoading, refetch: refetchPositions } = useAlpacaPositions(mockAccountId);
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useAlpacaOrders(mockAccountId);
  const { marketStatus, watchlistData, loading: marketLoading } = useMarketData();
  const { executeTrade, initiateTransfer, loading: tradingLoading } = useAlpacaTrading(mockAccountId);

  const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.market_value || '0'), 0);
  const totalGainLoss = positions.reduce((sum, pos) => sum + parseFloat(pos.unrealized_pl || '0'), 0);
  const totalGainLossPercent = (totalGainLoss / (totalValue - totalGainLoss)) * 100;
  const accountBalance = balance ? parseFloat(balance.cash) : 0;

  const handleTransfer = () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid transfer amount');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount > accountBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Transfer Confirmation',
      `Transfer $${amount.toFixed(2)} to your external bank account?\n\nThis will be processed within 1-2 business days.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Transfer',
          onPress: async () => {
            try {
              await initiateTransfer({
                amount,
                direction: 'OUTGOING',
              });
              setTransferAmount('');
              setShowTransferModal(false);
              Alert.alert('Success', 'Transfer initiated successfully!');
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Transfer failed');
            }
          },
        },
      ]
    );
  };

  const handleTrade = async () => {
    if (!tradeSymbol || !tradeQuantity) {
      Alert.alert('Error', 'Please enter symbol and quantity');
      return;
    }

    const quantity = parseFloat(tradeQuantity);
    if (quantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    try {
      const result = await executeTrade({
        symbol: tradeSymbol.toUpperCase(),
        side: tradeSide,
        qty: quantity,
        type: 'market',
        time_in_force: 'day',
      });

      Alert.alert('Trade Executed', result.message);
      setTradeSymbol('');
      setTradeQuantity('');
      setShowTradeModal(false);
      
      // Refresh data
      refetchPositions();
      refetchOrders();
    } catch (error) {
      Alert.alert('Trade Error', error instanceof Error ? error.message : 'Trade failed');
    }
  };

  const todayTimeline = [
    { time: '09:30', event: 'Market opened', type: 'info' },
    { time: '09:45', event: `Auto-invested in ${positions[0]?.symbol || 'AAPL'}`, type: 'buy' },
    { time: '11:20', event: `${positions[1]?.symbol || 'TSLA'} position up ${formatPercentage(2.3)}`, type: 'gain' },
    { time: '13:15', event: `Sold ${positions[2]?.symbol || 'NVDA'} partial position`, type: 'sell' },
    { time: '15:30', event: `Day trading profit: ${formatCurrency(totalGainLoss, { showSign: true })}`, type: 'profit' },
    { time: '16:00', event: marketStatus?.is_open ? 'Market open' : 'Market closed', type: 'info' },
  ];

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'buy': return Colors.primary[500];
      case 'sell': return Colors.error[500];
      case 'gain': return Colors.success[500];
      case 'profit': return Colors.success[500];
      default: return Colors.neutral[500];
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'buy': return 'trending-up';
      case 'sell': return 'trending-down';
      case 'gain': return 'arrow-up';
      case 'profit': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  return (
    <Screen variant="scroll" padding="none" backgroundColor={Colors.neutral[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2" color="900">Trading</Typography>
        <View style={styles.headerActions}>
          <IconButton 
            icon="add" 
            onPress={() => setShowTradeModal(true)}
            variant="primary"
            size="sm"
          />
          <IconButton 
            icon="time" 
            onPress={() => console.log('History')}
            variant="ghost"
          />
        </View>
      </View>

      {/* Market Status */}
      {marketStatus && (
        <View style={styles.marketStatusSection}>
          <Card style={styles.marketStatusCard} padding="lg">
            <View style={styles.marketStatusContent}>
              <View style={[
                styles.marketStatusIndicator,
                { backgroundColor: marketStatus.is_open ? Colors.success[500] : Colors.error[500] }
              ]} />
              <Typography variant="body" color="700" weight="semiBold">
                Market is {marketStatus.is_open ? 'Open' : 'Closed'}
              </Typography>
              <Typography variant="caption" color="500" style={{ marginLeft: 'auto' }}>
                {marketStatus.is_open ? 'Closes' : 'Opens'}: {formatTime(new Date(marketStatus.is_open ? marketStatus.next_close : marketStatus.next_open))}
              </Typography>
            </View>
          </Card>
        </View>
      )}

      {/* Portfolio Summary */}
      <View style={styles.portfolioSection}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={styles.portfolioCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Typography variant="body" style={styles.portfolioLabel}>
            Portfolio Value
          </Typography>
          <Typography variant="display" style={styles.portfolioValue}>
            {formatCurrency(totalValue)}
          </Typography>
          <View style={styles.portfolioChange}>
            <View style={styles.changeBadge}>
              <Ionicons 
                name={totalGainLoss >= 0 ? 'trending-up' : 'trending-down'} 
                size={14} 
                color={Colors.success[600]} 
              />
              <Typography variant="caption" style={styles.portfolioChangeText}>
                {formatCurrency(Math.abs(totalGainLoss), { showSign: true })} ({formatPercentage(Math.abs(totalGainLossPercent))})
              </Typography>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Transfer */}
      <View style={styles.transferSection}>
        <Card style={styles.transferCard} padding="xl">
          <View style={styles.transferHeader}>
            <View>
              <Typography variant="h4" color="900">Quick Transfer</Typography>
              <Typography variant="caption" color={accountBalance > 0 ? 'success' : 'error'} weight="medium" style={{ marginTop: Spacing.xs }}>
                Available: {formatCurrency(accountBalance)}
              </Typography>
            </View>
            <TouchableOpacity 
              style={styles.transferButton}
              onPress={() => setShowTransferModal(true)}>
              <Ionicons name="swap-horizontal" size={20} color={Colors.primary[600]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentSection}>
            <Typography variant="body" color="700" style={{ marginBottom: Spacing.md }}>
              Test Google Pay with your trading profits:
            </Typography>
            <PaymentButton
              amount={totalGainLoss > 0 ? totalGainLoss : 25.00}
              description="Trading Profit Payment"
              title={`Pay ${formatCurrency(totalGainLoss > 0 ? totalGainLoss : 25.00)} with Google Pay`}
              onPaymentSuccess={() => {
                Alert.alert('Payment Success!', 'Your trading profits have been used for payment');
              }}
              onPaymentError={(error) => {
                console.error('Payment error:', error);
              }}
            />
          </View>
          
          {accountLoading && (
            <Typography variant="caption" color="500" style={{ textAlign: 'center', marginTop: Spacing.md }}>
              Loading account data...
            </Typography>
          )}
        </Card>
      </View>

      {/* Current Positions */}
      <View style={styles.positionsSection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Current Positions
        </Typography>
        {positionsLoading ? (
          <Card style={styles.positionsCard} padding="xl">
            <Typography variant="body" color="500" style={{ textAlign: 'center' }}>
              Loading positions...
            </Typography>
          </Card>
        ) : positions.length === 0 ? (
          <Card style={styles.positionsCard} padding="xl">
            <Typography variant="body" color="500" style={{ textAlign: 'center' }}>
              No positions found. Start trading to see your positions here.
            </Typography>
          </Card>
        ) : (
        <Card style={styles.positionsCard} padding="xl">
          <View style={styles.positionsList}>
            {positions.map((position) => (
              <View key={position.symbol} style={styles.positionItem}>
                <View style={styles.positionLeft}>
                  <View style={styles.symbolBadge}>
                    <Typography variant="caption" color="0" weight="bold">
                      {position.symbol}
                    </Typography>
                  </View>
                  <View style={styles.positionInfo}>
                    <Typography variant="body" color="900" weight="semiBold">
                      {parseFloat(position.qty)} shares
                    </Typography>
                    <Typography variant="caption" color="500">
                      Avg: {formatCurrency(parseFloat(position.avg_entry_price || '0'))}
                    </Typography>
                  </View>
                </View>
                <View style={styles.positionValues}>
                  <Typography variant="body" color="900" weight="semiBold">
                    {formatCurrency(parseFloat(position.market_value))}
                  </Typography>
                  <Badge 
                    variant={parseFloat(position.unrealized_pl) >= 0 ? 'success' : 'error'}
                    size="sm"
                    style={{ marginTop: Spacing.xs }}>
                    {formatCurrency(parseFloat(position.unrealized_pl), { showSign: true })}
                  </Badge>
                </View>
              </View>
            ))}
          </View>
        </Card>
        )}
      </View>

      {/* Today's Timeline */}
      <View style={styles.timelineSection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Today's Activity
        </Typography>
        <Card style={styles.timelineCard} padding="xl">
          <View style={styles.timeline}>
            {todayTimeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <Typography variant="overline" color="500">
                    {item.time}
                  </Typography>
                </View>
                <View style={styles.timelineIndicator}>
                  <View style={[
                    styles.timelineDot, 
                    { backgroundColor: getTimelineColor(item.type) }
                  ]}>
                    <Ionicons 
                      name={getTimelineIcon(item.type)} 
                      size={12} 
                      color={Colors.neutral[0]} 
                    />
                  </View>
                  {index < todayTimeline.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Typography variant="body" color="800">
                    {item.event}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Trade Modal */}
      <Modal
        visible={showTradeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTradeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" color="900">Place Trade</Typography>
              <IconButton 
                icon="close" 
                onPress={() => setShowTradeModal(false)}
                variant="ghost"
              />
            </View>
            
            <View style={styles.tradeForm}>
              <View style={styles.tradeSideSelector}>
                <TouchableOpacity
                  style={[
                    styles.tradeSideButton,
                    tradeSide === 'buy' && styles.tradeSideButtonActive,
                    { backgroundColor: tradeSide === 'buy' ? Colors.success[500] : Colors.neutral[200] }
                  ]}
                  onPress={() => setTradeSide('buy')}>
                  <Typography 
                    variant="body" 
                    weight="semiBold"
                    style={{ color: tradeSide === 'buy' ? Colors.neutral[0] : Colors.neutral[600] }}>
                    BUY
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tradeSideButton,
                    tradeSide === 'sell' && styles.tradeSideButtonActive,
                    { backgroundColor: tradeSide === 'sell' ? Colors.error[500] : Colors.neutral[200] }
                  ]}
                  onPress={() => setTradeSide('sell')}>
                  <Typography 
                    variant="body" 
                    weight="semiBold"
                    style={{ color: tradeSide === 'sell' ? Colors.neutral[0] : Colors.neutral[600] }}>
                    SELL
                  </Typography>
                </TouchableOpacity>
              </View>
              
              <Input
                label="Symbol"
                value={tradeSymbol}
                onChangeText={setTradeSymbol}
                placeholder="e.g., AAPL"
                autoCapitalize="characters"
                variant="filled"
              />
              
              <Input
                label="Quantity"
                value={tradeQuantity}
                onChangeText={setTradeQuantity}
                placeholder="Number of shares"
                keyboardType="numeric"
                variant="filled"
              />
              
              <View style={styles.tradeInfo}>
                <Typography variant="caption" color="500">
                  Market Order • Available: {formatCurrency(accountBalance)}
                </Typography>
              </View>
            </View>
            
            <Button 
              title={`${tradeSide.toUpperCase()} ${tradeQuantity || '0'} ${tradeSymbol || 'shares'}`}
              onPress={handleTrade}
              loading={tradingLoading}
              size="lg"
              fullWidth
              variant={tradeSide === 'buy' ? 'primary' : 'destructive'}
            />
          </View>
        </View>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        visible={showTransferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTransferModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" color="900">Transfer Funds</Typography>
              <IconButton 
                icon="close" 
                onPress={() => setShowTransferModal(false)}
                variant="ghost"
              />
            </View>
            
            <View style={styles.transferDetails}>
              <View style={styles.transferRow}>
                <Typography variant="body" color="700" weight="semiBold">
                  From: Matty Account
                </Typography>
                <Typography variant="caption" color="success" weight="medium">
                  Available: ${accountBalance.toFixed(2)}
                </Typography>
              </View>
              
              <View style={styles.transferRow}>
                <Typography variant="body" color="700" weight="semiBold">
                  To: External Bank Account
                </Typography>
                <Typography variant="caption" color="500">
                  ****1234 - Chase Bank
                </Typography>
              </View>
              
              <View style={styles.amountSection}>
                <Typography variant="body" color="700" weight="semiBold" style={{ marginBottom: Spacing.sm }}>
                  Amount
                </Typography>
                <Input
                  value={transferAmount}
                  onChangeText={(text) => setTransferAmount(text)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  size="lg"
                  variant="filled"
                  leftIcon="logo-usd"
                />
              </View>
            </View>
            
            <Button 
              title={`Transfer ${formatCurrency(parseFloat(transferAmount) || 0)}`}
              onPress={handleTransfer}
              size="lg"
              fullWidth
            />
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  marketStatusSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  marketStatusCard: {
    backgroundColor: Colors.surface.primary,
  },
  marketStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  portfolioSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  portfolioCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    alignItems: 'center',
    ...Shadows.lg,
  },
  portfolioLabel: {
    color: Colors.neutral[0],
    opacity: 0.9,
  },
  portfolioValue: {
    color: Colors.neutral[0],
    marginTop: Spacing.xs,
  },
  portfolioChange: {
    marginTop: Spacing.md,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  portfolioChangeText: {
    color: Colors.neutral[0],
    marginLeft: Spacing.xs,
  },
  transferSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  transferCard: {
    backgroundColor: Colors.surface.primary,
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  transferButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentSection: {
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  positionsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  positionsCard: {
    backgroundColor: Colors.surface.primary,
  },
  positionsList: {
    gap: Spacing.lg,
  },
  positionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  positionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbolBadge: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  positionInfo: {
    flex: 1,
  },
  positionValues: {
    alignItems: 'flex-end',
  },
  timelineSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['3xl'],
  },
  timelineCard: {
    backgroundColor: Colors.surface.primary,
  },
  timeline: {
    paddingLeft: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineLeft: {
    width: 50,
    paddingTop: 2,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.neutral[200],
    marginTop: Spacing.sm,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
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
  transferDetails: {
    marginBottom: Spacing['2xl'],
  },
  transferRow: {
    marginBottom: Spacing.lg,
  },
  amountSection: {
    marginTop: Spacing.lg,
  },
  tradeForm: {
    marginBottom: Spacing['2xl'],
  },
  tradeSideSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  tradeSideButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tradeSideButtonActive: {
    ...Shadows.sm,
  },
  tradeInfo: {
    backgroundColor: Colors.neutral[100],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
});