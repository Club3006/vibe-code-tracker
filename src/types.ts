export interface DailyRecord {
  date: string;
  weight_lbs: number | null;
  glucose_mgdl: number | null;
  gym: boolean;
  morning_drink: boolean;
  meditation: boolean;
  checking_usd: number | null;
  savings_usd: number | null;
  pushups_goal: number | null;
  squats_goal: number | null;
  pushups_done: number;
  squats_done: number;
  inbound_goal: number | null;
  outbound_goal: number | null;
  inbound_done: number;
  outbound_done: number;
  morning_ritual_done: boolean;
  updated_at?: number;
}

export interface StreakMeta {
  current_streak: number;
  best_streak: number;
  last_ritual_date: string | null;
}
