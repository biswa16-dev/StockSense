interface ExchangeRateResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_next_update_unix: number;
}

let cachedRates: Record<string, number> | null = null;
let nextUpdateTimestamp: number = 0;

export const getExchangeRates = async (): Promise<Record<string, number>> => {
  const now = Math.floor(Date.now() / 1000);
  
  // If we have cached rates and they haven't expired, return them
  if (cachedRates && now < nextUpdateTimestamp) {
    return cachedRates;
  }
  
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/INR');
    const data = (await response.json()) as ExchangeRateResponse;
    if (data && data.result === 'success') {
      cachedRates = data.rates;
      // Add a buffer or use the provided next update timestamp
      nextUpdateTimestamp = data.time_next_update_unix || (now + 3600); // 1 hour fallback
      return cachedRates;
    }
    throw new Error('Failed to fetch valid rates');
  } catch (error) {
    console.error('Exchange Rate API Error:', error);
    // If API fails, return cached rates if available
    if (cachedRates) {
      console.warn('Using stale cached rates due to API failure');
      return cachedRates;
    }
    throw error;
  }
};
