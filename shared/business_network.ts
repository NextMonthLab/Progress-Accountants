import { z } from "zod";
import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { users } from "./schema";

// Business profiles table
export const businessProfiles = pgTable("business_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // References the user who owns the business profile
  tenantId: uuid("tenant_id"), // For linking to tenant (optional)
  businessName: varchar("business_name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  logo: varchar("logo", { length: 255 }),
  coverImage: varchar("cover_image", { length: 255 }),
  founded: varchar("founded", { length: 50 }),
  size: varchar("size", { length: 50 }),
  specialties: jsonb("specialties").default([]),
  verified: boolean("verified").default(false),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Business posts table
export const businessPosts = pgTable("business_posts", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => businessProfiles.id),
  content: text("content").notNull(),
  mediaUrls: jsonb("media_urls").default([]),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comments table
export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => businessPosts.id),
  profileId: integer("profile_id").notNull().references(() => businessProfiles.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Follows table
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => businessProfiles.id),
  followingId: integer("following_id").notNull().references(() => businessProfiles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    followerFollowingIdx: index("follower_following_idx").on(
      table.followerId,
      table.followingId
    ),
  };
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => businessProfiles.id),
  receiverId: integer("receiver_id").notNull().references(() => businessProfiles.id),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    senderReceiverIdx: index("sender_receiver_idx").on(
      table.senderId,
      table.receiverId
    ),
  };
});

// Define relationships
export const businessProfilesRelations = relations(businessProfiles, ({ many, one }) => ({
  user: one(users, {
    fields: [businessProfiles.userId],
    references: [users.id]
  }),
  posts: many(businessPosts),
  comments: many(postComments),
  followedBy: many(follows, { relationName: "follower" }),
  following: many(follows, { relationName: "following" }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const businessPostsRelations = relations(businessPosts, ({ one, many }) => ({
  profile: one(businessProfiles, {
    fields: [businessPosts.profileId],
    references: [businessProfiles.id],
  }),
  comments: many(postComments),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(businessPosts, {
    fields: [postComments.postId],
    references: [businessPosts.id],
  }),
  profile: one(businessProfiles, {
    fields: [postComments.profileId],
    references: [businessProfiles.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(businessProfiles, {
    fields: [follows.followerId],
    references: [businessProfiles.id],
    relationName: "follower",
  }),
  following: one(businessProfiles, {
    fields: [follows.followingId],
    references: [businessProfiles.id],
    relationName: "following",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(businessProfiles, {
    fields: [messages.senderId],
    references: [businessProfiles.id],
    relationName: "sender",
  }),
  receiver: one(businessProfiles, {
    fields: [messages.receiverId],
    references: [businessProfiles.id],
    relationName: "receiver",
  }),
}));

// Create insert schemas
export const insertBusinessProfileSchema = createInsertSchema(businessProfiles).omit({ 
  id: true, 
  followers: true, 
  following: true,
  createdAt: true,
  updatedAt: true
});

export const insertBusinessPostSchema = createInsertSchema(businessPosts).omit({ 
  id: true, 
  likes: true, 
  shares: true, 
  comments: true,
  createdAt: true,
  updatedAt: true
});

export const insertCommentSchema = createInsertSchema(postComments).omit({ 
  id: true, 
  likes: true,
  createdAt: true,
  updatedAt: true
});

export const insertFollowSchema = createInsertSchema(follows).omit({ 
  id: true,
  createdAt: true
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true, 
  read: true,
  createdAt: true
});

// Types
export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type BusinessPost = typeof businessPosts.$inferSelect;
export type Comment = typeof postComments.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Message = typeof messages.$inferSelect;

export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;
export type InsertBusinessPost = z.infer<typeof insertBusinessPostSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;