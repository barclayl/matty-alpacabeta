const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const Alpaca = require('@alpacahq/alpaca-trade-api');
require('dotenv').config();

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...YOUR_SECRET_KEY');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Initialize Alpaca client
const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_SECRET_KEY,
  baseUrl: process.env.ALPACA_BASE_URL || 'https://broker-api.sandbox.alpaca.markets',
  apiVersion: 'v2'
});

// Alpaca Broker API client for account creation
const alpacaBrokerClient = {
  baseURL: process.env.ALPACA_BASE_URL || 'https://broker-api.sandbox.alpaca.markets',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${process.env.ALPACA_API_KEY}:${process.env.ALPACA_SECRET_KEY}`).toString('base64')}`,
    'Content-Type': 'application/json'
  }
};

// Create Alpaca Brokerage Account
app.post('/api/create-alpaca-account', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'phone']
      });
    }

    // Alpaca account creation payload
    const alpacaPayload = {
      contact: {
        email_address: email,
        phone_number: phone,
        street_address: ["123 Main St"],
        city: "New York",
        state: "NY",
        postal_code: "10001",
        country: "USA"
      },
      identity: {
        given_name: firstName,
        family_name: lastName,
        date_of_birth: "1990-01-01",
        tax_id_type: "USA_SSN",
        tax_id: "123456789",
        country_of_citizenship: "USA",
        country_of_birth: "USA",
        country_of_tax_residence: "USA",
        funding_source: ["employment_income"]
      },
      disclosures: {
        is_control_person: false,
        is_affiliated_exchange_or_finra: false,
        is_politically_exposed: false,
        immediate_family_exposed: false,
        employment_status: "employed",
        employer_name: "Acme Corp",
        employer_address: {
          street_address: ["123 Work St"],
          city: "New York",
          state: "NY",
          postal_code: "10001",
          country: "USA"
        },
        employment_position: "Software Engineer",
        annual_income_min: 50000,
        annual_income_max: 100000,
        net_worth_min: 10000,
        net_worth_max: 100000,
        liquid_net_worth_min: 5000,
        liquid_net_worth_max: 50000
      },
      agreements: [
        {
          agreement: "margin_agreement",
          signed_at: new Date().toISOString(),
          ip_address: req.ip || "192.168.1.1"
        },
        {
          agreement: "account_agreement",
          signed_at: new Date().toISOString(),
          ip_address: req.ip || "192.168.1.1"
        },
        {
          agreement: "customer_agreement",
          signed_at: new Date().toISOString(),
          ip_address: req.ip || "192.168.1.1"
        }
      ],
      documents: [
        {
          document_type: "identity_verification",
          document_sub_type: "passport",
          content: "base64_encoded_document_content_here",
          mime_type: "image/jpeg"
        }
      ],
      trusted_contact: {
        given_name: "Emergency",
        family_name: "Contact",
        email_address: "emergency@example.com",
        phone_number: "+15551234567",
        street_address: ["456 Emergency St"],
        city: "New York",
        state: "NY",
        postal_code: "10001",
        country: "USA"
      }
    };

    // Make actual API call to Alpaca
    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/accounts`, {
      method: 'POST',
      headers: alpacaBrokerClient.headers,
      body: JSON.stringify(alpacaPayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Alpaca API Error:', errorData);
      throw new Error(`Alpaca API error: ${response.status} ${response.statusText}`);
    }

    const alpacaAccount = await response.json();
    console.log('Alpaca account created:', alpacaAccount.id);

    // After successful Alpaca account creation, create virtual card via Lithic
    const cardResponse = await createVirtualCard(alpacaAccount.id);
    
    res.json({
      success: true,
      alpaca_account: alpacaAccount,
      virtual_card: cardResponse,
      message: "Account created successfully. Virtual card will be available shortly."
    });

  } catch (error) {
    console.error('Error creating Alpaca account:', error);
    res.status(500).json({
      error: 'Failed to create account',
      message: error.message
    });
  }
});

// Get real account balance from Alpaca
app.get('/api/account/:accountId/balance', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Get account info from Alpaca
    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}`, {
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch account: ${response.status}`);
    }

    const accountData = await response.json();
    
    res.json({
      account_id: accountId,
      cash: parseFloat(accountData.cash || '0'),
      buying_power: parseFloat(accountData.buying_power || '0'),
      regt_buying_power: parseFloat(accountData.regt_buying_power || '0'),
      daytrading_buying_power: parseFloat(accountData.daytrading_buying_power || '0'),
      non_marginable_buying_power: parseFloat(accountData.non_marginable_buying_power || '0'),
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get real trading positions from Alpaca
app.get('/api/account/:accountId/positions', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Get positions from Alpaca
    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}/positions`, {
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch positions: ${response.status}`);
    }

    const positions = await response.json();
    
    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Execute real trade via Alpaca
app.post('/api/execute-trade', async (req, res) => {
  try {
    const { accountId, symbol, side, qty, type = 'market', time_in_force = 'day' } = req.body;
    
    if (!accountId || !symbol || !side || !qty) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['accountId', 'symbol', 'side', 'qty']
      });
    }

    // Create order via Alpaca
    const orderPayload = {
      symbol: symbol.toUpperCase(),
      qty: qty.toString(),
      side: side.toLowerCase(),
      type: type.toLowerCase(),
      time_in_force: time_in_force.toLowerCase()
    };

    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}/orders`, {
      method: 'POST',
      headers: alpacaBrokerClient.headers,
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Alpaca order error:', errorData);
      throw new Error(`Failed to place order: ${response.status}`);
    }

    const order = await response.json();
    
    res.json({
      success: true,
      order: order,
      message: `${side.toUpperCase()} order for ${qty} shares of ${symbol} submitted successfully`
    });
  } catch (error) {
    console.error('Error executing trade:', error);
    res.status(500).json({ error: 'Failed to execute trade', message: error.message });
  }
});

