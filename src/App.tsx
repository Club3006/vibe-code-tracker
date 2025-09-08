import { useEffect, useState } from "react";
import { ensureAnonAuth } from "./lib/firebase";
import { loadDaily, loadStreak, todayKey } from "./lib/firebase";
import type { DailyRecord, StreakMeta } from "./types";
import SidebarToday from "./components/SidebarToday";
import MorningCheckIn from "./components/MorningCheckIn";
import NavBar from "./components/NavBar";
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
    <div 
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)"
      }}
    >
      <NavBar />
      <Hero date={new Date(date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
      
      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {/* Give MorningCheckIn a way to notify App after save */}
            <MorningCheckIn onSaved={async () => {
              if (!uid) return;
              const [d, s] = await Promise.all([loadDaily(uid, date), loadStreak(uid)]);
              setDaily(d); setStreak(s);
            }} />
          </div>
          <div className="lg:col-span-4">
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
    </div>
  );
}