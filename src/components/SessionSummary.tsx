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
  open, chosen, expected, onClose, onSubmit
}: {
  open: boolean;
  chosen: TaskKey[];
  expected: number;
  onClose: () => void;
  onSubmit: (r: SummaryResult) => void;
}) {
  const [actual, setActual] = useState(expected);
  const [yn, setYn] = useState<Partial<Record<TaskKey, boolean>>>({});
  const [inb, setInb] = useState(0);
  const [outb, setOutb] = useState(0);
  const [pushups, setPushups] = useState(0);
  const [squats, setSquats] = useState(0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4">
      <div className="vc-card w-full max-w-lg">
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
              <input className="vc-input text-white" type="number" value={pushups} onChange={e => setPushups(Math.max(0, Number(e.target.value)||0))} />
            </label>
            <label className="block">
              <div className="vc-label">Squats Done</div>
              <input className="vc-input text-white" type="number" value={squats} onChange={e => setSquats(Math.max(0, Number(e.target.value)||0))} />
            </label>
          </div>
          <label className="block">
            <div className="vc-label">Actual time (minutes)</div>
            <input className="vc-input" type="number" value={actual}
                   onChange={e => setActual(Math.max(0, Number(e.target.value)||0))}/>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="vc-badge" onClick={onClose}>Cancel</button>
          <button
            className="vc-btn"
            onClick={() => onSubmit({ completed: yn, counts: { inbounds: inb, outbounds: outb }, actual_minutes: actual, pushups_done: pushups, squats_done: squats })}
          >Save Session</button>
        </div>
      </div>
    </div>
  );
}
