// Alpaca API service for frontend integration
export interface AlpacaAccount {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  cash: string;
  buying_power: string;
  created_at: string;
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
}

export interface MarketQuote {
  symbol: string;
  bid_price: number;
  ask_price: number;
  timestamp: string;
}

const API_BASE_URL = 'http://192.168.1.100:3001/api'; // Replace 192.168.1.100 with your machine's IP address

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
    account_id: string;
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

  static async getOrders(accountId: string, status?: string): Promise<Order[]> {
    let url = `${API_BASE_URL}/account/${accountId}/orders`;
    if (status) {
      url += `?status=${status}`;
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
    type?: string;
  }): Promise<{ success: boolean; order: Order }> {
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

  static async getWatchlistData(): Promise<Record<string, MarketQuote & { change_percent: number }>> {
    const response = await fetch(`${API_BASE_URL}/market/watchlist`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch watchlist data');
    }

    return response.json();
  }

  static async getMarketStatus(): Promise<{
    is_open: boolean;
    next_open: string;
    next_close: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/market/status`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch market status');
    }

    return response.json();
  }

  static async simulateAlgoTrading(accountId: string, amount: number): Promise<{
    success: boolean;
    activity: any[];
    total_profit: string;
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
  }): Promise<{ success: boolean; transfer: any }> {
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
}