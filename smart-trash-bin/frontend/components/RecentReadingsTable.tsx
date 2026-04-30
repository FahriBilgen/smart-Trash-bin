"use client";

// Sorumlu: Fahri
// FAHRI - Son ölçümlerin dashboard üzerinde gösterimi
// Kullanıcı sistemin geçmiş birkaç ölçümünü bu tabloda görebiliyor.

import type { LatestReading } from "../lib/api";

type Props = {
  readings: LatestReading[];
};

export default function RecentReadingsTable({ readings }: Props) {
  return (
    <div className="rounded-2xl border border-white bg-white/70 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Data History</h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600 uppercase">Synced</span>
      </div>

      {readings.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <p className="text-sm font-medium uppercase tracking-widest">No Data Available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="pb-3 pr-4">Fill</th>
                <th className="pb-3 pr-4">Metrics</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {readings.map((reading) => (
                <tr key={reading.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${reading.fill_percent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span className="font-bold text-gray-900">%{Math.round(reading.fill_percent)}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700 capitalize">{reading.status}</span>
                      <span className="text-[10px] text-gray-400">{reading.distance_cm}cm • {reading.gas_raw} gas</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-[10px] font-bold text-gray-500 tabular-nums uppercase">
                      {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
