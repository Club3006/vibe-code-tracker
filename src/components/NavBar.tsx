import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const MENU = [
  { label: "Morning Check In", to: "/" },
  { label: "Update Check In", to: "/update" },
  { label: "Focus Session",   to: "/focus" },
  { label: "Coaching Session",to: "/coaching" },
  { label: "History",         to: "/history" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // close on outside click / Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header className="border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-400 to-fuchsia-500" />
          <span className="font-semibold">VibeCode Daily Flow Tracker</span>
        </Link>

        {/* Hamburger */}
        <button
          aria-label="Open menu"
          className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={() => setOpen(o => !o)}
        >
          <span className="sr-only">Open main menu</span>
          {/* icon (3 bars) */}
          <div className="flex flex-col gap-[5px]">
            <span className={`h-[2px] w-6 bg-white transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-[2px] w-6 bg-white transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div className="relative">
          <div
            ref={panelRef}
            className="absolute right-4 z-50 mt-2 w-64 rounded-2xl border border-white/12 bg-white/5 backdrop-blur shadow-xl overflow-hidden"
          >
            <nav className="py-2">
              {MENU.map(item => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-4 py-3 text-sm hover:bg-white/10 ${
                      active ? "text-cyan-300" : "text-white/90"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}