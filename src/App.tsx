import { useEffect, useState } from "react";
import { ensureAnonAuth } from "./lib/firebase";
import { loadDaily, loadStreak, todayKey } from "./lib/firebase";
import type { DailyRecord, StreakMeta } from "./types";
import SidebarToday from "./components/SidebarToday";
import MorningCheckIn from "./components/MorningCheckIn";
import InlineFocusSession from "./components/InlineFocusSession";
import Hero from "./components/Hero";

export default function App() {
  const [uid, setUid] = useState<string | null>(null);
  const [date] = useState(todayKey());
  const [daily, setDaily] = useState<DailyRecord | null>(null);
  const [streak, setStreak] = useState<StreakMeta | null>(null);

  useEffect(() => {
    (async () => {
      const u = await ensureAnonAuth();
      setUid(u.uid);
      const [d, s] = await Promise.all([loadDaily(u.uid, date), loadStreak(u.uid)]);
      setDaily(d);
      setStreak(s);
    })();
  }, [date]);

  const ritualDone = !!(daily?.weight_lbs && daily?.glucose_mgdl && daily?.gym && daily?.morning_drink && daily?.meditation);

  return (
    <>
      <Hero date={new Date(date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
      
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side - Morning Check-In */}
          <div className="lg:col-span-6">
            <MorningCheckIn onSaved={async () => {
              if (!uid) return;
              const [d, s] = await Promise.all([loadDaily(uid, date), loadStreak(uid)]);
              setDaily(d); setStreak(s);
            }} />
          </div>
          
          {/* Right side - Focus Session */}
          <div className="lg:col-span-6">
            <InlineFocusSession />
          </div>
        </div>
        
        {/* Bottom row - Sidebar */}
        <div className="mt-6">
          <div className="max-w-2xl mx-auto">
            <SidebarToday
              streakCurrent={streak?.current_streak ?? 0}
              streakBest={streak?.best_streak ?? 0}
              ritualDone={ritualDone}
              pushups={{ done: daily?.pushups_done ?? 0, goal: daily?.pushups_goal ?? null }}
              squats={{ done: daily?.squats_done ?? 0, goal: daily?.squats_goal ?? null }}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/12 mt-12">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <p className="text-xs text-white/50 text-center">
            © {new Date().getFullYear()} VibeCode Daily Flow. All quests reserved.
          </p>
        </div>
      </footer>
    </>
  );
}