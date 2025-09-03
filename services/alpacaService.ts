// Alpaca API service for frontend integration
export interface AlpacaAccount {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  cash: string;
  buying_power: string;
  created_at: string;
  account_type: string;
  trading_configurations: {
    trade_confirm_email: string;
    max_margin_multiplier: string;
  };
}

export interface Position {
  asset_id: string;
  symbol: string;
  qty: string;
  side: string;
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  current_price: string;
  avg_entry_price: string;
}

export interface Order {
  id: string;
  symbol: string;
  qty: string;
  side: string;
  order_type: string;
  status: string;
  filled_qty: string;
  filled_avg_price: string;
  submitted_at: string;
  filled_at?: string;
  time_in_force: string;
}

export interface MarketQuote {
  symbol: string;
  bid_price: number;
  ask_price: number;
  bid_size: number;
  ask_size: number;
  timestamp: string;
}

export interface PortfolioHistory {
  timestamp: string[];
  equity: number[];
  profit_loss: number[];
  profit_loss_pct: number[];
  base_value: number;
  timeframe: string;
}

export interface AccountActivity {
  id: string;
  activity_type: string;
  date: string;
  net_amount: string;
  symbol?: string;
  qty?: string;
  price?: string;
  side?: string;
  description: string;
}

export interface MarketStatus {
  is_open: boolean;
  next_open: string;
  next_close: string;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

export class AlpacaService {
  static async createAccount(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<{ success: boolean; alpaca_account: AlpacaAccount; virtual_card: any }> {
    const response = await fetch(`${API_BASE_URL}/create-alpaca-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create account');
    }

    return response.json();
  }

  static async getAccount(accountId: string): Promise<AlpacaAccount> {
    const response = await fetch(`${API_BASE_URL}/account/${accountId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch account');
    }

    return response.json();
  }

  static async getBalance(accountId: string): Promise<{
    cash: number;
    buying_power: number;
    regt_buying_power: number;
    daytrading_buying_power: number;
    non_marginable_buying_power: number;
    account_id: string;
    last_updated: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/account/${accountId}/balance`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    return response.json();
  }

  static async getPositions(accountId: string): Promise<Position[]> {
    const response = await fetch(`${API_BASE_URL}/account/${accountId}/positions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }

    return response.json();
  }

  static async getOrders(accountId: string, status?: string, limit?: number): Promise<Order[]> {
    let url = `${API_BASE_URL}/account/${accountId}/orders`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  }

  static async executeTrade(tradeData: {
    accountId: string;
    symbol: string;
    side: 'buy' | 'sell';
    qty: number;
    type?: 'market' | 'limit' | 'stop' | 'stop_limit';
    time_in_force?: 'day' | 'gtc' | 'ioc' | 'fok';
    limit_price?: number;
    stop_price?: number;
  }): Promise<{ success: boolean; order: Order; message: string }> {
    const response = await fetch(`${API_BASE_URL}/execute-trade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tradeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to execute trade');
    }

    return response.json();
  }

  static async getMarketQuote(symbol: string): Promise<MarketQuote> {
    const response = await fetch(`${API_BASE_URL}/market/quotes/${symbol}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch market quote');
    }

    return response.json();
  }

  static async getWatchlistData(): Promise<Record<string, MarketQuote & { 
    current_price: number;
    change: number;
    change_percent: number;
  }>> {
    const response = await fetch(`${API_BASE_URL}/market/watchlist`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch watchlist data');
    }

    return response.json();
  }

  static async getMarketStatus(): Promise<MarketStatus> {
    const response = await fetch(`${API_BASE_URL}/market/status`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch market status');
    }

    return response.json();
  }

  static async getPortfolioHistory(
    accountId: string,
    period: '1D' | '1W' | '1M' | '3M' | '1A' = '1D',
    timeframe: '1Min' | '5Min' | '15Min' | '1Hour' | '1Day' = '1Min'
  ): Promise<PortfolioHistory> {
    const response = await fetch(
      `${API_BASE_URL}/account/${accountId}/portfolio-history?period=${period}&timeframe=${timeframe}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch portfolio history');
    }

    return response.json();
  }

  static async getAccountActivities(
    accountId: string,
    activityType?: string,
    date?: string,
    pageSize: number = 100
  ): Promise<AccountActivity[]> {
    let url = `${API_BASE_URL}/account/${accountId}/activities?page_size=${pageSize}`;
    
    if (activityType) url += `&activity_type=${activityType}`;
    if (date) url += `&date=${date}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch account activities');
    }

    return response.json();
  }

  static async simulateAlgoTrading(accountId: string, amount: number): Promise<{
    success: boolean;
    activity: any[];
    total_profit: string;
    message: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/simulate-algo-trading`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId, amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to simulate trading');
    }

    return response.json();
  }

  static async initiateTransfer(transferData: {
    accountId: string;
    amount: number;
    direction: 'INCOMING' | 'OUTGOING';
    bank_id?: string;
  }): Promise<{ success: boolean; transfer: any; message: string }> {
    const response = await fetch(`${API_BASE_URL}/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transferData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initiate transfer');
    }

    return response.json();
  }

  static async getMarketCalendar(): Promise<Array<{
    date: string;
    open: string;
    close: string;
  }>> {
    const response = await fetch(`${API_BASE_URL}/market/calendar`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch market calendar');
    }

    return response.json();
  }

  static async cancelOrder(accountId: string, orderId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/account/${accountId}/orders/${orderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel order');
    }

    return response.json();
  }

  static async getAssetInfo(symbol: string): Promise<{
    id: string;
    symbol: string;
    name: string;
    exchange: string;
    asset_class: string;
    status: string;
    tradable: boolean;
  }> {
    const response = await fetch(`${API_BASE_URL}/assets/${symbol}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch asset info');
    }

    return response.json();
  }
}