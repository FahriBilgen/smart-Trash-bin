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
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Alerts</h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase">Live Feed</span>
      </div>

      {alerts.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">System Clear</p>
          <p className="mt-1 text-xs text-gray-400">No active alerts</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-3 pr-4 font-semibold">Type</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {alerts.map((alertItem) => (
                <tr key={alertItem.id} className="group transition-colors hover:bg-gray-50/50">
                  <td className="py-4 pr-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 capitalize">{alertItem.type.replace('_', ' ')}</span>
                      <span className="text-[10px] text-gray-400">{new Date(alertItem.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    {alertItem.acknowledged ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" /> Active
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {!alertItem.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alertItem.id)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                      >
                        Resolve
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
