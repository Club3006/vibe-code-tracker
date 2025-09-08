import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="h-16 bg-white/5 backdrop-blur border-b border-white/12">
      <div className="mx-auto max-w-6xl px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-400 to-fuchsia-500" />
          <span className="font-semibold text-white">VibeCode Daily Flow Tracker</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link to="/" className="hover:text-white transition-colors">Today</Link>
          <Link to="/focus" className="hover:text-white transition-colors">Focus Session</Link>
          <a href="#" className="hover:text-white transition-colors">History</a>
          <a href="#" className="hover:text-white transition-colors">Settings</a>
        </div>
      </div>
    </nav>
  );
}