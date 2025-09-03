import { useState, useEffect, useCallback } from 'react';
import { AlpacaService, AlpacaAccount, Position, Order, MarketStatus } from '@/services/alpacaService';

export function useAlpacaAccount(accountId?: string) {
  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [accountData, balanceData] = await Promise.all([
        AlpacaService.getAccount(accountId),
        AlpacaService.getBalance(accountId),
      ]);
      
      setAccount(accountData);
      setBalance(balanceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch account');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    account,
    balance,
    loading,
    error,
    refetch: fetchAccount,
  };
}

export function useAlpacaPositions(accountId?: string) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await AlpacaService.getPositions(accountId);
      setPositions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions,
  };
}

export function useAlpacaOrders(accountId?: string, status?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await AlpacaService.getOrders(accountId, status, 50);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [accountId, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}

export function useMarketData() {
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [watchlistData, setWatchlistData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statusData, watchlistData] = await Promise.all([
        AlpacaService.getMarketStatus(),
        AlpacaService.getWatchlistData(),
      ]);
      
      setMarketStatus(statusData);
      setWatchlistData(watchlistData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
    
    // Refresh market data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  return {
    marketStatus,
    watchlistData,
    loading,
    error,
    refetch: fetchMarketData,
  };
}

export function useAlpacaTrading(accountId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTrade = useCallback(async (tradeData: {
    symbol: string;
    side: 'buy' | 'sell';
    qty: number;
    type?: 'market' | 'limit' | 'stop' | 'stop_limit';
    time_in_force?: 'day' | 'gtc' | 'ioc' | 'fok';
    limit_price?: number;
    stop_price?: number;
  }) => {
    if (!accountId) {
      throw new Error('Account ID is required');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await AlpacaService.executeTrade({
        accountId,
        ...tradeData,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute trade';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const initiateTransfer = useCallback(async (transferData: {
    amount: number;
    direction: 'INCOMING' | 'OUTGOING';
    bank_id?: string;
  }) => {
    if (!accountId) {
      throw new Error('Account ID is required');
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await AlpacaService.initiateTransfer({
        accountId,
        ...transferData,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate transfer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  return {
    executeTrade,
    initiateTransfer,
    loading,
    error,
  };
}