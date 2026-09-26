export interface UserSettings {
  profile: {
    fullName: string;
    email: string;
    designation: string;
    countryCode: string;
    phoneNumber: string;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  regional: {
    country: string;
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    numberFormat: string;
  };
  notifications: {
    lowStockAlerts: boolean;
    dailySummary: boolean;
    orderUpdates: boolean;
    stockMovementAlerts: boolean;
    emailNotifications: boolean;
    browserNotifications: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    fullName: "",
    email: "",
    designation: "",
    countryCode: "+91",
    phoneNumber: "",
  },
  security: {
    twoFactorEnabled: false,
  },
  regional: {
    country: "India",
    language: "English",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour",
    currency: "INR",
    numberFormat: "International",
  },
  notifications: {
    lowStockAlerts: true,
    dailySummary: true,
    orderUpdates: false,
    stockMovementAlerts: false,
    emailNotifications: true,
    browserNotifications: false,
  },
};

const SETTINGS_STORAGE_KEY = "stocksense_user_settings";

export const getSettings = async (): Promise<UserSettings> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as UserSettings;
    } catch (e) {
      console.error("Failed to parse settings", e);
    }
  }
  return DEFAULT_SETTINGS;
};

export const updateSettings = async (settings: UserSettings): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const changePassword = async (current: string, newPass: string): Promise<void> => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate fake validation
      if (current === "wrong") {
        reject(new Error("Current password is incorrect."));
      } else {
        console.log("Changing password to:", newPass);
        resolve(undefined);
      }
    }, 800);
  });
};

export const logoutAllDevices = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
};

let cachedExchangeRates: Record<string, number> | null = null;
let lastFetchTime = 0;

export const fetchExchangeRates = async (): Promise<Record<string, number>> => {
  const now = Date.now();
  if (cachedExchangeRates && now - lastFetchTime < 3600000) {
    return cachedExchangeRates;
  }
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/api/exchange-rates`);
    const data = await response.json();
    if (data.status === 'success' && data.rates) {
      cachedExchangeRates = data.rates;
      lastFetchTime = now;
      return cachedExchangeRates!;
    }
    throw new Error("Invalid format");
  } catch (error) {
    console.error("Failed to fetch exchange rates, using fallback:", error);
    if (cachedExchangeRates) return cachedExchangeRates;
    return { "INR": 1, "USD": 0.012, "EUR": 0.011, "GBP": 0.0094, "AED": 0.044, "SGD": 0.016, "CAD": 0.016, "AUD": 0.018, "JPY": 1.79, "BRL": 0.06, "ZAR": 0.23, "MXN": 0.20, "CHF": 0.011 };
  }
};
