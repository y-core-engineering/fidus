/**
 * Preference types for Fidus Memory
 */

export interface Preference {
  id: string;
  key: string;
  value: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  domain: string;
  is_exception?: boolean;
  created_at?: string;
  updated_at?: string;
  reinforcement_count?: number;  // How many times user accepted this preference
  rejection_count?: number;  // How many times user rejected this preference
}

export interface PreferenceGroup {
  domain: string;
  preferences: Preference[];
}
