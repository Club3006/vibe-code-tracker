import { useEffect, useState } from "react";
import { ensureAnonAuth } from "../lib/firebase";
import { todayKey } from "../lib/firebase";
import { type TaskKey, createSession, finalizeSession } from "../lib/sessions";
import TaskChecklist from "./TaskChecklist";
import PomodoroTimer from "./PomodoroTimer";
import SessionSummary, { type SummaryResult } from "./SessionSummary";

export default function InlineFocusSession() {
  const [uid, setUid] = useState<string>("");
  const [date] = useState(todayKey());
  const [chosen, setChosen] = useState<TaskKey[]>([]);
  const [expected, setExpected] = useState<number>(25);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => { ensureAnonAuth().then(u => setUid(u.uid)); }, []);

  const toggle = (k: TaskKey) =>
    setChosen(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);

  const start = async () => {
    const id = await createSession(uid, date, {
      uid, date, chosen, expected_minutes: expected, started_at: Date.now()
    });
    setSessionId(id);
  };

  const onTimerFinish = () => setShowSummary(true);

  const saveResults = async (r: SummaryResult) => {
    if (!sessionId) return;
    await finalizeSession(uid, date, sessionId, {
      completed: r.completed,
      counts: r.counts,
      actual_minutes: r.actual_minutes,
      pushups_done: r.pushups_done,
      squats_done: r.squats_done
    });
    setShowSummary(false);
    // Reset for next session
    setSessionId(null);
    setChosen([]);
  };

  return (
    <div className="vc-card h-full min-h-[560px]">
      <div className="grid h-full gap-4 grid-rows-[auto_12rem_auto]">
        {/* Row 1: checklist + expected mins + Start Session */}
        <div className="space-y-4">
          <div>
            <div className="vc-label mb-2">Choose tasks for this block</div>
            <TaskChecklist selected={chosen} onToggle={toggle} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-4">
            <label className="block">
              <div className="vc-label">Expected time (minutes)</div>
              <input 
                className="vc-input text-white" 
                type="number" 
                value={expected}
                onChange={e => setExpected(Math.max(1, Number(e.target.value)||25))}
              />
            </label>
            <div className="flex sm:justify-end">
              {!sessionId ? (
                <button 
                  className="vc-btn" 
                  onClick={start} 
                  disabled={!chosen.length}
                >
                  Start Session
                </button>
              ) : (
                <span className="vc-badge">Session started</span>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: TIMER CONTAINER (fixed height) */}
        <div className="rounded-xl border border-white/12 bg-white/5 h-full px-4 py-3 flex">
          {sessionId && (
            <PomodoroTimer minutes={expected} onFinish={onTimerFinish} />
          )}
        </div>

        {/* Row 3: Coaching button (inside the card) */}
        <div className="flex justify-end">
          <button
            className="vc-btn"
            onClick={() => window.location.href = '/coaching'}
          >
            Coaching Session
          </button>
        </div>
      </div>

      <SessionSummary
        open={showSummary}
        chosen={chosen}
        expected={expected}
        onClose={() => setShowSummary(false)}
        onSubmit={saveResults}
      />
    </div>
  );
}
