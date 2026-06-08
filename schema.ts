import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, longtext, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Generation jobs table - tracks all AI generation tasks
 */
export const generations = mysqlTable("generations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  toolType: mysqlEnum("toolType", ["image-to-video", "virtual-try-on", "text-to-video", "video-upscale"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  
  // Input data
  inputData: longtext("inputData").notNull(), // JSON string with tool-specific inputs
  
  // Output data
  outputUrl: varchar("outputUrl", { length: 2048 }),
  outputKey: varchar("outputKey", { length: 512 }), // S3 storage key
  outputType: mysqlEnum("outputType", ["image", "video"]),
  
  // Metadata
  processingStartedAt: timestamp("processingStartedAt"),
  completedAt: timestamp("completedAt"),
  errorMessage: text("errorMessage"),
  progressPercent: int("progressPercent").default(0),
  estimatedTimeRemaining: int("estimatedTimeRemaining"), // in seconds
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = typeof generations.$inferInsert;

/**
 * Assets table - stores metadata for generated images and videos
 */
export const assets = mysqlTable("assets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  generationId: int("generationId"),
  
  assetType: mysqlEnum("assetType", ["image", "video"]).notNull(),
  toolType: mysqlEnum("toolType", ["image-to-video", "virtual-try-on", "text-to-video", "video-upscale"]).notNull(),
  
  // Storage
  storageUrl: varchar("storageUrl", { length: 2048 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  
  // Metadata
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSizeBytes: int("fileSizeBytes"),
  
  // Display
  thumbnailUrl: varchar("thumbnailUrl", { length: 2048 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  
  // Tracking
  downloadCount: int("downloadCount").default(0),
  isPublic: mysqlEnum("isPublic", ["true", "false"]).default("false"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

/**
 * Generation inputs table - stores detailed input parameters for each generation
 */
export const generationInputs = mysqlTable("generationInputs", {
  id: int("id").autoincrement().primaryKey(),
  generationId: int("generationId").notNull(),
  
  // Image-to-Video specific
  sourceImageUrl: varchar("sourceImageUrl", { length: 2048 }),
  sourceImageKey: varchar("sourceImageKey", { length: 512 }),
  motionPrompt: text("motionPrompt"),
  
  // Virtual Try-On specific
  modelImageUrl: varchar("modelImageUrl", { length: 2048 }),
  modelImageKey: varchar("modelImageKey", { length: 512 }),
  garmentImageUrl: varchar("garmentImageUrl", { length: 2048 }),
  garmentImageKey: varchar("garmentImageKey", { length: 512 }),
  
  // Text-to-Video specific
  textPrompt: text("textPrompt"),
  stylePreset: varchar("stylePreset", { length: 100 }),
  
  // Video Upscale specific
  sourceVideoUrl: varchar("sourceVideoUrl", { length: 2048 }),
  sourceVideoKey: varchar("sourceVideoKey", { length: 512 }),
  upscaleQuality: varchar("upscaleQuality", { length: 50 }), // e.g., "2x", "4x"
  
  // Common parameters
  duration: int("duration"), // in seconds
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GenerationInput = typeof generationInputs.$inferSelect;
export type InsertGenerationInput = typeof generationInputs.$inferInsert;

/**
 * User preferences table - stores user-specific settings
 */
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  defaultDuration: int("defaultDuration").default(5), // seconds
  defaultStyle: varchar("defaultStyle", { length: 100 }).default("cinematic"),
  autoDownload: mysqlEnum("autoDownload", ["true", "false"]).default("false"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;
