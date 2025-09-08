import { PRESET_TASKS, type TaskKey } from "../lib/sessions";

export default function TaskChecklist({
  selected, onToggle
}: { selected: TaskKey[]; onToggle: (k: TaskKey) => void }) {
  return (
    <div className="space-y-2">
      {PRESET_TASKS.map(t => (
        <label key={t.key} className="flex items-center justify-between rounded-xl border border-white/12 bg-white/5 px-3 py-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="vc-check"
              checked={selected.includes(t.key)}
              onChange={() => onToggle(t.key)}
            />
            <span className="text-sm">{t.label}</span>
          </div>
          <span className="text-xs text-white/60">{t.type === "yn" ? "Y/N" : "count"}</span>
        </label>
      ))}
    </div>
  );
}
