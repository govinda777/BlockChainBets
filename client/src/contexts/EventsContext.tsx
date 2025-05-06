import React, { createContext, useState, useCallback } from "react";
import { BetType, EventStatus } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface EventOutcome {
  id: string;
  name: string;
  odds: number;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: EventStatus;
  outcomes: EventOutcome[];
  liquidityPool: number;
  creator: string;
}

interface EventCreateParams {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  startDate: string;
  liquidityPool: number;
  outcomes: Omit<EventOutcome, "id">[];
}

interface PlatformStats {
  totalBets: number;
  totalVolume: number;
  activeEvents: number;
  activeUsers: number;
}

interface Expert {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  latestPick: string;
  timeAgo: string;
  isFollowing: boolean;
  specialty: string;
  bio?: string;
  totalPredictions: number;
  profit: string;
  latestPicks?: Array<{
    id: string;
    event: string;
    prediction: string;
    date: string;
    result: "Pending" | "Won" | "Lost";
  }>;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  successRate: string;
  profit: string;
}

interface ActivityEntry {
  id: string;
  event: string;
  user: string;
  action: string;
  amount: string;
  time: string;
  status: "Active" | "Completed" | "Ended";
}

interface EventsContextType {
  allEvents: Event[];
  featuredEvents: Event[];
  topExperts: Expert[];
  allExperts: Expert[]; // Added for consistency with the Experts page
  leaderboard: LeaderboardEntry[];
  recentActivity: ActivityEntry[];
  platformStats: PlatformStats | null;
  isLoading: boolean;
  createEventModalOpen: boolean;
  openCreateEventModal: () => void;
  closeCreateEventModal: () => void;
  fetchEvents: () => Promise<void>;
  fetchFeaturedEvents: () => Promise<void>;
  fetchExperts: () => Promise<void>;
  followExpert: (expertId: string, follow: boolean) => Promise<void>;
  createEvent: (params: EventCreateParams) => Promise<void>;
}

export const EventsContext = createContext<EventsContextType>({
  allEvents: [],
  featuredEvents: [],
  topExperts: [],
  allExperts: [],
  leaderboard: [],
  recentActivity: [],
  platformStats: null,
  isLoading: false,
  createEventModalOpen: false,
  openCreateEventModal: () => {},
  closeCreateEventModal: () => {},
  fetchEvents: async () => {},
  fetchFeaturedEvents: async () => {},
  fetchExperts: async () => {},
  followExpert: async () => {},
  createEvent: async () => {},
});

