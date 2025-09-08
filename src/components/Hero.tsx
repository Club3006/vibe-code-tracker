interface HeroProps {
  date: string;
}

export default function Hero({ date }: HeroProps) {
  return (
    <section className="py-8 border-b border-white/12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm text-white/60 mb-2">
          "Every day is a level. Every focus block is a quest. Every chip is a score. Every coaching moment is an upgrade. The only way to fail is to stop playing."
        </p>
        <h1 className="text-3xl font-bold text-white">Morning Check-In — {date}</h1>
      </div>
    </section>
  );
}