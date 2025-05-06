import {
  users,
  type User,
  type InsertUser,
  events,
  type Event,
  type InsertEvent,
  outcomes,
  type Outcome,
  bets,
  type Bet,
  type InsertBet,
  experts,
  type Expert,
  follows,
  type Follow,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Outcome operations
  getOutcomes(eventId: number): Promise<Outcome[]>;
  createOutcome(outcome: Omit<Outcome, "id">): Promise<Outcome>;
  
  // Bet operations
  getBet(id: number): Promise<Bet | undefined>;
  getUserBets(userId: number): Promise<Bet[]>;
  createBet(bet: InsertBet): Promise<Bet>;
  
  // Expert operations
  getExperts(): Promise<Expert[]>;
  getLeaderboard(): Promise<Expert[]>;
  followExpert(userId: number, expertId: number): Promise<void>;
  unfollowExpert(userId: number, expertId: number): Promise<void>;
  
  // Statistics
  getPlatformStats(): Promise<{
    totalBets: number;
    totalVolume: number;
    activeEvents: number;
    activeUsers: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private outcomes: Map<number, Outcome>;
  private bets: Map<number, Bet>;
  private experts: Map<number, Expert>;
  private follows: Map<string, Follow>;
  
  private userIdCounter: number;
  private eventIdCounter: number;
  private outcomeIdCounter: number;
  private betIdCounter: number;
  private expertIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.outcomes = new Map();
    this.bets = new Map();
    this.experts = new Map();
    this.follows = new Map();
    
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.outcomeIdCounter = 1;
    this.betIdCounter = 1;
    this.expertIdCounter = 1;
    
    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock experts
    const experts: Expert[] = [
      {
        id: this.expertIdCounter++,
        username: "CryptoSage",
        walletAddress: "0x1234567890AbCdEf1234567890AbCdEf12345678",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        specialty: "Crypto",
        winRate: 92.5,
        totalPredictions: 240,
        createdAt: new Date().toISOString(),
      },
      {
        id: this.expertIdCounter++,
        username: "SportsMaster",
        walletAddress: "0x2345678901BcDeF2345678901BcDeF23456789",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
        specialty: "Sports",
        winRate: 85.8,
        totalPredictions: 312,
        createdAt: new Date().toISOString(),
      },
    ];
    
    experts.forEach(expert => {
      this.experts.set(expert.id, expert);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === address
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getFeaturedEvents(): Promise<Event[]> {
    // Get all events, sort by creation date and return the latest ones
    return Array.from(this.events.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    
    // Add end date if not provided
    let endDate = insertEvent.endDate;
    if (!endDate) {
      // Default to 24 hours after start date
      const startDate = new Date(insertEvent.startDate);
      startDate.setHours(startDate.getHours() + 24);
      endDate = startDate.toISOString();
    }
    
    const event: Event = { 
      ...insertEvent, 
      id,
      endDate,
      createdAt: new Date().toISOString(),
    };
    
    this.events.set(id, event);
    return event;
  }

  // Outcome methods
  async getOutcomes(eventId: number): Promise<Outcome[]> {
    return Array.from(this.outcomes.values()).filter(
      (outcome) => outcome.eventId === eventId
    );
  }

  async createOutcome(outcomeData: Omit<Outcome, "id">): Promise<Outcome> {
    const id = this.outcomeIdCounter++;
    const outcome: Outcome = { ...outcomeData, id };
    this.outcomes.set(id, outcome);
    return outcome;
  }

  // Bet methods
  async getBet(id: number): Promise<Bet | undefined> {
    return this.bets.get(id);
  }

  async getUserBets(userId: number): Promise<Bet[]> {
    return Array.from(this.bets.values()).filter(
      (bet) => bet.userId === userId
    );
  }

  async createBet(insertBet: InsertBet): Promise<Bet> {
    const id = this.betIdCounter++;
    const bet: Bet = { 
      ...insertBet, 
      id,
      date: new Date().toISOString(),
      status: "active",
    };
    this.bets.set(id, bet);
    return bet;
  }

  // Expert methods
  async getExperts(): Promise<Expert[]> {
    return Array.from(this.experts.values());
  }

  async getLeaderboard(): Promise<Expert[]> {
    // Return all experts sorted by win rate descending
    return Array.from(this.experts.values())
      .sort((a, b) => b.winRate - a.winRate);
  }

  async followExpert(userId: number, expertId: number): Promise<void> {
    const followId = `${userId}-${expertId}`;
    const follow: Follow = {
      id: followId,
      userId,
      expertId,
      createdAt: new Date().toISOString(),
    };
    this.follows.set(followId, follow);
  }

  async unfollowExpert(userId: number, expertId: number): Promise<void> {
    const followId = `${userId}-${expertId}`;
    this.follows.delete(followId);
  }

  // Statistics methods
  async getPlatformStats(): Promise<{
    totalBets: number;
    totalVolume: number;
    activeEvents: number;
    activeUsers: number;
  }> {
    // Count total bets
    const totalBets = this.bets.size;
    
    // Calculate total volume as sum of all bet amounts
    const totalVolume = Array.from(this.bets.values())
      .reduce((sum, bet) => sum + bet.amount, 0);
    
    // Count active events
    const now = new Date();
    const activeEvents = Array.from(this.events.values())
      .filter(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return startDate <= now && endDate >= now;
      }).length;
    
    // Count unique users who placed bets
    const uniqueUserIds = new Set(
      Array.from(this.bets.values()).map(bet => bet.userId)
    );
    const activeUsers = uniqueUserIds.size;
    
    return {
      totalBets,
      totalVolume,
      activeEvents,
      activeUsers,
    };
  }
}

export const storage = new MemStorage();