interface EventsProviderProps {
  children: React.ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [topExperts, setTopExperts] = useState<Expert[]>([]);
  const [allExperts, setAllExperts] = useState<Expert[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock events data for MVP
  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Liverpool vs Chelsea",
      category: BetType.SPORTS,
      subcategory: "Premier League",
      description: "Premier League match between Liverpool and Chelsea",
      image: "https://images.unsplash.com/photo-1510051640316-cee0293bb199",
      startDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
      endDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: EventStatus.UPCOMING,
      outcomes: [
        { id: "1-1", name: "Liverpool", odds: 2.10 },
        { id: "1-2", name: "Draw", odds: 3.25 },
        { id: "1-3", name: "Chelsea", odds: 3.50 },
      ],
      liquidityPool: 5.0,
      creator: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
    {
      id: "2",
      title: "Bitcoin > $80,000 by EOY",
      category: BetType.CRYPTO,
      subcategory: "BTC Price Prediction",
      description: "Will Bitcoin exceed $80,000 by the end of the year?",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
      startDate: new Date(Date.now()).toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: EventStatus.ACTIVE,
      outcomes: [
        { id: "2-1", name: "Yes", odds: 3.25 },
        { id: "2-2", name: "No", odds: 1.45 },
      ],
      liquidityPool: 10.0,
      creator: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
    {
      id: "3",
      title: "Lakers vs Celtics",
      category: BetType.SPORTS,
      subcategory: "NBA",
      description: "Eastern Conference Finals game between Lakers and Celtics",
      image: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5",
      startDate: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // 28 hours from now
      endDate: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: EventStatus.UPCOMING,
      outcomes: [
        { id: "3-1", name: "Lakers", odds: 1.95 },
        { id: "3-2", name: "Celtics", odds: 1.85 },
      ],
      liquidityPool: 8.0,
      creator: "0x34A2Ac97a825cBa2aDe85c768DF24C86C3B19f21",
    },
  ];

  // Mock experts data for MVP
  const mockExperts: Expert[] = [
    {
      id: "1",
      name: "CryptoSage",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      winRate: 92,
      latestPick: "ETH/BTC Long Position",
      timeAgo: "12h ago",
      isFollowing: false,
      specialty: "Crypto",
      bio: "Crypto analyst with 5 years experience in market predictions. Specializing in Bitcoin and Ethereum price movements.",
      totalPredictions: 152,
      profit: "+230 ETH",
      latestPicks: [
        {
          id: "pick-1",
          event: "ETH Price > $3,000",
          prediction: "Yes",
          date: "12h ago",
          result: "Pending"
        },
        {
          id: "pick-2",
          event: "BTC/ETH Ratio",
          prediction: "BTC Outperforms",
          date: "3d ago",
          result: "Won"
        }
      ]
    },
    {
      id: "2",
      name: "SportsMaster",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      winRate: 85,
      latestPick: "Lakers ML vs. Celtics",
      timeAgo: "1d ago",
      isFollowing: false,
      specialty: "Sports",
      bio: "Former sports journalist turned betting analyst. Focus on NBA and Premier League predictions.",
      totalPredictions: 203,
      profit: "+185 ETH",
      latestPicks: [
        {
          id: "pick-3",
          event: "Lakers vs Celtics",
          prediction: "Lakers Win",
          date: "1d ago",
          result: "Pending"
        },
        {
          id: "pick-4",
          event: "Liverpool vs Chelsea",
          prediction: "Draw",
          date: "5d ago",
          result: "Lost"
        }
      ]
    },
  ];

  // Mock leaderboard data for MVP
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      id: "1",
      name: "CryptoWhale",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
      successRate: "98.2%",
      profit: "+1,245 ETH",
    },
    {
      rank: 2,
      id: "2",
      name: "SportsPro",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      successRate: "95.7%",
      profit: "+987 ETH",
    },
    {
      rank: 3,
      id: "3",
      name: "BettingKing",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      successRate: "93.5%",
      profit: "+756 ETH",
    },
    {
      rank: 4,
      id: "4",
      name: "CryptoSage",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
      successRate: "92.1%",
      profit: "+682 ETH",
    },
  ];

  // Mock recent activity data for MVP
  const mockActivity: ActivityEntry[] = [
    {
      id: "1",
      event: "Arsenal vs. Man United",
      user: "0x34A2Ac97a825cBa2aDe85c768DF24C86C3B19f21",
      action: "Placed Bet",
      amount: "0.5 ETH",
      time: "10 mins ago",
      status: "Active",
    },
    {
      id: "2",
      event: "ETH Price > $3,000",
      user: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      action: "Created Event",
      amount: "2.0 ETH",
      time: "24 mins ago",
      status: "Active",
    },
    {
      id: "3",
      event: "Lakers vs Celtics",
      user: "0x89B312A7F5B1dd96B7C9bcB3c729c1a4447B0132",
      action: "Won Bet",
      amount: "1.5 ETH",
      time: "2 hours ago",
      status: "Completed",
    },
    {
      id: "4",
      event: "Bitcoin > $60,000",
      user: "0x45D8C3D9A2913cE5696B85124a00D8267B7B32",
      action: "Lost Bet",
      amount: "0.8 ETH",
      time: "5 hours ago",
      status: "Ended",
    },
  ];

  // Mock platform stats for MVP
  const mockStats: PlatformStats = {
    totalBets: 23498,
    totalVolume: 5372,
    activeEvents: 453,
    activeUsers: 12845,
  };

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch events from the API
      // const response = await apiRequest('GET', '/api/events', undefined);
      // const data = await response.json();
      // setAllEvents(data);

      // For the MVP, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAllEvents(mockEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Failed to load events",
        description: "There was an error loading events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchFeaturedEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch featured events from the API
      // const response = await apiRequest('GET', '/api/events/featured', undefined);
      // const data = await response.json();
      // setFeaturedEvents(data);

      // For the MVP, we'll use the first 3 mock events
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeaturedEvents(mockEvents);
      setPlatformStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error("Error fetching featured events:", error);
      toast({
        title: "Failed to load featured events",
        description: "There was an error loading featured events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchExperts = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch experts from the API
      // const response = await apiRequest('GET', '/api/experts', undefined);
      // const data = await response.json();
      // setTopExperts(data);

      // For the MVP, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      setTopExperts(mockExperts);
      setAllExperts(mockExperts); // Set allExperts state for the Experts page
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error("Error fetching experts:", error);
      toast({
        title: "Failed to load experts",
        description: "There was an error loading experts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const followExpert = useCallback(async (expertId: string, follow: boolean) => {
    try {
      // In a real implementation, this would follow/unfollow an expert through the API
      // await apiRequest('POST', `/api/experts/${expertId}/follow`, { follow });

      // For the MVP, we'll update the local state
      setTopExperts(prevExperts =>
        prevExperts.map(expert =>
          expert.id === expertId
            ? { ...expert, isFollowing: follow }
            : expert
        )
      );
      
      // Also update allExperts
      setAllExperts(prevExperts =>
        prevExperts.map(expert =>
          expert.id === expertId
            ? { ...expert, isFollowing: follow }
            : expert
        )
      );
    } catch (error) {
      console.error("Error following expert:", error);
      toast({
        title: `Failed to ${follow ? "follow" : "unfollow"} expert`,
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const openCreateEventModal = useCallback(() => {
    setCreateEventModalOpen(true);
  }, []);

  const closeCreateEventModal = useCallback(() => {
    setCreateEventModalOpen(false);
  }, []);

  const createEvent = useCallback(async (params: EventCreateParams) => {
    try {
      // In a real implementation, this would create an event through the API/blockchain
      // const response = await apiRequest('POST', '/api/events', params);
      // const newEvent = await response.json();

      // For the MVP, we'll create a new event locally
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: params.title,
        category: params.category,
        subcategory: params.subcategory,
        description: params.description,
        image: params.category === BetType.SPORTS 
          ? "https://images.unsplash.com/photo-1510051640316-cee0293bb199"
          : params.category === BetType.CRYPTO
          ? "https://images.unsplash.com/photo-1639322537228-f710d846310a"
          : "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5",
        startDate: params.startDate,
        endDate: new Date(new Date(params.startDate).getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours after start
        createdAt: new Date().toISOString(),
        status: EventStatus.UPCOMING,
        outcomes: params.outcomes.map((outcome, index) => ({
          id: `${Date.now()}-${index}`,
          name: outcome.name,
          odds: outcome.odds,
        })),
        liquidityPool: params.liquidityPool,
        creator: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", // Mock creator address
      };

      // Add the new event to our lists
      setAllEvents(prevEvents => [newEvent, ...prevEvents]);
      setFeaturedEvents(prevEvents => [newEvent, ...prevEvents.slice(0, 2)]);

      return;
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Failed to create event. Please try again.");
    }
  }, []);

  return (
    <EventsContext.Provider
      value={{
        allEvents,
        featuredEvents,
        topExperts,
        allExperts,
        leaderboard,
        recentActivity,
        platformStats,
        isLoading,
        createEventModalOpen,
        openCreateEventModal,
        closeCreateEventModal,
        fetchEvents,
        fetchFeaturedEvents,
        fetchExperts,
        followExpert,
        createEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
