import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import WalletConnector from "../wallet/WalletConnector";

const BalanceCard: React.FC = () => {
  const { wallet, isConnected } = useWallet();
  
  // Sample percentage increase, in a real application this would be calculated
  const percentageChange = "+3.2%";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-500 font-medium">Total Balance</h3>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-500">ETH</span>
            <i className="ri-arrow-down-s-line"></i>
          </div>
        </div>
        
        {isConnected ? (
          <>
            <div className="flex items-end gap-2 mb-6">
              <h2 className="text-3xl font-semibold">{wallet?.balance} ETH</h2>
              <span className="text-sm text-secondary flex items-center gap-1 mb-1">
                <i className="ri-arrow-up-line"></i>
                {percentageChange}
              </span>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" size="sm">
                Deposit
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                Withdraw
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center mb-6 text-gray-400">
              <i className="ri-wallet-3-line text-3xl mr-2"></i>
              <p className="text-sm">Connect your wallet to view your balance</p>
            </div>
            <WalletConnector />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
