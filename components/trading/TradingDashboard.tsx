import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, Badge } from '@/components/ui';
import { useAlpacaAccount, useAlpacaPositions, useMarketData } from '@/hooks/useAlpaca';
import { Colors, Spacing, BorderRadius } from '@/constants/design';
import { formatCurrency, formatPercentage } from '@/utils';

interface TradingDashboardProps {
  accountId: string;
  onTradePress?: () => void;
}

export function TradingDashboard({ accountId, onTradePress }: TradingDashboardProps) {
  const { account, balance, loading: accountLoading } = useAlpacaAccount(accountId);
  const { positions, loading: positionsLoading } = useAlpacaPositions(accountId);
  const { marketStatus, watchlistData } = useMarketData();

  const totalPortfolioValue = positions.reduce((sum, pos) => sum + parseFloat(pos.market_value || '0'), 0);
  const totalUnrealizedPL = positions.reduce((sum, pos) => sum + parseFloat(pos.unrealized_pl || '0'), 0);

  if (accountLoading || positionsLoading) {
    return (
      <Card style={styles.container} padding="xl">
        <Typography variant="body" color="500" style={{ textAlign: 'center' }}>
          Loading trading data...
        </Typography>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {/* Portfolio Overview */}
      <Card style={styles.portfolioCard} padding="xl">
        <View style={styles.portfolioHeader}>
          <Typography variant="h4" color="900">Portfolio Overview</Typography>
          <TouchableOpacity onPress={onTradePress} style={styles.tradeButton}>
            <Ionicons name="add" size={16} color={Colors.primary[600]} />
            <Typography variant="caption" color="primary" weight="semiBold" style={{ marginLeft: 4 }}>
              Trade
            </Typography>
          </TouchableOpacity>
        </View>
        
        <View style={styles.portfolioStats}>
          <View style={styles.statItem}>
            <Typography variant="h2" color="900">
              {formatCurrency(totalPortfolioValue)}
            </Typography>
            <Typography variant="caption" color="500">Total Value</Typography>
          </View>
          
          <View style={styles.statItem}>
            <Typography variant="h3" color={totalUnrealizedPL >= 0 ? 'success' : 'error'}>
              {formatCurrency(totalUnrealizedPL, { showSign: true })}
            </Typography>
            <Typography variant="caption" color="500">Unrealized P&L</Typography>
          </View>
          
          <View style={styles.statItem}>
            <Typography variant="h3" color="900">
              {formatCurrency(balance?.cash || 0)}
            </Typography>
            <Typography variant="caption" color="500">Cash</Typography>
          </View>
        </View>
      </Card>

      {/* Market Status */}
      {marketStatus && (
        <Card style={styles.marketCard} padding="lg">
          <View style={styles.marketStatus}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: marketStatus.is_open ? Colors.success[500] : Colors.error[500] }
            ]} />
            <Typography variant="body" color="700" weight="semiBold">
              Market {marketStatus.is_open ? 'Open' : 'Closed'}
            </Typography>
          </View>
        </Card>
      )}

      {/* Top Positions */}
      {positions.length > 0 && (
        <Card style={styles.positionsCard} padding="xl">
          <Typography variant="h4" color="900" style={{ marginBottom: Spacing.lg }}>
            Top Positions
          </Typography>
          
          <View style={styles.positionsList}>
            {positions.slice(0, 3).map((position) => (
              <View key={position.symbol} style={styles.positionItem}>
                <View style={styles.positionLeft}>
                  <View style={styles.symbolBadge}>
                    <Typography variant="caption" color="0" weight="bold">
                      {position.symbol}
                    </Typography>
                  </View>
                  <Typography variant="body" color="900" weight="semiBold">
                    {parseFloat(position.qty)} shares
                  </Typography>
                </View>
                
                <View style={styles.positionRight}>
                  <Typography variant="body" color="900" weight="semiBold">
                    {formatCurrency(parseFloat(position.market_value))}
                  </Typography>
                  <Badge 
                    variant={parseFloat(position.unrealized_pl) >= 0 ? 'success' : 'error'}
                    size="sm">
                    {formatPercentage(parseFloat(position.unrealized_plpc || '0'))}
                  </Badge>
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Watchlist */}
      {watchlistData && (
        <Card style={styles.watchlistCard} padding="xl">
          <Typography variant="h4" color="900" style={{ marginBottom: Spacing.lg }}>
            Market Watchlist
          </Typography>
          
          <View style={styles.watchlistGrid}>
            {Object.entries(watchlistData).slice(0, 4).map(([symbol, data]) => (
              <View key={symbol} style={styles.watchlistItem}>
                <Typography variant="body" color="900" weight="bold">
                  {symbol}
                </Typography>
                <Typography variant="caption" color="900">
                  {formatCurrency(data.current_price)}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={data.change_percent >= 0 ? 'success' : 'error'}
                  weight="semiBold">
                  {formatPercentage(data.change_percent, { showSign: true })}
                </Typography>
              </View>
            ))}
          </View>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  portfolioCard: {
    backgroundColor: Colors.surface.primary,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  tradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  marketCard: {
    backgroundColor: Colors.surface.primary,
  },
  marketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  positionsCard: {
    backgroundColor: Colors.surface.primary,
  },
  positionsList: {
    gap: Spacing.md,
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
  },
  symbolBadge: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  positionRight: {
    alignItems: 'flex-end',
  },
  watchlistCard: {
    backgroundColor: Colors.surface.primary,
  },
  watchlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  watchlistItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.neutral[100],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
});