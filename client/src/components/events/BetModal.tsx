import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBets } from "@/hooks/useBets";
import { useWallet } from "@/hooks/useWallet";
import { PLATFORM_FEES, QUICK_BET_AMOUNTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import WalletConnector from "../wallet/WalletConnector";
import { EventOutcome } from "@/contexts/EventsContext";

const BetModal: React.FC = () => {
  const { betModalOpen, currentEvent, selectedOutcome, setSelectedOutcome, closeBetModal, placeBet } = useBets();
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState<string>("0.1");
  const [potentialWin, setPotentialWin] = useState<string>("0.00");
  const [platformFee, setPlatformFee] = useState<string>("0.00");

  useEffect(() => {
    if (currentEvent && selectedOutcome) {
      const amount = parseFloat(betAmount) || 0;
      const potential = (amount * selectedOutcome.odds).toFixed(2);
      const fee = (amount * PLATFORM_FEES.betFee).toFixed(2);
      
      setPotentialWin(potential);
      setPlatformFee(fee);
    }
  }, [betAmount, selectedOutcome, currentEvent]);

  const handleSelectOutcome = (outcome: EventOutcome) => {
    setSelectedOutcome(outcome);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handleConfirmBet = async () => {
    try {
      // Validate bet amount
      const amount = parseFloat(betAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid bet amount.",
          variant: "destructive",
        });
        return;
      }

      if (!selectedOutcome) {
        toast({
          title: "No Selection",
          description: "Please select an outcome to bet on.",
          variant: "destructive",
        });
        return;
      }

      await placeBet(amount);
      toast({
        title: "Bet Placed Successfully",
        description: `Your bet of ${betAmount} ETH has been placed.`,
      });
      closeBetModal();
    } catch (error) {
      toast({
        title: "Failed to Place Bet",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  if (!currentEvent) {
    return null;
  }

  return (
    <Dialog open={betModalOpen} onOpenChange={closeBetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place Your Bet</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <h4 className="font-medium mb-2">{currentEvent.title}</h4>
          <p className="text-sm text-gray-500 mb-4">
            {currentEvent.category} • {currentEvent.subcategory}
          </p>

          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <h5 className="font-medium mb-2">Your Prediction</h5>
            <div className="flex gap-2 mb-2">
              {currentEvent.outcomes.map((outcome) => (
                <Button
                  key={outcome.id}
                  variant={selectedOutcome?.id === outcome.id ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleSelectOutcome(outcome)}
                >
                  {outcome.name}
                </Button>
              ))}
            </div>
            {selectedOutcome && (
              <p className="text-xs text-primary">
                Current Odds: <span className="font-semibold">{selectedOutcome.odds.toFixed(2)}</span>
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Bet Amount</label>
            <div className="relative">
              <Input
                type="text"
                className="pr-16"
                placeholder="0.00"
                value={betAmount}
                onChange={handleBetAmountChange}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <img
                  src="https://ethereum.org/static/a183661dd70e0e5c70689a0ec95ef0ba/13c43/eth-diamond-purple.png"
                  alt="ETH"
                  className="w-5 h-5"
                />
                <span className="font-medium">ETH</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 gap-2">
              {QUICK_BET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => setBetAmount(amount)}
                >
                  {amount} ETH
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Potential Win</span>
              <span className="font-medium">{potentialWin} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Platform Fee (2%)</span>
              <span className="font-medium">{platformFee} ETH</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          {isConnected ? (
            <Button className="w-full" onClick={handleConfirmBet}>
              Confirm Bet
            </Button>
          ) : (
            <div className="w-full">
              <p className="text-sm text-center text-gray-500 mb-2">
                Please connect your wallet to place a bet
              </p>
              <WalletConnector />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BetModal;
