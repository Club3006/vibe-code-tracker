import { useState } from "react";
import { PRESET_TASKS, type TaskKey } from "../lib/sessions";
import NumberStepper from "./NumberStepper";

export type SummaryResult = {
  completed: Partial<Record<TaskKey, boolean>>;
  counts:    { inbounds: number; outbounds: number };
  actual_minutes: number;
  pushups_done: number;
  squats_done: number;
};

export default function SessionSummary({
  open, chosen, onClose, onSubmit
}: {
  open: boolean;
  chosen: TaskKey[];
  expected: number;
  onClose: () => void;
  onSubmit: (r: SummaryResult) => void;
}) {
  const [actual, setActual] = useState("");
  const [yn, setYn] = useState<Partial<Record<TaskKey, boolean>>>({});
  const [inb, setInb] = useState(0);
  const [outb, setOutb] = useState(0);
  const [pushups, setPushups] = useState("");
  const [squats, setSquats] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4">
      <div className="vc-card w-full max-w-lg border-indigo-400/30 bg-indigo-500/10">
        <h3 className="vc-h2">Session Summary</h3>
        <p className="vc-help mb-3">Mark results for this focus block.</p>

        <div className="space-y-3">
          {chosen.map(k => {
            const t = PRESET_TASKS.find(x => x.key === k)!;
            if (t.type === "yn") {
              return (
                <label key={k} className="flex items-center justify-between rounded-xl border border-white/12 bg-white/5 px-3 py-2">
                  <span className="text-sm">{t.label}</span>
                  <input type="checkbox" className="vc-check"
                         checked={!!yn[k]} onChange={e => setYn(v => ({...v, [k]: e.target.checked}))}/>
                </label>
              );
            }
            if (k === "inbounds" || k === "outbounds") {
              const value = k === "inbounds" ? inb : outb;
              const set   = k === "inbounds" ? setInb : setOutb;
              return <NumberStepper key={k} label={t.label} value={value} onChange={set} />;
            }
            return null;
          })}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <div className="vc-label">Pushups Done</div>
              <input className="vc-input text-white" type="text" placeholder="Enter count" value={pushups} onChange={e => setPushups(e.target.value)} />
            </label>
            <label className="block">
              <div className="vc-label">Squats Done</div>
              <input className="vc-input text-white" type="text" placeholder="Enter count" value={squats} onChange={e => setSquats(e.target.value)} />
            </label>
          </div>
          <label className="block">
            <div className="vc-label">Actual time (minutes)</div>
            <input className="vc-input text-white" type="text" placeholder="Enter minutes" value={actual}
                   onChange={e => setActual(e.target.value)}/>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="vc-badge" onClick={onClose}>Cancel</button>
          <button
            className="vc-btn"
            onClick={() => onSubmit({ completed: yn, counts: { inbounds: inb, outbounds: outb }, actual_minutes: Number(actual) || 0, pushups_done: Number(pushups) || 0, squats_done: Number(squats) || 0 })}
          >Save Session</button>
        </div>
      </div>
    </div>
  );
}
