import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, IconButton } from '@/components/ui';
import { Screen } from '@/components/layout';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/design';
import { formatCurrency, formatTime } from '@/utils';

const { width } = Dimensions.get('window');

interface TradingActivity {
  id: string;
  time: string;
  action: string;
  stock?: string;
  amount?: string;
  type: 'deposit' | 'buy' | 'sell' | 'return';
}

export default function HomeScreen() {
  const [balance, setBalance] = useState(1247.83);
  const [dayProfit, setDayProfit] = useState(47.21);
  const [todayActivity, setTodayActivity] = useState<TradingActivity[]>([
    {
      id: '1',
      time: '09:30 AM',
      action: 'Funds moved to trading account',
      amount: '$1,200.62',
      type: 'deposit',
    },
    {
      id: '2',
      time: '10:15 AM',
      action: 'Bought AAPL',
      stock: 'AAPL',
      amount: '$500.00',
      type: 'buy',
    },
    {
      id: '3',
      time: '01:45 PM',
      action: 'Sold AAPL for profit',
      stock: 'AAPL',
      amount: '$523.15',
      type: 'sell',
    },
    {
      id: '4',
      time: '04:01 PM',
      action: 'Trading profits returned to Matty Card',
      amount: '$47.21',
      type: 'return',
    },
  ]);

  const handleQuickTransfer = async () => {
    Alert.alert(
      'Quick Transfer',
      `Transfer $${dayProfit.toFixed(2)} profit to your external bank account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Transfer',
          onPress: () => {
            Alert.alert('Success', 'Transfer initiated! Funds will arrive within 1-2 business days.');
          },
        },
      ]
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'arrow-down';
      case 'buy':
        return 'trending-up';
      case 'sell':
        return 'trending-down';
      case 'return':
        return 'checkmark-circle';
      default:
        return 'radio-button-off';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return Colors.primary[500];
      case 'buy':
        return Colors.error[500];
      case 'sell':
        return Colors.success[500];
      case 'return':
        return Colors.success[500];
      default:
        return Colors.neutral[500];
    }
  };

  return (
    <Screen variant="scroll" padding="none" backgroundColor={Colors.neutral[50]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="caption" color="500">Good morning</Typography>
          <Typography variant="h2" color="900" style={{ marginTop: 2 }}>
            Welcome to Matty
          </Typography>
        </View>
        <IconButton 
          icon="notifications-outline" 
          onPress={() => console.log('Notifications')}
          size="md"
          variant="ghost"
        />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceSection}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.balanceContent}>
            <Typography variant="body" style={styles.balanceLabel}>
              Available Balance
            </Typography>
            <Typography variant="display" style={styles.balanceAmount}>
              {formatCurrency(balance)}
            </Typography>
            <View style={styles.profitContainer}>
              <View style={styles.profitBadge}>
                <Ionicons name="trending-up" size={14} color={Colors.success[600]} />
                <Typography variant="caption" style={styles.profitText}>
                  +{formatCurrency(dayProfit)} today
                </Typography>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.transferButton} onPress={handleQuickTransfer}>
            <Ionicons name="arrow-forward" size={20} color={Colors.primary[600]} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Quick Actions
        </Typography>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary[100] }]}>
              <Ionicons name="card-outline" size={22} color={Colors.primary[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              View Card
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.success[100] }]}>
              <Ionicons name="swap-horizontal" size={22} color={Colors.success[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              Transfer
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.orange[100] }]}>
              <Ionicons name="analytics-outline" size={22} color={Colors.orange[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              Insights
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.neutral[200] }]}>
              <Ionicons name="settings-outline" size={22} color={Colors.neutral[600]} />
            </View>
            <Typography variant="caption" color="700" weight="medium" style={styles.actionLabel}>
              Settings
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Trading Activity */}
      <View style={styles.activitySection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Today's Trading Activity
        </Typography>
        <Card style={styles.activityCard} padding="xl">
          <View style={styles.timeline}>
            {todayActivity.map((activity, index) => (
              <View key={activity.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: getActivityColor(activity.type) }]}>
                    <Ionicons 
                      name={getActivityIcon(activity.type)} 
                      size={12} 
                      color={Colors.neutral[0]} 
                    />
                  </View>
                  {index < todayActivity.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Typography variant="caption" color="500" weight="medium">
                      {activity.time}
                    </Typography>
                    {activity.amount && (
                      <Typography 
                        variant="caption" 
                        weight="semiBold"
                        color={activity.type === 'sell' || activity.type === 'return' ? 'success' : 'primary'}>
                        {activity.amount}
                      </Typography>
                    )}
                  </View>
                  <Typography variant="body" color="800" style={{ marginTop: 2 }}>
                    {activity.action}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Community Pulse */}
      <View style={styles.communitySection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Community Pulse
        </Typography>
        <Card style={styles.communityCard} padding="xl">
          <Typography variant="caption" color="500" style={{ marginBottom: Spacing.lg }}>
            Most traded stocks today
          </Typography>
          
          <View style={styles.stockList}>
            {[
              { symbol: 'AAPL', name: 'Apple Inc.', change: '+2.4%', trending: true },
              { symbol: 'TSLA', name: 'Tesla Inc.', change: '+5.7%', trending: true },
              { symbol: 'NVDA', name: 'NVIDIA Corp.', change: '+3.1%', trending: true },
              { symbol: 'MSFT', name: 'Microsoft Corp.', change: '+1.8%', trending: false },
              { symbol: 'AMZN', name: 'Amazon Inc.', change: '+2.9%', trending: false },
            ].map((stock, index) => (
              <View key={stock.symbol} style={styles.stockItem}>
                <View style={styles.stockLeft}>
                  <View style={styles.stockRank}>
                    <Typography variant="caption" color="500" weight="bold">
                      {index + 1}
                    </Typography>
                  </View>
                  <View style={styles.stockInfo}>
                    <View style={styles.stockHeader}>
                      <Typography variant="body" color="900" weight="semiBold">
                        {stock.symbol}
                      </Typography>
                      {stock.trending && (
                        <View style={styles.trendingBadge}>
                          <Ionicons name="flame" size={10} color={Colors.orange[600]} />
                        </View>
                      )}
                    </View>
                    <Typography variant="caption" color="500">
                      {stock.name}
                    </Typography>
                  </View>
                </View>
                <Typography variant="body" color="success" weight="semiBold">
                  {stock.change}
                </Typography>
              </View>
            ))}
          </View>
        </Card>
      </View>
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
  balanceSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  balanceCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.lg,
  },
  balanceContent: {
    flex: 1,
  },
  balanceLabel: {
    color: Colors.neutral[0],
    opacity: 0.9,
  },
  balanceAmount: {
    color: Colors.neutral[0],
    marginTop: Spacing.xs,
  },
  profitContainer: {
    marginTop: Spacing.md,
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  profitText: {
    color: Colors.neutral[0],
    marginLeft: Spacing.xs,
  },
  transferButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[0],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
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
  activitySection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  activityCard: {
    marginTop: Spacing.lg,
  },
  timeline: {
    paddingLeft: Spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
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
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communitySection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['3xl'],
  },
  communityCard: {
    marginTop: Spacing.lg,
  },
  stockList: {
    gap: Spacing.md,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stockRank: {
    width: 24,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stockInfo: {
    flex: 1,
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingBadge: {
    marginLeft: Spacing.xs,
    backgroundColor: Colors.orange[100],
    borderRadius: BorderRadius.sm,
    padding: 2,
  },
});