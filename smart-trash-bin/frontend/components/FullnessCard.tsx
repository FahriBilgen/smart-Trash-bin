"use client";

// Sorumlu: Fahri
// FAHRI - Premium Doluluk Karti
// Kullanici burada cop kutusunun doluluk oranini gorsel bir "bin" ikonografisi ile gorur.

import type { LatestReading } from "../lib/api";

type Props = {
  reading: LatestReading | null;
};

function getStatusInfo(status: string) {
  switch (status) {
    case "normal":
      return { label: "SAFE", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-500" };
    case "warning":
      return { label: "CHECK SOON", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-500" };
    case "full":
      return { label: "FULL", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", dot: "bg-rose-500" };
    case "odor_alert":
      return { label: "ODOR ALERT", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", dot: "bg-violet-500" };
    default:
      return { label: status.toUpperCase(), color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100", dot: "bg-gray-500" };
  }
}

export default function FullnessCard({ reading }: Props) {
  if (!reading) {
    return (
      <div className="rounded-2xl border border-white bg-white/70 p-8 shadow-xl backdrop-blur-md">
        <h2 className="text-xl font-bold text-gray-800">Current Status</h2>
        <div className="mt-6 flex flex-col items-center justify-center py-10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Waiting for sensor data...</p>
        </div>
      </div>
    );
  }

  const fillPercent = Math.round(reading.fill_percent);
  const statusInfo = getStatusInfo(reading.status);

  return (
    <div className="rounded-2xl border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">Bin Health</h2>
            <div className={`h-2 w-2 rounded-full animate-pulse ${statusInfo.dot}`} />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Last seen: {new Date(reading.created_at).toLocaleTimeString()}
          </p>
        </div>

        <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
          {statusInfo.label}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {/* Sol Taraf: Buyuk Sayi ve Gorsel Bar */}
        <div className="flex items-center gap-8">
          <div className="relative h-48 w-24 rounded-2xl bg-gray-100 p-1 shadow-inner border border-gray-200">
            {/* Cop Kutusu Ic Doluluk Animasyonu */}
            <div 
              className={`absolute bottom-1 left-1 right-1 rounded-xl transition-all duration-1000 ease-out flex items-center justify-center overflow-hidden
                ${fillPercent > 80 ? 'bg-gradient-to-t from-rose-500 to-rose-400' : 
                  fillPercent > 50 ? 'bg-gradient-to-t from-amber-500 to-amber-400' : 
                  'bg-gradient-to-t from-emerald-500 to-emerald-400'}`}
              style={{ height: `calc(${fillPercent}% - 8px)`, minHeight: fillPercent > 0 ? '20px' : '0' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-black text-gray-900 leading-none tracking-tighter">%{fillPercent}</span>
            </div>
            <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">Capasity Used</p>
          </div>
        </div>

        {/* Sag Taraf: Detayli Metrikler */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gray-50/50 border border-gray-100 p-5 transition-all hover:shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fill Depth</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900">{reading.distance_cm}</span>
              <span className="text-sm font-bold text-gray-500 uppercase">cm</span>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50/50 border border-gray-100 p-5 transition-all hover:shadow-md">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Air Quality</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900">{reading.gas_raw}</span>
              <span className="text-sm font-bold text-gray-500 uppercase">raw</span>
            </div>
          </div>

          <div className="col-span-2 rounded-2xl bg-indigo-600 p-5 shadow-lg shadow-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Device ID</p>
                <p className="mt-1 text-xl font-black text-white">#000{reading.bin_id}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
