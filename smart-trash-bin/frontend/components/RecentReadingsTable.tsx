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
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Data History</h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 uppercase">Synced</span>
      </div>

      {readings.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">No Data Available</p>
          <p className="mt-1 text-xs text-gray-400">Sensor readings will appear here</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-3 pr-4 font-semibold">Fill</th>
                <th className="pb-3 pr-4 font-semibold">Metrics</th>
                <th className="pb-3 text-right font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {readings.map((reading) => (
                <tr key={reading.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${reading.fill_percent > 80 ? 'bg-rose-500' : reading.fill_percent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="font-semibold text-gray-900">%{Math.round(reading.fill_percent)}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-700 capitalize">{reading.status.replace('_', ' ')}</span>
                      <span className="text-[10px] text-gray-400">{reading.distance_cm}cm • {reading.gas_raw} gas</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-[10px] font-medium text-gray-500 tabular-nums uppercase">
                      {new Date(reading.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
