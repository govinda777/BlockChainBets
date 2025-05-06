import React, { createContext, useState, useEffect, useCallback } from "react";
import { ConnectedWallet, WalletInfo, getWalletBalance, getChainId } from "@/lib/web3";

interface WalletContextType {
  wallet: ConnectedWallet | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (walletInfo: WalletInfo) => Promise<void>;
  disconnect: () => void;
}

export const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
});

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check local storage on mount for previously connected wallet
  useEffect(() => {
    const storedWallet = localStorage.getItem("connectedWallet");
    
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet) as ConnectedWallet;
        setWallet(parsedWallet);
      } catch (error) {
        console.error("Failed to parse stored wallet:", error);
        localStorage.removeItem("connectedWallet");
      }
    }
  }, []);

  const connect = useCallback(async (walletInfo: WalletInfo) => {
    try {
      setIsConnecting(true);
      const address = await walletInfo.connect();
      const balance = await getWalletBalance(address);
      const chainId = await getChainId();
      
      const connectedWallet: ConnectedWallet = {
        id: walletInfo.id,
        name: walletInfo.name,
        icon: walletInfo.icon,
        address,
        chainId,
        balance,
        isConnected: true,
      };
      
      setWallet(connectedWallet);
      localStorage.setItem("connectedWallet", JSON.stringify(connectedWallet));
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    localStorage.removeItem("connectedWallet");
  }, []);

  return (
    <WalletContext.Provider 
      value={{
        wallet,
        isConnected: !!wallet?.isConnected,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
