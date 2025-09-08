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
      actual_minutes: r.actual_minutes
    });
    setShowSummary(false);
    // Reset for next session
    setSessionId(null);
    setChosen([]);
  };

  return (
    <div className="vc-card space-y-4">
      <h3 className="text-lg font-semibold text-white">Focus Session</h3>
      
      <div className="space-y-4">
        <div>
          <div className="vc-label mb-2">Choose tasks for this block</div>
          <TaskChecklist selected={chosen} onToggle={toggle} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="vc-label">Expected time (minutes)</div>
            <input 
              className="vc-input" 
              type="number" 
              value={expected}
              onChange={e => setExpected(Math.max(1, Number(e.target.value)||25))}
            />
          </div>
          <div className="flex items-end">
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

        {sessionId && (
          <PomodoroTimer minutes={expected} onFinish={onTimerFinish} />
        )}
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
