interface SidebarTodayProps {
  streakCurrent: number;
  streakBest: number;
  ritualDone: boolean;
  pushups: { done: number; goal: number | null };
  squats: { done: number; goal: number | null };
}

export default function SidebarToday({ streakCurrent, streakBest, ritualDone, pushups, squats }: SidebarTodayProps) {
  return (
    <aside className="sticky top-6 space-y-6">
      {/* Card A: Morning Ritual Status */}
      <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-white">Morning Ritual</h3>
          <span className={`text-xs px-2 py-1 rounded-full border ${
            ritualDone 
              ? "bg-green-500/20 text-green-100 border-green-400/30" 
              : "text-white/70 border-white/20"
          }`}>
            {ritualDone ? "✓ Complete" : "Not Complete"}
          </span>
        </div>
        <p className="text-sm text-white/80">
          Streak: <span className="font-semibold">{streakCurrent}</span> • Best: <span className="font-semibold">{streakBest}</span>
        </p>
      </div>

      {/* Card B: Today's Snapshot */}
      <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur p-4 shadow">
        <h3 className="font-medium text-white mb-3">Today's Snapshot</h3>
        <div className="space-y-3">
          <KpiRow label="Pushups" done={pushups.done} goal={pushups.goal} />
          <KpiRow label="Squats" done={squats.done} goal={squats.goal} />
        </div>
      </div>
    </aside>
  );
}

function KpiRow({ label, done, goal }: { label: string; done: number; goal: number | null }) {
  const percentage = goal && goal > 0 ? Math.min(100, Math.round((done / goal) * 100)) : null;
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/80">{label}</span>
      <span className="text-sm text-white">
        {goal ? (
          <>
            {done} / {goal} 
            <span className="text-white/60 ml-1">({percentage}%)</span>
          </>
        ) : (
          done
        )}
      </span>
    </div>
  );
}