/**
 * Zod schemas for Preference validation
 */

import { z } from "zod";

export const PreferenceSchema = z.object({
  id: z.string().uuid().optional(),  // Optional for in-memory mode
  key: z.string().min(1),
  value: z.string(),
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(0.95),
  domain: z.string().min(1).optional(),  // Optional, can be derived from key
  is_exception: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  reinforcement_count: z.number().int().nonnegative().optional(),  // How many times user accepted
  rejection_count: z.number().int().nonnegative().optional(),  // How many times user rejected
});

export const PreferenceGroupSchema = z.object({
  domain: z.string(),
  preferences: z.array(PreferenceSchema),
});

export type Preference = z.infer<typeof PreferenceSchema>;
export type PreferenceGroup = z.infer<typeof PreferenceGroupSchema>;
