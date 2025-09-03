// Utility functions for formatting financial data
export const formatCurrency = (
  amount: number,
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  } = {}
): string => {
  const {
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSign = false,
  } = options;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formatted = formatter.format(Math.abs(amount));
  
  if (showSign && amount !== 0) {
    return amount > 0 ? `+${formatted}` : `-${formatted}`;
  }
  
  return formatted;
};

export const formatPercentage = (
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  } = {}
): string => {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    showSign = true,
  } = options;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formatted = formatter.format(Math.abs(value) / 100);
  
  if (showSign && value !== 0) {
    return value > 0 ? `+${formatted}` : `-${formatted}`;
  }
  
  return formatted;
};

export const formatNumber = (
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'standard' | 'compact';
  } = {}
): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard',
  } = options;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(value);
};

export const formatDate = (
  date: Date | string,
  options: {
    style?: 'short' | 'medium' | 'long' | 'relative';
  } = {}
): string => {
  const { style = 'medium' } = options;
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (style === 'relative') {
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return dateObj.toLocaleDateString();
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  }[style];

  return dateObj.toLocaleDateString('en-US', formatOptions);
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};