import { useEffect, useState } from "react";
import { ensureAnonAuth, loadDaily, saveDaily, loadStreak, saveStreak, todayKey } from "../lib/firebase";
import type { DailyRecord } from "../types";

export default function MorningCheckIn({ onSaved }: { onSaved?: () => void }) {
  const [uid, setUid] = useState<string | null>(null);
  const [date] = useState(todayKey());
  const [form, setForm] = useState<DailyRecord>(() => ({
    date,
    weight_lbs: null,
    glucose_mgdl: null,
    gym: false,
    morning_drink: false,
    meditation: false,
    checking_usd: null,
    savings_usd: null,
    pushups_goal: null,
    squats_goal: null,
    pushups_done: 0,
    squats_done: 0,
    inbound_goal: null,
    outbound_goal: null,
    inbound_done: 0,
    outbound_done: 0,
    morning_ritual_done: false
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await ensureAnonAuth();
      setUid(u.uid);
      const d = await loadDaily(u.uid, date);
      if (d) setForm(prev => ({ ...prev, ...d }));
    })();
  }, [date]);

  const setField = <K extends keyof DailyRecord>(k: K, v: DailyRecord[K]) => 
    setForm(f => ({ ...f, [k]: v }));

  const ritualComplete = (f: DailyRecord) =>
    !!f.weight_lbs && !!f.glucose_mgdl && f.gym && f.morning_drink && f.meditation;

  const save = async () => {
    if (!uid) return;
    setSaving(true);
    const done = ritualComplete(form);

    // 1) save daily with ritual flag
    await saveDaily(uid, date, { ...form, morning_ritual_done: done });

    // 2) update streak
    const meta = await loadStreak(uid);
    const y = new Date(date); y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);

    let current = meta.current_streak;
    let best = meta.best_streak;
    let last = meta.last_ritual_date;

    if (done) {
      const cont = (last === yesterday);
      current = cont ? (current + 1) : 1;
      best = Math.max(best, current);
      last = date;
    } else {
      current = 0; // break streak if ritual not complete
      // keep last as-is
    }
    await saveStreak(uid, { current_streak: current, best_streak: best, last_ritual_date: last });

    onSaved?.();
    setSaving(false);
  };

  const numOrNull = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return (
    <div className="vc-card">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Morning Check-In — {date}</h2>
        <span className={`vc-badge ${
          form.morning_ritual_done 
            ? "bg-green-500/20 text-green-100 border-green-400/30" 
            : "text-white/70 border-white/20"
        }`}>
          🔥 {form.morning_ritual_done ? "Ritual Complete" : "Ritual Not Complete"}
        </span>
      </div>

      {/* Two-column grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Weight and Glucose */}
        <div className="space-y-4">
          <Field label="Weight (lbs)">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter weight"
              value={form.weight_lbs ?? ""}
              onChange={e => setField("weight_lbs", numOrNull(e.target.value))}
            />
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Glucose (mg/dL)">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter glucose level"
              value={form.glucose_mgdl ?? ""}
              onChange={e => setField("glucose_mgdl", numOrNull(e.target.value))}
            />
          </Field>
        </div>

        {/* Row 2: Morning Ritual - Left col has Gym + Morning Drink, Right col has Meditation */}
        <div className="space-y-4">
          <div className="space-y-3">
            <CheckboxField 
              label="Gym" 
              checked={form.gym} 
              onChange={v => setField("gym", v)} 
            />
            <CheckboxField 
              label="Morning Drink" 
              checked={form.morning_drink} 
              onChange={v => setField("morning_drink", v)} 
            />
          </div>
        </div>
        <div className="space-y-4 flex items-center justify-center">
          <CheckboxField 
            label="Meditation" 
            checked={form.meditation} 
            onChange={v => setField("meditation", v)} 
          />
        </div>

        {/* Row 3: Checking and Savings */}
        <div className="space-y-4">
          <Field label="Checking ($)">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter checking balance"
              value={form.checking_usd ?? ""}
              onChange={e => setField("checking_usd", numOrNull(e.target.value))}
            />
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Savings ($)">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter savings balance"
              value={form.savings_usd ?? ""}
              onChange={e => setField("savings_usd", numOrNull(e.target.value))}
            />
          </Field>
        </div>

        {/* Row 4: Pushups and Squats Goals */}
        <div className="space-y-4">
          <Field label="Pushups Goal (reps)">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter pushups goal"
              value={form.pushups_goal ?? ""}
              onChange={e => setField("pushups_goal", numOrNull(e.target.value))}
            />
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Squats Goal (reps)">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter squats goal"
              value={form.squats_goal ?? ""}
              onChange={e => setField("squats_goal", numOrNull(e.target.value))}
            />
          </Field>
        </div>

        {/* Row 5: Inbound and Outbound Goals */}
        <div className="space-y-4">
          <Field label="Inbound Goal">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter inbound goal"
              value={form.inbound_goal ?? ""}
              onChange={e => setField("inbound_goal", numOrNull(e.target.value))}
            />
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Outbound Goal">
            <input
              type="number"
              className="vc-input"
              placeholder="Enter outbound goal"
              value={form.outbound_goal ?? ""}
              onChange={e => setField("outbound_goal", numOrNull(e.target.value))}
            />
          </Field>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6">
        <button
          onClick={save}
          disabled={saving}
          className="vc-btn"
        >
          {saving ? "Saving..." : "Save Morning Check-In"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="vc-label">{label}</div>
      {children}
    </div>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        className="vc-check"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="text-sm text-white/85">{label}</span>
    </label>
  );
}