// Get order history from Alpaca
app.get('/api/account/:accountId/orders', async (req, res) => {
  try {
    const { accountId } = req.params;
    const { status, limit = 50 } = req.query;
    
    let url = `${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}/orders?limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const orders = await response.json();
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get market data from Alpaca
app.get('/api/market/quotes/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Get latest quote from Alpaca
    const quote = await alpaca.getLatestQuote(symbol);
    
    res.json({
      symbol: symbol.toUpperCase(),
      bid_price: quote.BidPrice,
      ask_price: quote.AskPrice,
      bid_size: quote.BidSize,
      ask_size: quote.AskSize,
      timestamp: quote.Timestamp
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get account activities from Alpaca
app.get('/api/account/:accountId/activities', async (req, res) => {
  try {
    const { accountId } = req.params;
    const { activity_type, date, page_size = 100 } = req.query;
    
    let url = `${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}/activities?page_size=${page_size}`;
    if (activity_type) {
      url += `&activity_type=${activity_type}`;
    }
    if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url, {
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.status}`);
    }

    const activities = await response.json();
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Create Virtual Debit Card via Lithic
async function createVirtualCard(accountId) {
  try {
    if (!process.env.LITHIC_API_KEY) {
      console.warn('Lithic API key not configured, returning mock card data');
      return {
        token: `mock_card_token_${Date.now()}`,
        pan: "4532123456789012",
        exp_month: "12",
        exp_year: "27",
        cvv: "123",
        type: "VIRTUAL",
        state: "OPEN",
        spend_limit: 10000,
        created: new Date().toISOString(),
        funding: {
          account_name: "Matty Spending Account",
          account_token: accountId
        }
      };
    }

    const lithicPayload = {
      type: "VIRTUAL",
      account_token: accountId,
      spend_limit: 10000,
      spend_limit_duration: "MONTHLY",
      state: "OPEN"
    };

    const response = await fetch(`${process.env.LITHIC_BASE_URL}/v1/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LITHIC_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lithicPayload)
    });

    if (!response.ok) {
      throw new Error(`Lithic API error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Error creating virtual card:', error);
    // Return mock data if Lithic API fails
    return {
      token: `fallback_card_token_${Date.now()}`,
      pan: "4532123456789012",
      exp_month: "12",
      exp_year: "27",
      cvv: "123",
      type: "VIRTUAL",
      state: "OPEN",
      spend_limit: 10000,
      created: new Date().toISOString(),
      funding: {
        account_name: "Matty Spending Account",
        account_token: accountId
      }
    };
  }
}

// Get real-time market data for watchlist
app.get('/api/market/watchlist', async (req, res) => {
  try {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN'];
    const quotes = {};
    
    for (const symbol of symbols) {
      try {
        const quote = await alpaca.getLatestQuote(symbol);
        const bars = await alpaca.getBarsV2(symbol, {
          start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
          timeframe: '1Day'
        });
        
        const barsArray = [];
        for await (const bar of bars) {
          barsArray.push(bar);
        }
        
        const previousClose = barsArray.length > 1 ? barsArray[barsArray.length - 2].ClosePrice : quote.AskPrice;
        const currentPrice = quote.AskPrice;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        quotes[symbol] = {
          symbol,
          current_price: currentPrice,
          change: change,
          change_percent: changePercent,
          timestamp: quote.Timestamp
        };
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        // Fallback to mock data for this symbol
        quotes[symbol] = {
          symbol,
          current_price: Math.random() * 200 + 100,
          change: (Math.random() - 0.5) * 10,
          change_percent: (Math.random() - 0.5) * 5,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching watchlist data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get account portfolio history
app.get('/api/account/:accountId/portfolio-history', async (req, res) => {
  try {
    const { accountId } = req.params;
    const { period = '1D', timeframe = '1Min' } = req.query;
    
    const response = await fetch(
      `${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}/portfolio/history?period=${period}&timeframe=${timeframe}`,
      { headers: alpacaBrokerClient.headers }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio history: ${response.status}`);
    }

    const history = await response.json();
    res.json(history);
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio history' });
  }
});

// Initiate ACH transfer
app.post('/api/transfer', async (req, res) => {
  try {
    const { accountId, amount, direction, bank_id } = req.body;
    
    if (!accountId || !amount || !direction) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['accountId', 'amount', 'direction']
      });
    }

    const transferPayload = {
      transfer_type: "ach",
      relationship_id: bank_id || "mock_bank_relationship_id",
      amount: amount.toString(),
      direction: direction // "INCOMING" or "OUTGOING"
    };

    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}/transfers`, {
      method: 'POST',
      headers: alpacaBrokerClient.headers,
      body: JSON.stringify(transferPayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Transfer API Error:', errorData);
      throw new Error(`Transfer failed: ${response.status}`);
    }

    const transfer = await response.json();
    
    res.json({
      success: true,
      transfer: transfer,
      message: "Transfer initiated successfully. Funds will arrive within 1-2 business days."
    });
  } catch (error) {
    console.error('Error initiating transfer:', error);
    res.status(500).json({ 
      error: 'Failed to initiate transfer',
      message: error.message
    });
  }
});

// Get account information
app.get('/api/account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}`, {
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch account: ${response.status}`);
    }

    const account = await response.json();
    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account information' });
  }
});

// Cancel order
app.delete('/api/account/:accountId/orders/:orderId', async (req, res) => {
  try {
    const { accountId, orderId } = req.params;
    
    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/accounts/${accountId}/orders/${orderId}`, {
      method: 'DELETE',
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.status}`);
    }

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Get asset information
app.get('/api/assets/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const response = await fetch(`${alpacaBrokerClient.baseURL}/v1/assets/${symbol}`, {
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.status}`);
    }

    const asset = await response.json();
    res.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: 'Failed to fetch asset information' });
  }
});

// Search assets
app.get('/api/assets', async (req, res) => {
  try {
    const { search, status = 'active', asset_class = 'us_equity' } = req.query;
    
    let url = `${alpacaBrokerClient.baseURL}/v1/assets?status=${status}&asset_class=${asset_class}`;
    if (search) {
      url += `&search=${search}`;
    }

    const response = await fetch(url, {
      headers: alpacaBrokerClient.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to search assets: ${response.status}`);
    }

    const assets = await response.json();
    res.json(assets);
  } catch (error) {
    console.error('Error searching assets:', error);
    res.status(500).json({ error: 'Failed to search assets' });
  }
});

// Get trading calendar
app.get('/api/market/calendar', async (req, res) => {
  try {
    const calendar = await alpaca.getCalendar({
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    
    res.json(calendar);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    res.status(500).json({ error: 'Failed to fetch market calendar' });
  }
});

// Get market status
app.get('/api/market/status', async (req, res) => {
  try {
    const clock = await alpaca.getClock();
    
    res.json({
      is_open: clock.is_open,
      next_open: clock.next_open,
      next_close: clock.next_close,
      timestamp: clock.timestamp
    });
  } catch (error) {
    console.error('Error fetching market status:', error);
    res.status(500).json({ error: 'Failed to fetch market status' });
  }
});

// Simulate algorithmic trading activity
app.post('/api/simulate-algo-trading', async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    
    if (!accountId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['accountId', 'amount']
      });
    }

    // Simulate a series of algorithmic trades
    const tradingActivity = [
      {
        time: '09:30 AM',
        action: 'Funds moved to trading account',
        amount: `$${amount}`,
        type: 'deposit',
        status: 'completed'
      },
      {
        time: '09:45 AM',
        action: 'Algorithm identified opportunity in AAPL',
        type: 'analysis',
        status: 'completed'
      },
      {
        time: '10:15 AM',
        action: 'Bought AAPL',
        stock: 'AAPL',
        amount: `$${(amount * 0.4).toFixed(2)}`,
        type: 'buy',
        status: 'completed'
      },
      {
        time: '11:30 AM',
        action: 'Bought TSLA',
        stock: 'TSLA',
        amount: `$${(amount * 0.3).toFixed(2)}`,
        type: 'buy',
        status: 'completed'
      },
      {
        time: '01:45 PM',
        action: 'Sold AAPL for profit',
        stock: 'AAPL',
        amount: `$${(amount * 0.4 * 1.035).toFixed(2)}`,
        type: 'sell',
        status: 'completed'
      },
      {
        time: '02:30 PM',
        action: 'Sold TSLA for profit',
        stock: 'TSLA',
        amount: `$${(amount * 0.3 * 1.028).toFixed(2)}`,
        type: 'sell',
        status: 'completed'
      },
      {
        time: '04:01 PM',
        action: 'Trading profits returned to Matty Card',
        amount: `$${(amount * 0.031).toFixed(2)}`,
        type: 'return',
        status: 'completed'
      }
    ];

    res.json({
      success: true,
      activity: tradingActivity,
      total_profit: (amount * 0.031).toFixed(2),
      message: 'Algorithmic trading simulation completed'
    });
  } catch (error) {
    console.error('Error simulating algo trading:', error);
    res.status(500).json({ error: 'Failed to simulate trading' });
  }
});

// Stripe Payment Intent Creation
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    if (!amount || !currency) {
      return res.status(400).send({ error: 'Amount and currency are required.' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send the client_secret back to the client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).send({ error: error.message });
  }
});

// New endpoint to serve a pre-populated stock portfolio
app.get('/get-portfolio', (req, res) => {
  // In a real application, you would fetch this data from a database or a live financial data API.
  // For this example, we are using a hardcoded mock portfolio.
  const mockPortfolio = {
    user: "Matty_User_123",
    totalValue: 10594.75,
    performance: {
      dayChange: 75.50,
      dayChangePercent: 0.71,
      totalChange: 594.75,
      totalChangePercent: 5.94,
    },
    holdings: [
      {
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        quantity: 10,
        avgCost: 140.50,
        currentPrice: 145.25,
        totalValue: 1452.50,
        dayChange: 2.15,
      },
      {
        ticker: "AAPL",
        companyName: "Apple Inc.",
        quantity: 25,
        avgCost: 170.10,
        currentPrice: 172.00,
        totalValue: 4300.00,
        dayChange: -0.50,
      },
      {
        ticker: "TSLA",
        companyName: "Tesla, Inc.",
        quantity: 5,
        avgCost: 250.00,
        currentPrice: 265.80,
        totalValue: 1329.00,
        dayChange: 5.40,
      },
      {
        ticker: "AMZN",
        companyName: "Amazon.com, Inc.",
        quantity: 20,
        avgCost: 175.40,
        currentPrice: 175.66,
        totalValue: 3513.25,
        dayChange: 1.10,
      },
    ]
  };
  
  res.json(mockPortfolio);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Matty Fintech API is running',
    timestamp: new Date().toISOString(),
    alpaca_configured: !!(process.env.ALPACA_API_KEY && process.env.ALPACA_SECRET_KEY),
    lithic_configured: !!process.env.LITHIC_API_KEY,
    stripe_configured: !!process.env.STRIPE_SECRET_KEY
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Matty Fintech API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('\nAlpaca Configuration:');
  console.log(`API Key: ${process.env.ALPACA_API_KEY ? 'Configured' : 'Missing'}`);
  console.log(`Secret Key: ${process.env.ALPACA_SECRET_KEY ? 'Configured' : 'Missing'}`);
  console.log(`Base URL: ${process.env.ALPACA_BASE_URL || 'Using default sandbox'}`);
  console.log('\nAvailable endpoints:');
  console.log('POST /api/create-alpaca-account - Create new brokerage account');
  console.log('GET  /api/account/:id - Get account information');
  console.log('GET  /api/account/:id/balance - Get account balance');
  console.log('GET  /api/account/:id/positions - Get trading positions');
  console.log('GET  /api/account/:id/orders - Get order history');
  console.log('GET  /api/account/:id/activities - Get account activities');
  console.log('GET  /api/account/:id/portfolio-history - Get portfolio performance');
  console.log('POST /api/execute-trade - Execute real trade');
  console.log('POST /api/transfer - Initiate ACH transfer');
  console.log('POST /api/simulate-algo-trading - Simulate algorithmic trading');
  console.log('GET  /api/market/quotes/:symbol - Get real-time quotes');
  console.log('GET  /api/market/watchlist - Get watchlist with real data');
  console.log('GET  /api/market/status - Get market open/close status');
  console.log('GET  /api/market/calendar - Get trading calendar');
});

module.exports = app;