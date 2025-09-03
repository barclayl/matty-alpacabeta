import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, IconButton, Button, Input, Badge, ProgressBar } from '@/components/ui';
import { Screen } from '@/components/layout';
import { Colors, Spacing, BorderRadius } from '@/constants/design';
import { formatCurrency } from '@/utils';

const { width } = Dimensions.get('window');

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  date: string;
  color: string;
}

export default function InsightsScreen() {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Vacation Fund',
      target: 5000,
      current: 2340,
      date: 'Dec 2025',
      color: Colors.primary[500],
    },
    {
      id: '2',
      name: 'Emergency Fund',
      target: 10000,
      current: 7520,
      date: 'Jun 2025',
      color: Colors.success[500],
    },
    {
      id: '3',
      name: 'New Car',
      target: 25000,
      current: 8950,
      date: 'Mar 2026',
      color: Colors.orange[500],
    },
  ]);

  const marketInsights = [
    {
      title: 'Tech Sector Rally',
      content: 'Your AAPL and NVDA holdings are benefiting from renewed optimism in the tech sector. Consider taking some profits.',
      type: 'positive',
    },
    {
      title: 'Market Volatility Alert',
      content: 'Expected increased volatility this week due to earnings announcements. Your diversified portfolio is well-positioned.',
      type: 'neutral',
    },
    {
      title: 'Dividend Opportunity',
      content: 'Several dividend-paying stocks in your watchlist are approaching attractive entry points.',
      type: 'opportunity',
    },
  ];

  const handleAddGoal = () => {
    if (!goalName || !goalAmount || !goalDate) return;
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      target: parseFloat(goalAmount),
      current: 0,
      date: goalDate,
      color: Colors.warning[500],
    };
    
    setGoals([...goals, newGoal]);
    setGoalName('');
    setGoalAmount('');
    setGoalDate('');
    setShowGoalModal(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return 'trending-up';
      case 'neutral': return 'information-circle';
      case 'opportunity': return 'bulb';
      default: return 'analytics';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return Colors.success[500];
      case 'neutral': return Colors.primary[500];
      case 'opportunity': return Colors.orange[500];
      default: return Colors.neutral[500];
    }
  };

  return (
    <Screen variant="scroll" padding="none" backgroundColor={Colors.neutral[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2" color="900">Insights</Typography>
        <IconButton 
          icon="settings" 
          onPress={() => console.log('Settings')}
          variant="ghost"
        />
      </View>

      {/* AI Insights */}
      <View style={styles.aiSection}>
        <Card style={styles.aiCard} padding="xl">
          <View style={styles.aiHeader}>
            <View style={styles.aiIcon}>
              <Ionicons name="sparkles" size={24} color={Colors.warning[600]} />
            </View>
            <View style={styles.aiInfo}>
              <Typography variant="h4" color="900">AI-Powered Insights</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                Personalized market analysis
              </Typography>
            </View>
          </View>
          
          <View style={styles.insightsList}>
            {marketInsights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <View style={[
                  styles.insightIndicator,
                  { backgroundColor: getInsightColor(insight.type) }
                ]}>
                  <Ionicons 
                    name={getInsightIcon(insight.type)} 
                    size={16} 
                    color={Colors.neutral[0]} 
                  />
                </View>
                <View style={styles.insightContent}>
                  <Typography variant="body" color="900" weight="semiBold">
                    {insight.title}
                  </Typography>
                  <Typography variant="caption" color="600" style={{ marginTop: Spacing.xs }}>
                    {insight.content}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* Goals Section */}
      <View style={styles.goalsSection}>
        <View style={styles.goalsHeader}>
          <Typography variant="h4" color="900">Financial Goals</Typography>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowGoalModal(true)}>
            <Ionicons name="add" size={18} color={Colors.success[600]} />
            <Typography variant="caption" color="success" weight="semiBold" style={{ marginLeft: Spacing.xs }}>
              Add Goal
            </Typography>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.goalsCard} padding="xl">
          <View style={styles.goalsList}>
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Typography variant="body" color="900" weight="semiBold">
                      {goal.name}
                    </Typography>
                    <Typography variant="caption" color="500">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </Typography>
                  </View>
                  <View style={styles.progressContainer}>
                    <ProgressBar 
                      progress={progress}
                      color={goal.color}
                      style={styles.progressBar}
                    />
                    <Typography variant="caption" color="600" weight="semiBold">
                      {progress.toFixed(1)}%
                    </Typography>
                  </View>
                  <Typography variant="caption" color="500" style={{ marginTop: Spacing.sm }}>
                    Target: {goal.date}
                  </Typography>
                </View>
              );
            })}
          </View>
        </Card>
      </View>

      {/* Performance Analytics */}
      <View style={styles.analyticsSection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Performance Analytics
        </Typography>
        <Card style={styles.analyticsCard} padding="xl">
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Typography variant="h2" color="success">12.4%</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                YTD Return
              </Typography>
            </View>
            <View style={styles.metricItem}>
              <Typography variant="h2" color="primary">{formatCurrency(147)}</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                This Month
              </Typography>
            </View>
            <View style={styles.metricItem}>
              <Typography variant="h2" color="900">89%</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                Win Rate
              </Typography>
            </View>
            <View style={styles.metricItem}>
              <Typography variant="h2" color="900">0.42</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                Sharpe Ratio
              </Typography>
            </View>
          </View>
        </Card>
      </View>

      {/* Round-up Summary */}
      <View style={styles.roundupSection}>
        <Card style={styles.roundupCard} padding="xl">
          <View style={styles.roundupHeader}>
            <Ionicons name="trending-up" size={24} color={Colors.success[600]} />
            <Typography variant="h4" color="900" style={{ marginLeft: Spacing.sm }}>
              Round-up Investing
            </Typography>
          </View>
          <Typography variant="h1" color="success" style={{ marginTop: Spacing.md }}>
            {formatCurrency(23.47)} invested this month
          </Typography>
          <Typography variant="caption" color="500" style={{ marginTop: Spacing.sm }}>
            From 47 transactions • Average $0.50 per round-up
          </Typography>
          <View style={styles.roundupBreakdown}>
            <Typography variant="body" color="700">🍔 Food & Drinks: {formatCurrency(8.30)}</Typography>
            <Typography variant="body" color="700">⛽ Gas & Transport: {formatCurrency(9.15)}</Typography>
            <Typography variant="body" color="700">🛒 Shopping: {formatCurrency(6.02)}</Typography>
          </View>
        </Card>
      </View>

      {/* Goal Creation Modal */}
      <Modal
        visible={showGoalModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGoalModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" color="900">Create New Goal</Typography>
              <IconButton 
                icon="close" 
                onPress={() => setShowGoalModal(false)}
                variant="ghost"
              />
            </View>
            
            <View style={styles.formContainer}>
              <Input
                label="Goal Name"
                value={goalName}
                onChangeText={setGoalName}
                placeholder="e.g., Emergency Fund"
                variant="filled"
              />
              
              <Input
                label="Target Amount"
                value={goalAmount}
                onChangeText={setGoalAmount}
                placeholder="0.00"
                keyboardType="numeric"
                variant="filled"
                leftIcon="logo-usd"
              />
              
              <Input
                label="Target Date"
                value={goalDate}
                onChangeText={setGoalDate}
                placeholder="e.g., Dec 2025"
                variant="filled"
                leftIcon="calendar"
              />
            </View>
            
            <Button 
              title="Create Goal"
              onPress={handleAddGoal}
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
  aiSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  aiCard: {
    backgroundColor: Colors.surface.primary,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.warning[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  aiInfo: {
    flex: 1,
  },
  insightsList: {
    gap: Spacing.lg,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIndicator: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  goalsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  goalsCard: {
    backgroundColor: Colors.surface.primary,
  },
  goalsList: {
    gap: Spacing.xl,
  },
  goalItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[500],
    paddingLeft: Spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    marginRight: Spacing.md,
  },
  analyticsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  analyticsCard: {
    backgroundColor: Colors.surface.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metricItem: {
    width: (width - 88) / 2,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
  },
  roundupSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['3xl'],
  },
  roundupCard: {
    backgroundColor: Colors.surface.primary,
  },
  roundupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roundupBreakdown: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
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
  formContainer: {
    marginBottom: Spacing['2xl'],
  },
});