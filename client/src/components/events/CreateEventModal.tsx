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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/hooks/useEvents";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import {
  BetType,
  PLATFORM_FEES,
  MIN_EVENT_CREATION_AMOUNT,
} from "@/lib/constants";
import WalletConnector from "../wallet/WalletConnector";

interface Outcome {
  id: string;
  name: string;
  odds: string;
}

const CreateEventModal: React.FC = () => {
  const { createEventModalOpen, closeCreateEventModal, createEvent } = useEvents();
  const { isConnected } = useWallet();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(BetType.SPORTS);
  const [subcategory, setSubcategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [description, setDescription] = useState("");
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { id: "1", name: "", odds: "" },
    { id: "2", name: "", odds: "" },
  ]);
  const [liquidityAmount, setLiquidityAmount] = useState<string>("0.5");
  const [platformFee, setPlatformFee] = useState<string>("0.00");

  useEffect(() => {
    const amount = parseFloat(liquidityAmount) || 0;
    const fee = (amount * PLATFORM_FEES.eventCreationFee).toFixed(2);
    setPlatformFee(fee);
  }, [liquidityAmount]);

  const handleOutcomeChange = (id: string, field: "name" | "odds", value: string) => {
    setOutcomes((prevOutcomes) =>
      prevOutcomes.map((outcome) =>
        outcome.id === id ? { ...outcome, [field]: value } : outcome
      )
    );
  };

  const addOutcome = () => {
    setOutcomes((prevOutcomes) => [
      ...prevOutcomes,
      { id: String(Date.now()), name: "", odds: "" },
    ]);
  };

  const handleLiquidityAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setLiquidityAmount(value);
    }
  };

  const validateForm = (): boolean => {
    // Check title
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter an event title.",
        variant: "destructive",
      });
      return false;
    }

    // Check dates
    if (!startDate || !startTime) {
      toast({
        title: "Missing Date/Time",
        description: "Please set the start date and time for the event.",
        variant: "destructive",
      });
      return false;
    }

    // Check if start date is in the future
    const eventDateTime = new Date(`${startDate}T${startTime}`);
    if (eventDateTime <= new Date()) {
      toast({
        title: "Invalid Date/Time",
        description: "Event must start in the future.",
        variant: "destructive",
      });
      return false;
    }

    // Check outcomes
    const validOutcomes = outcomes.filter(
      (outcome) => outcome.name.trim() && /^\d*\.?\d*$/.test(outcome.odds)
    );
    
    if (validOutcomes.length < 2) {
      toast({
        title: "Invalid Outcomes",
        description: "Please provide at least two outcomes with valid odds.",
        variant: "destructive",
      });
      return false;
    }

    // Check liquidity amount
    const amount = parseFloat(liquidityAmount);
    if (isNaN(amount) || amount < MIN_EVENT_CREATION_AMOUNT) {
      toast({
        title: "Invalid Liquidity Amount",
        description: `Minimum amount required is ${MIN_EVENT_CREATION_AMOUNT} ETH.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) return;

    try {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      
      // Create event with valid outcomes only
      const validOutcomes = outcomes
        .filter((outcome) => outcome.name.trim() && outcome.odds.trim())
        .map((outcome) => ({
          id: outcome.id,
          name: outcome.name,
          odds: parseFloat(outcome.odds),
        }));

      await createEvent({
        title,
        category,
        subcategory,
        description,
        startDate: startDateTime.toISOString(),
        liquidityPool: parseFloat(liquidityAmount),
        outcomes: validOutcomes,
      });

      toast({
        title: "Event Created",
        description: "Your betting event has been created successfully.",
      });
      
      closeCreateEventModal();
    } catch (error) {
      toast({
        title: "Failed to Create Event",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={createEventModalOpen} onOpenChange={closeCreateEventModal}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Betting Event</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Title</label>
            <Input
              placeholder="e.g., Liverpool vs Chelsea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BetType.SPORTS}>Sports</SelectItem>
                <SelectItem value={BetType.CRYPTO}>Crypto</SelectItem>
                <SelectItem value={BetType.POLITICS}>Politics</SelectItem>
                <SelectItem value={BetType.ENTERTAINMENT}>Entertainment</SelectItem>
                <SelectItem value={BetType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subcategory</label>
            <Input
              placeholder="e.g., Premier League, Bitcoin Price, Presidential Election"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Description</label>
            <Textarea
              placeholder="Describe the event details..."
              className="h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Outcome Options</label>
            
            <div className="flex flex-col gap-3 mb-3">
              {outcomes.map((outcome) => (
                <div key={outcome.id} className="flex gap-3">
                  <Input
                    className="flex-1"
                    placeholder="Option (e.g., Team A wins)"
                    value={outcome.name}
                    onChange={(e) => handleOutcomeChange(outcome.id, "name", e.target.value)}
                  />
                  <Input
                    className="w-24"
                    placeholder="Odds"
                    value={outcome.odds}
                    onChange={(e) => handleOutcomeChange(outcome.id, "odds", e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={addOutcome}
            >
              <i className="ri-add-line"></i>
              Add Another Option
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Initial Liquidity Pool</label>
            <div className="relative">
              <Input
                placeholder="0.00"
                className="pr-16"
                value={liquidityAmount}
                onChange={handleLiquidityAmountChange}
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
            <p className="text-xs text-gray-500 mt-1">
              Minimum {MIN_EVENT_CREATION_AMOUNT} ETH to create an event
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Platform Fee (1%)</span>
              <span className="font-medium">{platformFee} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Creator Fee (1% of all bets)</span>
              <span className="font-medium">-</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          {isConnected ? (
            <Button onClick={handleCreateEvent}>Create Event</Button>
          ) : (
            <div className="w-full">
              <p className="text-sm text-center text-gray-500 mb-2">
                Please connect your wallet to create an event
              </p>
              <WalletConnector />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
