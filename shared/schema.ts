import { pgTable, text, serial, integer, boolean, numeric, timestamp, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  role: text("role").default("bettor").notNull(), // bettor, creator, expert, trader
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // sports, crypto, politics, entertainment, other
  subcategory: text("subcategory").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("upcoming").notNull(), // upcoming, active, completed, canceled
  liquidityPool: numeric("liquidity_pool").notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Outcomes table
export const outcomes = pgTable("outcomes", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  name: text("name").notNull(),
  odds: numeric("odds").notNull(),
});

export const insertOutcomeSchema = createInsertSchema(outcomes).omit({
  id: true,
});

export type InsertOutcome = z.infer<typeof insertOutcomeSchema>;
export type Outcome = typeof outcomes.$inferSelect;

// Bets table
export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  outcomeId: integer("outcome_id").references(() => outcomes.id).notNull(),
  amount: numeric("amount").notNull(),
  odds: numeric("odds").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").default("active").notNull(), // active, won, lost, refunded
});

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  date: true,
  status: true,
});

export type InsertBet = z.infer<typeof insertBetSchema>;
export type Bet = typeof bets.$inferSelect;

// Experts table (extended from users)
export const experts = pgTable("experts", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  walletAddress: text("wallet_address").notNull(),
  avatar: text("avatar"),
  specialty: text("specialty").notNull(), // sports, crypto, politics, entertainment
  winRate: numeric("win_rate").notNull(),
  totalPredictions: integer("total_predictions").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Expert = typeof experts.$inferSelect;

// Expert follows
export const follows = pgTable("follows", {
  id: text("id").primaryKey(), // userId-expertId composite key
  userId: integer("user_id").references(() => users.id).notNull(),
  expertId: integer("expert_id").references(() => experts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userExpertIdx: uniqueIndex("user_expert_idx").on(table.userId, table.expertId),
  };
});

export type Follow = typeof follows.$inferSelect;
