import React from 'react';
import { StyleSheet } from 'react-native';
import { Screen } from '@/components/layout';
import MattyWalletSimulation from '@/components/MattyWalletSimulation';

export default function WalletDemoScreen() {
  return (
    <Screen variant="default" padding="none" style={styles.container}>
      <MattyWalletSimulation />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});