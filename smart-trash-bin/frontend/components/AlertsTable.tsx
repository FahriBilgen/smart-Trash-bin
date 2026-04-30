"use client";

// Sorumlu: Fahri + Alper
// FAHRI + ALPER
// Fahri: Alarm tablosunu ve kullanıcı butonunu hazırladı.
// Alper: Acknowledge butonunun backend PATCH endpointine bağlanmasını sağladı.

import type { AlertItem } from "../lib/api";
import { acknowledgeAlert } from "../lib/api";

type Props = {
  alerts: AlertItem[];
  onAlertUpdated?: () => void;
};

export default function AlertsTable({ alerts, onAlertUpdated }: Props) {
  async function handleAcknowledge(alertId: number) {
    try {
      await acknowledgeAlert(alertId);
      if (onAlertUpdated) onAlertUpdated();
    } catch (error) {
      console.error("Alert acknowledge error:", error);
      alert("Alarm onaylanamadi.");
    }
  }

  return (
    <div className="rounded-2xl border border-white bg-white/70 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Alerts</h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black text-indigo-600 uppercase">Live Feed</span>
      </div>

      {alerts.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">System Clear</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {alerts.map((alertItem) => (
                <tr key={alertItem.id} className="group transition-colors hover:bg-gray-50/50">
                  <td className="py-4 pr-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 capitalize">{alertItem.type}</span>
                      <span className="text-[10px] text-gray-400">{new Date(alertItem.created_at).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    {alertItem.acknowledged ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        <div className="h-1 w-1 rounded-full bg-emerald-500" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                        <div className="h-1 w-1 rounded-full bg-rose-500 animate-pulse" /> Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {!alertItem.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alertItem.id)}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
                      >
                        Solve
                      </button>
                    )}
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
