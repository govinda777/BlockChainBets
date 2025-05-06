import React, { createContext, useState, useCallback } from "react";
import { Event, EventOutcome } from "./EventsContext";
import { BetStatus } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface Bet {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  subcategory: string;
  selection: string;
  odds: number;
  amount: number;
  date: string;
  status: BetStatus;
  isActive: boolean;
}

interface BetsContextType {
  allBets: Bet[];
  activeBets: Bet[];
  isLoading: boolean;
  betModalOpen: boolean;
  currentEvent: Event | null;
  selectedOutcome: EventOutcome | null;
  openBetModal: (event: Event) => void;
  closeBetModal: () => void;
  setSelectedOutcome: (outcome: EventOutcome | null) => void;
  placeBet: (amount: number) => Promise<void>;
  fetchUserBets: () => Promise<void>;
}

export const BetsContext = createContext<BetsContextType>({
  allBets: [],
  activeBets: [],
  isLoading: false,
  betModalOpen: false,
  currentEvent: null,
  selectedOutcome: null,
  openBetModal: () => {},
  closeBetModal: () => {},
  setSelectedOutcome: () => {},
  placeBet: async () => {},
  fetchUserBets: async () => {},
});

interface BetsProviderProps {
  children: React.ReactNode;
}

export const BetsProvider: React.FC<BetsProviderProps> = ({ children }) => {
  const [allBets, setAllBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<EventOutcome | null>(null);
  const { toast } = useToast();

  // For MVP purposes, we'll use mock bets but in a real app these would be fetched from the blockchain or API
  const mockBets: Bet[] = [
    {
      id: "1",
      eventId: "1",
      eventTitle: "Arsenal vs. Man United",
      category: "Sports",
      subcategory: "Premier League",
      selection: "Arsenal",
      odds: 2.12,
      amount: 0.5,
      date: "2023-09-17T14:30:00Z",
      status: BetStatus.ACTIVE,
      isActive: true,
    },
    {
      id: "2",
      eventId: "2",
      eventTitle: "Bitcoin Price >$80k",
      category: "Crypto",
      subcategory: "Price Prediction",
      selection: "Yes",
      odds: 3.45,
      amount: 0.2,
      date: "2023-09-15T10:00:00Z",
      status: BetStatus.ACTIVE,
      isActive: false,
    },
    {
      id: "3",
      eventId: "3",
      eventTitle: "Lakers vs Celtics",
      category: "Sports",
      subcategory: "NBA",
      selection: "Lakers",
      odds: 1.95,
      amount: 1.5,
      date: "2023-09-10T18:00:00Z",
      status: BetStatus.WON,
      isActive: false,
    },
    {
      id: "4",
      eventId: "4",
      eventTitle: "Bitcoin > $60,000",
      category: "Crypto",
      subcategory: "Price Prediction",
      selection: "Yes",
      odds: 2.25,
      amount: 0.8,
      date: "2023-09-05T09:00:00Z",
      status: BetStatus.LOST,
      isActive: false,
    },
  ];

  const fetchUserBets = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from the API
      // const response = await apiRequest('GET', '/api/bets', undefined);
      // const data = await response.json();
      // setAllBets(data);

      // For the MVP, we'll use mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllBets(mockBets);
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast({
        title: "Failed to load bets",
        description: "There was an error loading your bets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const openBetModal = useCallback((event: Event) => {
    setCurrentEvent(event);
    setBetModalOpen(true);
    setSelectedOutcome(null); // Reset selected outcome
  }, []);

  const closeBetModal = useCallback(() => {
    setBetModalOpen(false);
    setCurrentEvent(null);
    setSelectedOutcome(null);
  }, []);

  const placeBet = useCallback(async (amount: number) => {
    if (!currentEvent || !selectedOutcome) {
      throw new Error("Event or outcome not selected");
    }

    try {
      // In a real implementation, this would place a bet through the API/blockchain
      // const response = await apiRequest('POST', '/api/bets', {
      //   eventId: currentEvent.id,
      //   outcomeId: selectedOutcome.id,
      //   amount,
      // });
      
      // For the MVP, we'll simulate a successful bet
      // Create a new bet
      const newBet: Bet = {
        id: `bet-${Date.now()}`,
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        category: currentEvent.category,
        subcategory: currentEvent.subcategory,
        selection: selectedOutcome.name,
        odds: selectedOutcome.odds,
        amount: amount,
        date: new Date().toISOString(),
        status: BetStatus.ACTIVE,
        isActive: true,
      };
      
      // Add the new bet to the list
      setAllBets(prevBets => [newBet, ...prevBets]);
      
      return;
    } catch (error) {
      console.error("Error placing bet:", error);
      throw new Error("Failed to place bet. Please try again.");
    }
  }, [currentEvent, selectedOutcome]);

  // Calculate active bets
  const activeBets = allBets.filter(bet => bet.status === BetStatus.ACTIVE);

  return (
    <BetsContext.Provider
      value={{
        allBets,
        activeBets,
        isLoading,
        betModalOpen,
        currentEvent,
        selectedOutcome,
        openBetModal,
        closeBetModal,
        setSelectedOutcome,
        placeBet,
        fetchUserBets,
      }}
    >
      {children}
    </BetsContext.Provider>
  );
};
