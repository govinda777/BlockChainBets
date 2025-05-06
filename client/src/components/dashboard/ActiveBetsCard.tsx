import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBets } from "@/hooks/useBets";
import { useWallet } from "@/hooks/useWallet";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import WalletConnector from "@/components/wallet/WalletConnector";

interface ActiveBet {
  id: string;
  eventTitle: string;
  category: string;
  subcategory: string;
  amount: number;
  odds: number;
  isActive: boolean;
}

const ActiveBetsCard: React.FC = () => {
  const { activeBets, isLoading } = useBets();
  const { isConnected } = useWallet();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-500 font-medium">Active Bets</h3>
          <Link href="/my-bets">
            <Button variant="link" className="p-0 h-auto text-primary text-sm">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          // Loading state
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isConnected && activeBets.length > 0 ? (
          // Active bets list
          <div className="flex flex-col gap-3">
            {activeBets.map((bet) => (
              <div
                key={bet.id}
                className={`flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  bet.isActive ? "active-bet" : ""
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{bet.eventTitle}</p>
                  <p className="text-xs text-gray-500">
                    {bet.category} • {bet.subcategory}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-secondary font-medium">
                    {bet.amount.toFixed(1)} ETH
                  </p>
                  <div className="odds-badge bg-blue-100 text-primary">
                    {bet.odds.toFixed(2)}x
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isConnected ? (
          // No active bets
          <div className="text-center py-6">
            <i className="ri-coin-line text-3xl text-gray-300 mb-2"></i>
            <p className="text-sm text-gray-500">No active bets</p>
            <Link href="/events">
              <Button variant="link" className="mt-2">
                Find events to bet on
              </Button>
            </Link>
          </div>
        ) : (
          // Not connected
          <div className="text-center py-6">
            <i className="ri-wallet-3-line text-3xl text-gray-300 mb-2"></i>
            <p className="text-sm text-gray-500 mb-4">
              Connect your wallet to see your active bets
            </p>
            <WalletConnector />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveBetsCard;
