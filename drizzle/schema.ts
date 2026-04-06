import { pgTable, serial, text, timestamp, varchar, index, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["pending", "approved", "rejected", "blacklist"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull().unique(),
  password: text("password"),
  openId: varchar("openId", { length: 64 }).unique(),
  nickname: varchar("nickname", { length: 128 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  bank: varchar("bank", { length: 64 }),
  account: varchar("account", { length: 64 }),
  exchangePw: text("exchangePw"),
  phone: varchar("phone", { length: 20 }),
  recentSite: text("recentSite"),
  status: statusEnum("status").default("pending").notNull(),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
}, (table) => ({
  userIdIdx: index("userId_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
