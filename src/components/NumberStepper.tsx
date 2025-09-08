export default function NumberStepper({
  label, value, onChange
}: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/12 bg-white/5 px-3 py-2">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button className="vc-badge" onClick={() => onChange(Math.max(0, value - 1))}>–</button>
        <input className="vc-input h-9 w-16 text-center" type="number" value={value}
               onChange={e => onChange(Math.max(0, Number(e.target.value)||0))}/>
        <button className="vc-badge" onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}
