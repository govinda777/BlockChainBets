import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Define route schemas
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  walletAddress: z.string().optional(),
  role: z.enum(["bettor", "creator", "expert", "trader"]).default("bettor"),
});

const createEventSchema = z.object({
  title: z.string().min(5),
  category: z.string().min(1),
  subcategory: z.string().min(1),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  outcomes: z.array(z.object({
    name: z.string().min(1),
    odds: z.number().positive(),
  })),
  liquidityPool: z.number().positive(),
  creatorId: z.number(),
});

const placeBetSchema = z.object({
  userId: z.number(),
  eventId: z.number(),
  outcomeId: z.number(),
  amount: z.number().positive(),
  odds: z.number().positive(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await storage.createUser({
        username: validatedData.username,
        password: validatedData.password,
        walletAddress: validatedData.walletAddress,
        role: validatedData.role,
      });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const walletAddress = req.params.address;
      const user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Event routes
  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = createEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/events/featured", async (req, res) => {
    try {
      const events = await storage.getFeaturedEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Bet routes
  app.post("/api/bets", async (req, res) => {
    try {
      const validatedData = placeBetSchema.parse(req.body);
      const bet = await storage.createBet(validatedData);
      res.status(201).json(bet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/bets/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bets = await storage.getUserBets(userId);
      res.json(bets);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Expert routes
  app.get("/api/experts", async (req, res) => {
    try {
      const experts = await storage.getExperts();
      res.json(experts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/experts/:expertId/follow", async (req, res) => {
    try {
      const expertId = parseInt(req.params.expertId);
      const userId = req.body.userId;
      const follow = req.body.follow;
      
      if (follow) {
        await storage.followExpert(userId, expertId);
      } else {
        await storage.unfollowExpert(userId, expertId);
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Platform stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
