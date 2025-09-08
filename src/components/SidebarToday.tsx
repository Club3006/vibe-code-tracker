interface SidebarTodayProps {
  streakCurrent: number;
  streakBest: number;
  ritualDone: boolean;
  pushups: { done: number; goal: number | null };
  squats: { done: number; goal: number | null };
  inbounds: { done: number; goal: number | null };
  outbounds: { done: number; goal: number | null };
}

export default function SidebarToday({ streakCurrent, streakBest, ritualDone, pushups, squats, inbounds, outbounds }: SidebarTodayProps) {
  return (
    <div className="vc-card min-h-[260px]">
      {/* 2-row grid inside the dashboard card */}
      <div className="grid grid-rows-[auto_auto] gap-6 h-full">
        {/* Row A: Streak band */}
        <div className="grid grid-cols-[auto_auto_1fr] items-center gap-4">
          {/* Streak chips */}
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-medium">
              Streak: {streakCurrent}
            </span>
            <span className="px-3 py-1 rounded-full border border-white/20 text-white/80 text-sm">
              Best: {streakBest}
            </span>
          </div>
          
          {/* Ritual progress ring (right aligned) */}
          <div className="flex justify-end">
            <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                ritualDone 
                  ? "bg-green-500/20 border-2 border-green-400/30" 
                  : "bg-white/5 border-2 border-white/20"
              }`}>
                <span className="text-lg">{ritualDone ? "✓" : "○"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row B: Four gauges row */}
        <div className="grid grid-cols-4 gap-4">
          <Gauge label="Pushups" done={pushups.done} goal={pushups.goal} />
          <Gauge label="Squats" done={squats.done} goal={squats.goal} />
          <Gauge label="Inbounds" done={inbounds.done} goal={inbounds.goal} />
          <Gauge label="Outbounds" done={outbounds.done} goal={outbounds.goal} />
        </div>
      </div>
    </div>
  );
}

function Gauge({ label, done, goal }: { label: string; done: number; goal: number | null }) {
  const percentage = goal && goal > 0 ? Math.min(100, Math.round((done / goal) * 100)) : null;
  
  return (
    <div className="text-center">
      <div className="text-xs text-white/60 mb-1">{label}</div>
      <div className="text-lg font-semibold text-white">
        {goal ? (
          <>
            {done} / {goal}
            <div className="text-xs text-white/60 mt-1">{percentage}%</div>
          </>
        ) : (
          done
        )}
      </div>
    </div>
  );
}