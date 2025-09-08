import { useEffect, useState } from "react";
import { ensureAnonAuth } from "../lib/firebase";
import { todayKey } from "../lib/firebase";
import { type TaskKey, createSession, finalizeSession } from "../lib/sessions";
import TaskChecklist from "../components/TaskChecklist";
import PomodoroTimer from "../components/PomodoroTimer";
import SessionSummary, { type SummaryResult } from "../components/SessionSummary";

export default function FocusSession() {
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
    // navigate back or toast "Saved"; your choice
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-6 space-y-6">
      <h1 className="vc-h1">Focus Session</h1>

      <div className="vc-card space-y-4">
        <h3 className="vc-sec">Choose tasks for this block</h3>
        <TaskChecklist selected={chosen} onToggle={toggle} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <div className="vc-label">Expected time (minutes)</div>
            <input className="vc-input" type="number" value={expected}
                   onChange={e => setExpected(Math.max(1, Number(e.target.value)||25))}/>
          </label>
          <div className="flex items-end">
            {!sessionId ? (
              <button className="vc-btn" onClick={start} disabled={!chosen.length}>Start Session</button>
            ) : (
              <span className="vc-badge">Session started</span>
            )}
          </div>
        </div>

        <PomodoroTimer minutes={expected} onFinish={onTimerFinish} />
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
