// Application constants
export const APP_NAME = "OpenLotteryConnect";

// Color scheme
export const COLORS = {
  primary: "#3498DB", // Trust blue
  secondary: "#2ECC71", // Success green
  background: "#F8F9FA", // Light grey
  textColor: "#2C3E50", // Dark blue-grey
  accent: "#E74C3C", // Action red
  warning: "#F1C40F", // Alert yellow
  dark: {
    primary: "#2980B9",
    secondary: "#27AE60",
    background: "#1A1D23",
    textColor: "#ECF0F1",
    accent: "#C0392B",
    warning: "#D9A81D",
    card: "#242832",
  }
};

// Bet types
export enum BetType {
  SPORTS = "Sports",
  CRYPTO = "Crypto",
  POLITICS = "Politics",
  ENTERTAINMENT = "Entertainment",
  OTHER = "Other"
}

// User roles
export enum UserRole {
  BETTOR = "Bettor",
  CREATOR = "Creator",
  EXPERT = "Expert",
  TRADER = "Trader"
}

// Event status
export enum EventStatus {
  UPCOMING = "Upcoming",
  ACTIVE = "Active",
  COMPLETED = "Completed",
  CANCELED = "Canceled"
}

// Bet status
export enum BetStatus {
  ACTIVE = "Active",
  WON = "Won",
  LOST = "Lost",
  REFUNDED = "Refunded"
}

// Platform fees
export const PLATFORM_FEES = {
  betFee: 0.02, // 2% fee on bets
  eventCreationFee: 0.01 // 1% fee for event creators
};

// Networks supported
export const SUPPORTED_NETWORKS = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    symbol: "ETH",
    icon: "https://ethereum.org/static/a183661dd70e0e5c70689a0ec95ef0ba/13c43/eth-diamond-purple.png"
  },
  {
    id: 56,
    name: "Binance Smart Chain",
    symbol: "BNB",
    icon: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
  },
  {
    id: 137,
    name: "Polygon",
    symbol: "MATIC",
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png"
  },
  {
    id: 43114,
    name: "Avalanche",
    symbol: "AVAX",
    icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png"
  }
];

// Default quick bet amounts
export const QUICK_BET_AMOUNTS = ["0.1", "0.5", "1", "2", "5"];

// Minimum amount to create an event
export const MIN_EVENT_CREATION_AMOUNT = 0.5;
