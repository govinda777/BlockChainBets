import { ethers } from "ethers";

// Interfaces for supported wallet types
export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  isInstalled: () => boolean;
  connect: () => Promise<string>;
}

export interface ConnectedWallet {
  id: string;
  name: string;
  icon: string;
  address: string;
  chainId: number;
  balance: string;
  isConnected: boolean;
}

// MetaMask wallet implementation
export const MetaMaskWallet: WalletInfo = {
  id: "metamask",
  name: "MetaMask",
  icon: "https://cdn.iconscout.com/icon/free/png-256/free-metamask-2728406-2261817.png",
  isInstalled: () => {
    return typeof window !== "undefined" && !!window.ethereum;
  },
  connect: async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0];
    } catch (error) {
      console.error("MetaMask connection error:", error);
      throw error;
    }
  },
};

// WalletConnect implementation
export const WalletConnectWallet: WalletInfo = {
  id: "walletconnect",
  name: "WalletConnect",
  icon: "https://repository-images.githubusercontent.com/231273290/a4f95000-39e9-11eb-83c2-d1dda50f3539",
  isInstalled: () => true, // WalletConnect doesn't require installation
  connect: async () => {
    // In a real implementation, this would use the WalletConnect SDK
    // For this MVP, we'll just simulate a connection
    alert("WalletConnect integration would be implemented here");
    return "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"; // Simulated address
  },
};

// Phantom wallet implementation
export const PhantomWallet: WalletInfo = {
  id: "phantom",
  name: "Phantom",
  icon: "https://phantom.app/apple-touch-icon.png",
  isInstalled: () => {
    return typeof window !== "undefined" && !!window.solana;
  },
  connect: async () => {
    if (!window.solana) {
      throw new Error("Phantom wallet is not installed");
    }

    try {
      // In a real implementation, this would use the Solana Web3.js SDK
      // For this MVP, we'll just simulate a connection
      alert("Phantom wallet integration would be implemented here");
      return "5xMLBLVKj1sLnbkjJmaCiec9xsYfLYnPvbT7QSusPZdK"; // Simulated address
    } catch (error) {
      console.error("Phantom connection error:", error);
      throw error;
    }
  },
};

// Exodus wallet implementation
export const ExodusWallet: WalletInfo = {
  id: "exodus",
  name: "Exodus",
  icon: "https://play-lh.googleusercontent.com/RdM0LZ1GyV3VFR6u8g2evEBHZvvSPYTJrY6OPdHRKIzYzBz_d8xBznT_NNjdJXL9XdI",
  isInstalled: () => true, // No direct check for Exodus browser extension
  connect: async () => {
    // In a real implementation, this would use the appropriate SDK
    // For this MVP, we'll just simulate a connection
    alert("Exodus wallet integration would be implemented here");
    return "0x89B312A7F5B1dd96B7C9bcB3c729c1a4447B0132"; // Simulated address
  },
};

// Function to get all supported wallets
export const getSupportedWallets = (): WalletInfo[] => {
  return [
    MetaMaskWallet,
    WalletConnectWallet,
    PhantomWallet,
    ExodusWallet,
  ];
};

// Function to format wallet addresses for display
export const formatWalletAddress = (address: string): string => {
  if (!address) return "";
  
  // For Ethereum-style addresses
  if (address.startsWith("0x")) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  // For Solana-style addresses
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

// Function to get wallet balance
export const getWalletBalance = async (address: string): Promise<string> => {
  // In a real implementation, this would query the blockchain
  // For this MVP, we'll return a simulated balance
  return "2.89";
};

// Function to get chain ID from wallet
export const getChainId = async (): Promise<number> => {
  // In a real implementation, this would query the connected provider
  // For this MVP, we'll return Ethereum mainnet by default
  return 1;
};

// Function to check if an address is valid
export const isValidAddress = (address: string): boolean => {
  try {
    if (address.startsWith("0x")) {
      // Ethereum address validation
      return ethers.isAddress(address);
    } else {
      // Basic Solana address validation (simplified for MVP)
      return address.length >= 32 && address.length <= 44;
    }
  } catch (error) {
    return false;
  }
};

// Add these type definitions to make TypeScript happy with window.ethereum and window.solana
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
