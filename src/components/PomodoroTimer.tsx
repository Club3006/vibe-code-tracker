import { useEffect, useRef, useState } from "react";

export default function PomodoroTimer({
  minutes, onFinish
}: { minutes: number; onFinish: () => void }) {
  const total = minutes * 60;
  const [left, setLeft] = useState<number>(() => {
    const saved = sessionStorage.getItem("focus_left");
    return saved ? Number(saved) : total;
  });
  const [running, setRunning] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let id: any;
    if (running) {
      id = setInterval(() => setLeft(s => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    sessionStorage.setItem("focus_left", String(left));
    if (left === 0) {
      setRunning(false);
      audioRef.current?.play().catch(()=>{});
      onFinish();
    }
  }, [left, onFinish]);

  const mm = String(Math.floor(left/60)).padStart(2,"0");
  const ss = String(left%60).padStart(2,"0");

  return (
    <div className="rounded-2xl border border-white/12 bg-white/5 p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-white/70">Session Timer</div>
        <div className="text-3xl font-semibold">{mm}:{ss}</div>
      </div>
      <div className="flex gap-2">
        {!running ? (
          <button className="vc-btn" onClick={() => setRunning(true)}>Start</button>
        ) : (
          <button className="vc-badge" onClick={() => setRunning(false)}>Pause</button>
        )}
        <button className="vc-badge" onClick={() => { setLeft(total); setRunning(false); }}>Reset</button>
      </div>
      <audio ref={audioRef} src="/chime.mp3" preload="auto" />
    </div>
  );
}
