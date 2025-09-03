import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, IconButton, Button, Input, Switch, Avatar, Divider } from '@/components/ui';
import { Screen } from '@/components/layout';
import { Colors, Spacing, BorderRadius } from '@/constants/design';
import { formatCurrency } from '@/utils';

export default function ProfileScreen() {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const userInfo = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    accountId: 'MTY-789123',
    memberSince: 'March 2024',
  };

  const handleCreateAccount = async () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.100:3001/api/create-alpaca-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          'Account Created!',
          'Your Alpaca brokerage account has been successfully created. A virtual debit card will be issued shortly.',
          [
            {
              text: 'Continue',
              onPress: () => {
                setIsOnboarded(true);
                setShowOnboardingModal(false);
              },
            },
          ]
        );
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const menuItems = [
    {
      title: 'Account Settings',
      icon: 'person-outline',
      onPress: () => console.log('Account Settings'),
    },
    {
      title: 'Security & Privacy',
      icon: 'shield-checkmark-outline',
      onPress: () => console.log('Security'),
    },
    {
      title: 'Trading Preferences',
      icon: 'trending-up-outline',
      onPress: () => console.log('Trading Preferences'),
    },
    {
      title: 'Linked Accounts',
      icon: 'link-outline',
      onPress: () => console.log('Linked Accounts'),
    },
    {
      title: 'Tax Documents',
      icon: 'document-text-outline',
      onPress: () => console.log('Tax Documents'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => console.log('Help & Support'),
    },
  ];

  return (
    <Screen variant="scroll" padding="none" backgroundColor={Colors.neutral[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2" color="900">Profile</Typography>
        <IconButton 
          icon="create-outline" 
          onPress={() => console.log('Edit profile')}
          variant="ghost"
        />
      </View>

      {!isOnboarded ? (
        <View style={styles.onboardingSection}>
          <Card style={styles.onboardingCard} padding="3xl">
            <View style={styles.onboardingContent}>
              <View style={styles.onboardingIcon}>
                <Ionicons name="person-add" size={48} color={Colors.success[600]} />
              </View>
              <Typography variant="h3" color="900" style={{ marginTop: Spacing.lg }}>
                Complete Your Profile
              </Typography>
              <Typography variant="body" color="500" align="center" style={{ marginTop: Spacing.sm, marginBottom: Spacing['2xl'] }}>
                Create your Alpaca brokerage account to start investing
              </Typography>
              <Button 
                title="Get Started"
                onPress={() => setShowOnboardingModal(true)}
                size="lg"
                fullWidth
              />
            </View>
          </Card>
        </View>
      ) : (
        <View style={styles.profileSection}>
          <Card style={styles.profileCard} padding="2xl">
            <View style={styles.profileContent}>
              <Avatar 
                name={userInfo.name}
                size="xl"
                backgroundColor={Colors.primary[500]}
              />
              <View style={styles.profileInfo}>
                <Typography variant="h3" color="900" align="center">
                  {userInfo.name}
                </Typography>
                <Typography variant="body" color="500" align="center" style={{ marginTop: Spacing.xs }}>
                  {userInfo.email}
                </Typography>
                <Typography variant="caption" color="400" align="center" style={{ marginTop: Spacing.xs }}>
                  Member since {userInfo.memberSince}
                </Typography>
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Account Summary */}
      <View style={styles.summarySection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Account Summary
        </Typography>
        <Card style={styles.summaryCard} padding="xl">
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Typography variant="h3" color="900">{formatCurrency(1247.83)}</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                Total Balance
              </Typography>
            </View>
            <View style={styles.summaryItem}>
              <Typography variant="h3" color="success">+{formatCurrency(147.21)}</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                This Month
              </Typography>
            </View>
            <View style={styles.summaryItem}>
              <Typography variant="h3" color="900">3</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                Active Positions
              </Typography>
            </View>
            <View style={styles.summaryItem}>
              <Typography variant="h3" color="primary">{formatCurrency(23.47)}</Typography>
              <Typography variant="caption" color="500" style={{ marginTop: Spacing.xs }}>
                Round-ups
              </Typography>
            </View>
          </View>
        </Card>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <Typography variant="h4" color="900" style={styles.sectionTitle}>
          Settings
        </Typography>
        <Card style={styles.settingsCard} padding="xl">
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={20} color={Colors.neutral[600]} />
              <Typography variant="body" color="700" style={{ marginLeft: Spacing.md }}>
                Push Notifications
              </Typography>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
          
          <Divider margin="md" />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={20} color={Colors.neutral[600]} />
              <Typography variant="body" color="700" style={{ marginLeft: Spacing.md }}>
                Biometric Authentication
              </Typography>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
            />
          </View>
        </Card>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Card style={styles.menuCard} padding="none">
          {menuItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={item.onPress}>
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.neutral[600]} />
                  <Typography variant="body" color="700" style={{ marginLeft: Spacing.md }}>
                    {item.title}
                  </Typography>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.neutral[400]} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <Divider margin="none" />}
            </View>
          ))}
        </Card>
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <Card style={styles.logoutCard} padding="lg">
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error[500]} />
            <Typography variant="body" color="error" weight="semiBold" style={{ marginLeft: Spacing.sm }}>
              Sign Out
            </Typography>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Onboarding Modal */}
      <Modal
        visible={showOnboardingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOnboardingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" color="900">Create Your Account</Typography>
              <IconButton 
                icon="close" 
                onPress={() => setShowOnboardingModal(false)}
                variant="ghost"
              />
            </View>
            
            <View style={styles.formContainer}>
              <Input
                label="First Name *"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                variant="filled"
              />
              
              <Input
                label="Last Name *"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                variant="filled"
              />
              
              <Input
                label="Email *"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                variant="filled"
                leftIcon="mail"
              />
              
              <Input
                label="Phone Number *"
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
                variant="filled"
                leftIcon="call"
              />
              
              <View style={styles.disclaimerSection}>
                <Typography variant="caption" color="500" style={{ lineHeight: 20 }}>
                  By continuing, you agree to create an Alpaca brokerage account and 
                  authorize Matty to manage your investments according to your preferences.
                </Typography>
              </View>
            </View>
            
            <Button 
              title="Create Account"
              onPress={handleCreateAccount}
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
  onboardingSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  onboardingCard: {
    backgroundColor: Colors.surface.primary,
  },
  onboardingContent: {
    alignItems: 'center',
  },
  onboardingIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  profileCard: {
    backgroundColor: Colors.surface.primary,
  },
  profileContent: {
    alignItems: 'center',
  },
  profileInfo: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  summarySection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: Colors.surface.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  summaryItem: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
  },
  settingsSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  settingsCard: {
    backgroundColor: Colors.surface.primary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  menuCard: {
    backgroundColor: Colors.surface.primary,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing['3xl'],
  },
  logoutCard: {
    backgroundColor: Colors.surface.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    maxHeight: '90%',
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
  disclaimerSection: {
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
});