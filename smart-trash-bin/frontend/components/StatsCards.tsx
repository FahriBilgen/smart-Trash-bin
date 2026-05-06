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
    { label: "Average Fill", value: `${stats.average_fill}%`, sub: "Daily Average", color: "bg-blue-500" },
    { label: "Peak Fill", value: `${stats.max_fill}%`, sub: "Daily Maximum", color: "bg-rose-500" },
    { label: "Min Fill", value: `${stats.min_fill}%`, sub: "Daily Minimum", color: "bg-emerald-500" },
    { label: "Total Reports", value: stats.reading_count.toString(), sub: "Sensor Data", color: "bg-violet-500" },
    { label: "Alerts", value: stats.alarm_count.toString(), sub: "Issues Detected", color: "bg-amber-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {cards.map((card, i) => (
        <div key={i} className="card-premium p-5">
          <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full opacity-10 ${card.color}`} />
          
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">{card.label}</p>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900 leading-none">{card.value}</span>
              <span className="mt-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">{card.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
