"use client";

// Sorumlu: Mustafa + Fahri
// MUSTAFA + FAHRI
// Mustafa backend'den gelen günlük istatistiklerin anlamını kontrol etti.
// Fahri bu değerleri kullanıcıya kart yapısında gösterdi.

import type { DailyStats } from "../lib/api";

type Props = {
  stats: DailyStats | null;
};

export default function StatsCards({ stats }: Props) {
  if (!stats) return null;

  const cards = [
    { label: "Avg Fill", value: `${stats.average_fill}%`, sub: "Daily Average", color: "bg-blue-500" },
    { label: "Peak Fill", value: `${stats.max_fill}%`, sub: "Daily Maximum", color: "bg-rose-500" },
    { label: "Min Fill", value: `${stats.min_fill}%`, sub: "Daily Minimum", color: "bg-emerald-500" },
    { label: "Total Reports", value: stats.reading_count, sub: "Sensor Data", color: "bg-violet-500" },
    { label: "Alerts", value: stats.alarm_count, sub: "Issues Detected", color: "bg-amber-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((card, i) => (
        <div key={i} className="group relative overflow-hidden rounded-2xl border border-white bg-white/70 p-5 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-2xl">
          <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full opacity-10 ${card.color}`} />
          
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{card.label}</p>
          <div className="mt-2 flex flex-col">
            <span className="text-3xl font-black text-gray-900 leading-none">{card.value}</span>
            <span className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
