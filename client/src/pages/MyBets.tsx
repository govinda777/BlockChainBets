import React, { useEffect, useState } from "react";
import { useTitle } from "@/hooks/use-title";
import { useBets } from "@/hooks/useBets";
import { useWallet } from "@/hooks/useWallet";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BetStatus } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import WalletConnector from "@/components/wallet/WalletConnector";

const MyBets: React.FC = () => {
  useTitle("My Bets | OpenLotteryConnect");
  const { allBets, isLoading, fetchUserBets } = useBets();
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (isConnected) {
      fetchUserBets();
    }
  }, [isConnected, fetchUserBets]);

  // Filter bets based on active tab
  const filteredBets = allBets.filter((bet) => {
    if (activeTab === "all") return true;
    return bet.status.toLowerCase() === activeTab;
  });

  // Calculate bet stats
  const totalBets = allBets.length;
  const totalWon = allBets.filter((bet) => bet.status === BetStatus.WON).length;
  const totalLost = allBets.filter((bet) => bet.status === BetStatus.LOST).length;
  const totalActive = allBets.filter((bet) => bet.status === BetStatus.ACTIVE).length;
  
  // Calculate win rate percentage
  const winRate = totalBets > 0 ? ((totalWon / totalBets) * 100).toFixed(1) : "0.0";

  // Calculate profit/loss
  const totalInvested = allBets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalReturns = allBets
    .filter((bet) => bet.status === BetStatus.WON)
    .reduce((sum, bet) => sum + bet.amount * bet.odds, 0);
  const profitLoss = totalReturns - totalInvested;

  // Get status badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case BetStatus.ACTIVE:
        return "bg-blue-100 text-primary";
      case BetStatus.WON:
        return "bg-green-100 text-secondary";
      case BetStatus.LOST:
        return "bg-red-100 text-accent";
      case BetStatus.REFUNDED:
        return "bg-yellow-100 text-warning";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <i className="ri-wallet-3-line text-6xl text-gray-300 mb-4"></i>
        <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Connect your wallet to view your betting history and track your
          performance.
        </p>
        <div className="w-64">
          <WalletConnector />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">My Bets</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-gray-500">Win Rate</span>
            <span className="text-2xl font-semibold">{winRate}%</span>
            <span className="text-xs text-gray-500 mt-1">
              {totalWon} wins / {totalBets} bets
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-gray-500">Active Bets</span>
            <span className="text-2xl font-semibold">{totalActive}</span>
            <span className="text-xs text-gray-500 mt-1">
              {totalActive > 0
                ? `${totalActive} pending results`
                : "No active bets"}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-gray-500">Total Invested</span>
            <span className="text-2xl font-semibold">
              {totalInvested.toFixed(2)} ETH
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Across {totalBets} bets
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-sm text-gray-500">Profit/Loss</span>
            <span
              className={`text-2xl font-semibold ${
                profitLoss >= 0 ? "text-secondary" : "text-accent"
              }`}
            >
              {profitLoss >= 0 ? "+" : ""}
              {profitLoss.toFixed(2)} ETH
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Total returns: {totalReturns.toFixed(2)} ETH
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Bets Table */}
      <Card>
        <CardContent className="p-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Bets</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="won">Won</TabsTrigger>
              <TabsTrigger value="lost">Lost</TabsTrigger>
              <TabsTrigger value="refunded">Refunded</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                // Loading state
                <Skeleton className="h-64 w-full" />
              ) : filteredBets.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Selection</TableHead>
                        <TableHead>Odds</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Potential Win</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBets.map((bet) => (
                        <TableRow key={bet.id}>
                          <TableCell className="font-medium">
                            {bet.eventTitle}
                          </TableCell>
                          <TableCell>
                            {new Date(bet.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{bet.selection}</TableCell>
                          <TableCell>{bet.odds.toFixed(2)}</TableCell>
                          <TableCell>{bet.amount.toFixed(2)} ETH</TableCell>
                          <TableCell>
                            {(bet.amount * bet.odds).toFixed(2)} ETH
                          </TableCell>
                          <TableCell>
                            <span
                              className={`${getStatusBadgeClass(
                                bet.status
                              )} text-xs px-2 py-1 rounded-full`}
                            >
                              {bet.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-file-list-3-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">No bets found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBets;
